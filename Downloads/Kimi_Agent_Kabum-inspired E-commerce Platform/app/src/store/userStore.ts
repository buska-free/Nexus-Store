import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Address } from '@/types';
import { useEmailStore } from '@/store/emailStore';
import { useMessageStore } from '@/store/messageStore';

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  
  // Actions
  // login returns 'ok' | 'invalid' | 'unverified'
  login: (email: string, password: string) => Promise<'ok' | 'invalid' | 'unverified'>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  // register with phone number (sends verification code)
  registerWithPhone: (name: string, phone: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  // verification helpers
  resendVerification: (email: string) => string | null;
  verifyAccount: (token: string) => boolean;
  // phone verification helpers
  sendPhoneVerification: (phone: string) => string | null;
  verifyPhoneCode: (code: string) => boolean;
  // social login (mock)
  loginWithGoogle: () => Promise<boolean>;
  loginWithFacebook: () => Promise<boolean>;
}

// Mock accounts for demo (kept internal to store)
const MOCK_USERS = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    verified: true,
    addresses: [
      {
        id: '1',
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01001-000',
        isDefault: true,
      },
    ],
  },
];

type Account = {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  phone?: string;
  cpf?: string;
  verified?: boolean;
  addresses?: Address[];
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      // internal accounts list for demo (stored with persist)
      // @ts-ignore - extending store
      accounts: MOCK_USERS as Account[],

      login: async (email, password) => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        // find account
        // @ts-ignore
        const accounts: Account[] = get().accounts || [];
        const account = accounts.find((a) => a.email === email);
        if (!account) return 'invalid';

        if (account.password !== password) return 'invalid';
        if (!account.verified) return 'unverified';

        const { password: _, ...userWithoutPassword } = account as any;
        set({ user: userWithoutPassword as User, isAuthenticated: true });
        return 'ok';
      },

      register: async (name, email, password) => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        // basic check
        // @ts-ignore
        const accounts: Account[] = get().accounts || [];
        if (accounts.some((a) => a.email === email)) return false;

        const newAccount: Account = {
          id: Date.now().toString(),
          name,
          email,
          password,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          verified: false,
          addresses: [],
        };

        // persist account
        // @ts-ignore
        set((state) => ({ accounts: [...(state.accounts || []), newAccount] }));

        // generate verification token and save mapping in localStorage
        const token = `verify_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const mapRaw = localStorage.getItem('verification_tokens');
        const map = mapRaw ? JSON.parse(mapRaw) : {};
        map[token] = email;
        localStorage.setItem('verification_tokens', JSON.stringify(map));

        // push a demo verification email into the Sent Emails inbox
        try {
          const link = `${window.location.origin}/verificar?token=${token}`;
          useEmailStore.getState().addEmail({
            id: token,
            to: email,
            subject: 'Verifique sua conta',
            body: `Olá ${name},\n\nClique no link abaixo para verificar sua conta:\n${link}\n\nSe você não criou essa conta, ignore este e-mail.`,
            createdAt: new Date().toISOString(),
          });
        } catch (e) {
          // ignore for environments without window
        }

        return true;
      },

      registerWithPhone: async (name, phone, password) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        // @ts-ignore
        const accounts: Account[] = get().accounts || [];
        if (accounts.some((a) => a.phone === phone)) return false;

        const newAccount: Account = {
          id: Date.now().toString(),
          name,
          email: `${phone}@phone.local`,
          password: password || Math.random().toString(36).slice(2, 8),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${phone}`,
          phone,
          verified: false,
          addresses: [],
        };

        // persist account
        // @ts-ignore
        set((state) => ({ accounts: [...(state.accounts || []), newAccount] }));

        // send verification code via SMS/WhatsApp (demo)
        const code = `code_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
        const mapRaw = localStorage.getItem('verification_codes');
        const map = mapRaw ? JSON.parse(mapRaw) : {};
        map[code] = phone;
        localStorage.setItem('verification_codes', JSON.stringify(map));

        try {
          const link = `${window.location.origin}/verificar-codigo?code=${code}`;
          useMessageStore.getState().addMessage({
            id: `${code}_sms`,
            to: phone,
            channel: 'sms',
            body: `Seu código de verificação é: ${code}\n${link}`,
            createdAt: new Date().toISOString(),
          });
          useMessageStore.getState().addMessage({
            id: `${code}_whatsapp`,
            to: phone,
            channel: 'whatsapp',
            body: `Seu código de verificação é: ${code}\nAbra: ${link}`,
            createdAt: new Date().toISOString(),
          });
        } catch (e) {}

        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },

      addAddress: (address) => {
        set((state) => {
          if (!state.user) return state;
          
          const newAddress: Address = {
            ...address,
            id: Date.now().toString(),
          };
          
          const addresses = state.user.addresses || [];
          
          // If first address, make it default
          if (addresses.length === 0) {
            newAddress.isDefault = true;
          }
          
          return {
            user: {
              ...state.user,
              addresses: [...addresses, newAddress],
            },
          };
        });
      },

      removeAddress: (addressId) => {
        set((state) => {
          if (!state.user) return state;
          
          const addresses = (state.user.addresses || []).filter(
            (a) => a.id !== addressId
          );
          
          // If removed default, set new default
          if (addresses.length > 0 && !addresses.some((a) => a.isDefault)) {
            addresses[0].isDefault = true;
          }
          
          return {
            user: {
              ...state.user,
              addresses,
            },
          };
        });
      },

      setDefaultAddress: (addressId) => {
        set((state) => {
          if (!state.user) return state;
          
          return {
            user: {
              ...state.user,
              addresses: (state.user.addresses || []).map((a) => ({
                ...a,
                isDefault: a.id === addressId,
              })),
            },
          };
        });
      },

      resendVerification: (email) => {
        // generate and return token (for demo)
        // check account exists
        // @ts-ignore
        const accounts: Account[] = get().accounts || [];
        const account = accounts.find((a) => a.email === email);
        if (!account) return null;
        const token = `verify_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const mapRaw = localStorage.getItem('verification_tokens');
        const map = mapRaw ? JSON.parse(mapRaw) : {};
        map[token] = email;
        localStorage.setItem('verification_tokens', JSON.stringify(map));
        // add demo email for resend
        try {
          const link = `${window.location.origin}/verificar?token=${token}`;
          useEmailStore.getState().addEmail({
            id: token,
            to: email,
            subject: 'Verificação de conta - reenvio',
            body: `Olá,\n\nClique no link para verificar sua conta:\n${link}`,
            createdAt: new Date().toISOString(),
          });
        } catch (e) {}
        return token;
      },

      sendPhoneVerification: (phone) => {
        // check account exists (either by phone or by derived email)
        // @ts-ignore
        const accounts: Account[] = get().accounts || [];
        const account = accounts.find((a) => a.phone === phone || a.email === `${phone}@phone.local`);
        if (!account) return null;

        const code = `code_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
        const mapRaw = localStorage.getItem('verification_codes');
        const map = mapRaw ? JSON.parse(mapRaw) : {};
        map[code] = phone;
        localStorage.setItem('verification_codes', JSON.stringify(map));

        try {
          const link = `${window.location.origin}/verificar-codigo?code=${code}`;
          useMessageStore.getState().addMessage({
            id: `${code}_sms`,
            to: phone,
            channel: 'sms',
            body: `Seu código de verificação é: ${code}\n${link}`,
            createdAt: new Date().toISOString(),
          });
          useMessageStore.getState().addMessage({
            id: `${code}_whatsapp`,
            to: phone,
            channel: 'whatsapp',
            body: `Seu código de verificação é: ${code}\nAbra: ${link}`,
            createdAt: new Date().toISOString(),
          });
        } catch (e) {}

        return code;
      },

      verifyPhoneCode: (code) => {
        const mapRaw = localStorage.getItem('verification_codes');
        const map = mapRaw ? JSON.parse(mapRaw) : {};
        const phone = map[code];
        if (!phone) return false;

        // mark account verified
        // @ts-ignore
        const accounts: Account[] = get().accounts || [];
        const idx = accounts.findIndex((a) => a.phone === phone || a.email === `${phone}@phone.local`);
        if (idx === -1) return false;
        accounts[idx].verified = true;

        // set user session
        const { password: _, ...userWithoutPassword } = accounts[idx] as any;
        set({ accounts, user: userWithoutPassword as User, isAuthenticated: true });

        // remove code
        delete map[code];
        localStorage.setItem('verification_codes', JSON.stringify(map));
        return true;
      },

      loginWithGoogle: async () => {
        await new Promise((r) => setTimeout(r, 300));
        // create/find demo account
        // @ts-ignore
        const accounts: Account[] = get().accounts || [];
        const email = `google_user_${Math.random().toString(36).slice(2,6)}@google.local`;
        const existing = accounts.find((a) => a.email === email);
        if (existing) {
          const { password: _, ...u } = existing as any;
          set({ user: u as User, isAuthenticated: true });
          return true;
        }
        const acc: Account = {
          id: Date.now().toString(),
          name: 'Google User',
          email,
          password: Math.random().toString(36).slice(2,8),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          verified: true,
          addresses: [],
        };
        // @ts-ignore
        set((state) => ({ accounts: [...(state.accounts || []), acc], user: ({ ...acc, password: undefined } as unknown) as User, isAuthenticated: true }));
        return true;
      },

      loginWithFacebook: async () => {
        await new Promise((r) => setTimeout(r, 300));
        // create/find demo account
        // @ts-ignore
        const accounts: Account[] = get().accounts || [];
        const email = `fb_user_${Math.random().toString(36).slice(2,6)}@facebook.local`;
        const existing = accounts.find((a) => a.email === email);
        if (existing) {
          const { password: _, ...u } = existing as any;
          set({ user: u as User, isAuthenticated: true });
          return true;
        }
        const acc: Account = {
          id: Date.now().toString(),
          name: 'Facebook User',
          email,
          password: Math.random().toString(36).slice(2,8),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          verified: true,
          addresses: [],
        };
        // @ts-ignore
        set((state) => ({ accounts: [...(state.accounts || []), acc], user: ({ ...acc, password: undefined } as unknown) as User, isAuthenticated: true }));
        return true;
      },

      verifyAccount: (token) => {
        const mapRaw = localStorage.getItem('verification_tokens');
        const map = mapRaw ? JSON.parse(mapRaw) : {};
        const email = map[token];
        if (!email) return false;

        // mark account verified
        // @ts-ignore
        const accounts: Account[] = get().accounts || [];
        const idx = accounts.findIndex((a) => a.email === email);
        if (idx === -1) return false;
        accounts[idx].verified = true;

        // save back
        // @ts-ignore
        set({ accounts });

        // remove token
        delete map[token];
        localStorage.setItem('verification_tokens', JSON.stringify(map));
        return true;
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
