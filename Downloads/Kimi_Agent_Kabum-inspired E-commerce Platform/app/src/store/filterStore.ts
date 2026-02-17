import { create } from 'zustand';
import type { FilterState, SortOption } from '@/types';

interface FilterStore {
  filters: FilterState;
  sortBy: SortOption;
  searchQuery: string;
  
  // Actions
  setCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  setBrand: (brand: string) => void;
  removeBrand: (brand: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setRating: (rating: number) => void;
  setAvailability: (available: boolean) => void;
  setSortBy: (sort: SortOption) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  clearAll: () => void;
}

const initialFilters: FilterState = {
  categories: [],
  brands: [],
  priceRange: [0, 10000],
  rating: 0,
  availability: false,
};

export const useFilterStore = create<FilterStore>((set) => ({
  filters: initialFilters,
  sortBy: 'relevance',
  searchQuery: '',

  setCategory: (category) =>
    set((state) => ({
      filters: {
        ...state.filters,
        categories: state.filters.categories.includes(category)
          ? state.filters.categories
          : [...state.filters.categories, category],
      },
    })),

  removeCategory: (category) =>
    set((state) => ({
      filters: {
        ...state.filters,
        categories: state.filters.categories.filter((c) => c !== category),
      },
    })),

  setBrand: (brand) =>
    set((state) => ({
      filters: {
        ...state.filters,
        brands: state.filters.brands.includes(brand)
          ? state.filters.brands
          : [...state.filters.brands, brand],
      },
    })),

  removeBrand: (brand) =>
    set((state) => ({
      filters: {
        ...state.filters,
        brands: state.filters.brands.filter((b) => b !== brand),
      },
    })),

  setPriceRange: (range) =>
    set((state) => ({
      filters: {
        ...state.filters,
        priceRange: range,
      },
    })),

  setRating: (rating) =>
    set((state) => ({
      filters: {
        ...state.filters,
        rating,
      },
    })),

  setAvailability: (available) =>
    set((state) => ({
      filters: {
        ...state.filters,
        availability: available,
      },
    })),

  setSortBy: (sort) =>
    set({ sortBy: sort }),

  setSearchQuery: (query) =>
    set({ searchQuery: query }),

  clearFilters: () =>
    set({
      filters: initialFilters,
    }),

  clearAll: () =>
    set({
      filters: initialFilters,
      sortBy: 'relevance',
      searchQuery: '',
    }),
}));
