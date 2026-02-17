// Tipos para o E-commerce "Nexus Store"

export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  subcategory?: string;
  brand: string;
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  badges?: ('offer' | 'new' | 'bestseller' | 'limited')[];
  specifications?: Record<string, string>;
  variants?: ProductVariant[];
  shippingInfo?: string;
  warranty?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  icon: string;
  subcategories?: Subcategory[];
  productCount?: number;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: string;
}

export interface CartState {
  items: CartItem[];
  couponCode?: string;
  discount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  addresses?: Address[];
  phone?: string;
  cpf?: string;
}

export interface Address {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  shipping: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  address: Address;
  paymentMethod: PaymentMethod;
}

export type PaymentMethod = 
  | { type: 'credit_card'; cardNumber: string; holderName: string; expiry: string; cvv: string; installments: number }
  | { type: 'boleto' }
  | { type: 'pix' }
  | { type: 'paypal' }
  | { type: 'mercado_pago' };

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
  verified: boolean;
}

export interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  cta: string;
  link: string;
  color?: string;
}

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number;
  availability: boolean;
}

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
