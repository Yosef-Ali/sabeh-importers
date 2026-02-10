import { create } from 'zustand';

type FiltersState = {
  query: string;
  categoryId: string;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  condition: string;
  city: string;
  sortBy: string;
  page: number;
  setQuery: (query: string) => void;
  setCategory: (categoryId: string) => void;
  setPriceRange: (min?: number, max?: number) => void;
  setCondition: (condition: string) => void;
  setCity: (city: string) => void;
  setSortBy: (sortBy: string) => void;
  setPage: (page: number) => void;
  clearFilters: () => void;
};

const initialState = {
  query: '',
  categoryId: '',
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
  condition: '',
  city: '',
  sortBy: 'newest',
  page: 1,
};

export const useFiltersStore = create<FiltersState>((set) => ({
  ...initialState,
  setQuery: (query) => set({ query, page: 1 }),
  setCategory: (categoryId) => set({ categoryId, page: 1 }),
  setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice, page: 1 }),
  setCondition: (condition) => set({ condition, page: 1 }),
  setCity: (city) => set({ city, page: 1 }),
  setSortBy: (sortBy) => set({ sortBy, page: 1 }),
  setPage: (page) => set({ page }),
  clearFilters: () => set(initialState),
}));
