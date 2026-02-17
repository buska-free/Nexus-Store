import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SentMessage = {
  id: string;
  to: string;
  channel: 'sms' | 'whatsapp';
  body: string;
  createdAt: string;
};

interface MessageStore {
  messages: SentMessage[];
  addMessage: (m: SentMessage) => void;
  removeMessage: (id: string) => void;
  clear: () => void;
}

export const useMessageStore = create<MessageStore>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (m) => set((s) => ({ messages: [m, ...(s.messages || [])] })),
      removeMessage: (id) => set((s) => ({ messages: (s.messages || []).filter((x) => x.id !== id) })),
      clear: () => set({ messages: [] }),
    }),
    { name: 'sent-messages-storage' }
  )
);

export default useMessageStore;
