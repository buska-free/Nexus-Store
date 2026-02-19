import { create } from 'zustand';
import { products as defaultProducts } from '@/data/products';

export interface ProductOverride {
  productId: string;
  originalPrice: number;
  currentPrice: number;
  discount: number; // percentual ou valor
  discountType: 'percentage' | 'fixed'; // tipo de desconto
  isActive: boolean;
}

interface AdminStore {
  isAuthenticated: boolean;
  adminPassword: string;
  productOverrides: Map<string, ProductOverride>;
  
  // Auth
  login: (password: string) => boolean;
  logout: () => void;
  
  // Product Management
  updateProductPrice: (productId: string, newPrice: number) => void;
  applyDiscount: (productId: string, discount: number, type: 'percentage' | 'fixed') => void;
  removeDiscount: (productId: string) => void;
  getProductPrice: (productId: string) => { originalPrice: number; currentPrice: number; discount: number; discountType: string };
  resetPrices: () => void;
  
  // Migration
  migrateFromLegacy: () => number;
}

export const useAdminStore = create<AdminStore>((set, get) => {
  // Carregar dados do localStorage ao inicializar
  let savedOverrides = localStorage.getItem('productOverrides');
  const initialOverrides = new Map<string, ProductOverride>();
  
  // Se não houver dados salvos, fazer migração do sistema antigo
  if (!savedOverrides) {
    const migratedOverrides: ProductOverride[] = [];
    
    defaultProducts.forEach((product) => {
      // Se o produto tem originalPrice diferente do price, significa que tinha desconto
      if (product.originalPrice && product.originalPrice !== product.price) {
        const discount = product.originalPrice - product.price;
        const discountPercentage = Math.round((discount / product.originalPrice) * 100 * 100) / 100;
        
        migratedOverrides.push({
          productId: product.id,
          originalPrice: product.originalPrice,
          currentPrice: product.price,
          discount: discountPercentage,
          discountType: 'percentage',
          isActive: true,
        });
      }
    });
    
    // Salvar migração se houver dados
    if (migratedOverrides.length > 0) {
      localStorage.setItem('productOverrides', JSON.stringify(migratedOverrides));
      migratedOverrides.forEach((override) => {
        initialOverrides.set(override.productId, override);
      });
      console.log(`✅ Migração concluída: ${migratedOverrides.length} produtos com desconto importados do sistema antigo`);
    }
  } else {
    try {
      const parsed = JSON.parse(savedOverrides);
      parsed.forEach((override: ProductOverride) => {
        initialOverrides.set(override.productId, override);
      });
    } catch (e) {
      console.error('Erro ao carregar overrides:', e);
    }
  }

  return {
    isAuthenticated: false,
    adminPassword: 'admin123', // Senha padrão (em produção, seria mais seguro)
    productOverrides: initialOverrides,

    login: (password: string) => {
      const store = get();
      if (password === store.adminPassword) {
        set({ isAuthenticated: true });
        return true;
      }
      return false;
    },

    logout: () => {
      set({ isAuthenticated: false });
    },

    updateProductPrice: (productId: string, newPrice: number) => {
      const store = get();
      const product = defaultProducts.find(p => p.id === productId);
      
      if (!product) return;

      const override = store.productOverrides.get(productId) || {
        productId,
        originalPrice: product.price,
        currentPrice: product.price,
        discount: 0,
        discountType: 'percentage',
        isActive: true,
      };

      override.currentPrice = newPrice;
      override.discount = 0; // Limpar desconto ao alterar preço diretamente
      override.isActive = true;

      const newOverrides = new Map(store.productOverrides);
      newOverrides.set(productId, override);
      set({ productOverrides: newOverrides });
      
      // Persistir no localStorage
      localStorage.setItem('productOverrides', JSON.stringify(Array.from(newOverrides.values())));
    },

    applyDiscount: (productId: string, discount: number, type: 'percentage' | 'fixed') => {
      const store = get();
      const product = defaultProducts.find(p => p.id === productId);
      
      if (!product) return;

      const existingOverride = store.productOverrides.get(productId);
      
      // Se já existe uma sobrescrita, usar o originalPrice dela como base
      // Se não existe, usar o price atual do produto como originalPrice
      const basePrice = existingOverride?.originalPrice || product.price;

      const override: ProductOverride = {
        productId,
        originalPrice: basePrice,
        currentPrice: 0, // será calculado abaixo
        discount: discount,
        discountType: type,
        isActive: true,
      };

      // Calcular preço com desconto
      if (type === 'percentage') {
        override.currentPrice = basePrice * (1 - discount / 100);
      } else {
        override.currentPrice = Math.max(0, basePrice - discount);
      }

      const newOverrides = new Map(store.productOverrides);
      newOverrides.set(productId, override);
      set({ productOverrides: newOverrides });
      
      // Persistir no localStorage
      localStorage.setItem('productOverrides', JSON.stringify(Array.from(newOverrides.values())));
    },

    removeDiscount: (productId: string) => {
      const store = get();
      const product = defaultProducts.find(p => p.id === productId);
      
      if (!product) return;

      const override = store.productOverrides.get(productId);
      if (override) {
        override.discount = 0;
        override.currentPrice = override.originalPrice;
        override.isActive = false;
        
        const newOverrides = new Map(store.productOverrides);
        newOverrides.set(productId, override);
        set({ productOverrides: newOverrides });
        
        localStorage.setItem('productOverrides', JSON.stringify(Array.from(newOverrides.values())));
      }
    },

    getProductPrice: (productId: string) => {
      const store = get();
      const product = defaultProducts.find(p => p.id === productId);
      const override = store.productOverrides.get(productId);

      if (override && override.isActive) {
        return {
          originalPrice: override.originalPrice,
          currentPrice: override.currentPrice,
          discount: override.discount,
          discountType: override.discountType,
        };
      }

      return {
        originalPrice: product?.originalPrice || product?.price || 0,
        currentPrice: product?.price || 0,
        discount: 0,
        discountType: 'percentage',
      };
    },

    resetPrices: () => {
      set({ productOverrides: new Map() });
      localStorage.removeItem('productOverrides');
    },

    migrateFromLegacy: () => {
      const migratedOverrides: ProductOverride[] = [];
      
      defaultProducts.forEach((product) => {
        // Se o produto tem originalPrice diferente do price, significa que tinha desconto
        if (product.originalPrice && product.originalPrice !== product.price) {
          const discount = product.originalPrice - product.price;
          const discountPercentage = Math.round((discount / product.originalPrice) * 100 * 100) / 100;
          
          migratedOverrides.push({
            productId: product.id,
            originalPrice: product.originalPrice,
            currentPrice: product.price,
            discount: discountPercentage,
            discountType: 'percentage',
            isActive: true,
          });
        }
      });
      
      const newOverrides = new Map<string, ProductOverride>();
      migratedOverrides.forEach((override) => {
        newOverrides.set(override.productId, override);
      });
      
      set({ productOverrides: newOverrides });
      localStorage.setItem('productOverrides', JSON.stringify(migratedOverrides));
      
      return migratedOverrides.length;
    },
  };
});
