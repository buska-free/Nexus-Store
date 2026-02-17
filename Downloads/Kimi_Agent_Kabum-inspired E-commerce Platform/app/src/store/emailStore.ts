import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SentEmail = {
  id: string;
  to: string;
  subject: string;
  body: string;
  createdAt: string;
};

interface EmailStore {
  emails: SentEmail[];
  addEmail: (email: SentEmail) => void;
  removeEmail: (id: string) => void;
  clear: () => void;
}

export const useEmailStore = create<EmailStore>()(
  persist(
    (set) => ({
      emails: [],
      addEmail: (email) =>
        set((state) => ({ emails: [email, ...(state.emails || [])] })),
      removeEmail: (id) =>
        set((state) => ({ emails: (state.emails || []).filter((e) => e.id !== id) })),
      clear: () => set({ emails: [] }),
    }),
    {
      name: 'sent-emails-storage',
    }
  )
);

export type { SentEmail };
