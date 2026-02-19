import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';
import { useAdminStore } from './adminStore';

interface CartStore {
  items: CartItem[];
  couponCode: string | null;
  discount: number;
  
  // Actions
  addItem: (product: Product, quantity?: number, variant?: string) => void;
  removeItem: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  
  // Getters
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTotal: () => number;
  isInCart: (productId: string, variant?: string) => boolean;
}

const COUPONS: Record<string, number> = {
  'DESCONTO10': 0.10,
  'DESCONTO20': 0.20,
  'PRIMEIRA': 0.15,
  'BLACK50': 0.50,
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discount: 0,

      addItem: (product, quantity = 1, variant) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id && item.variant === variant
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id && item.variant === variant
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity, variant }],
          };
        });
      },

      removeItem: (productId, variant) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.variant === variant)
          ),
        }));
      },

      updateQuantity: (productId, quantity, variant) => {
        if (quantity <= 0) {
          get().removeItem(productId, variant);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId && item.variant === variant
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], couponCode: null, discount: 0 });
      },

      applyCoupon: (code) => {
        const upperCode = code.toUpperCase();
        if (COUPONS[upperCode]) {
          set({ couponCode: upperCode, discount: COUPONS[upperCode] });
          return true;
        }
        return false;
      },

      removeCoupon: () => {
        set({ couponCode: null, discount: 0 });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        const adminStore = useAdminStore.getState();
        return get().items.reduce((total, item) => {
          const pricing = adminStore.getProductPrice(item.product.id);
          return total + pricing.currentPrice * item.quantity;
        }, 0);
      },

      getDiscountAmount: () => {
        const { discount, items } = get();
        if (discount === 0) return 0;
        const adminStore = useAdminStore.getState();
        const subtotal = items.reduce((total, item) => {
          const pricing = adminStore.getProductPrice(item.product.id);
          return total + pricing.currentPrice * item.quantity;
        }, 0);
        return subtotal * discount;
      },

      getTotal: () => {
        const { items, discount } = get();
        const adminStore = useAdminStore.getState();
        const subtotal = items.reduce((total, item) => {
          const pricing = adminStore.getProductPrice(item.product.id);
          return total + pricing.currentPrice * item.quantity;
        }, 0);
        return subtotal * (1 - discount);
      },

      isInCart: (productId, variant) => {
        return get().items.some(
          (item) => item.product.id === productId && item.variant === variant
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
