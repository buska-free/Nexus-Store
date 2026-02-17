import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesStore {
  items: string[]; // product ids
  add: (productId: string) => void;
  remove: (productId: string) => void;
  toggle: (productId: string) => boolean;
  clear: () => void;
  isFavorite: (productId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (productId: string) =>
        set((state) => ({ items: state.items.includes(productId) ? state.items : [...state.items, productId] })),
      remove: (productId: string) => set((state) => ({ items: state.items.filter((id) => id !== productId) })),
      toggle: (productId: string) => {
        const exists = get().items.includes(productId);
        if (exists) {
          set((state) => ({ items: state.items.filter((id) => id !== productId) }));
          return false;
        }
        set((state) => ({ items: [...state.items, productId] }));
        return true;
      },
      clear: () => set({ items: [] }),
      isFavorite: (productId: string) => get().items.includes(productId),
    }),
    {
      name: 'favorites-storage',
    }
  )
);
