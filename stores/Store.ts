import { create } from "zustand";

type SearchState = {
  results: any[];
  setResults: (data: any[]) => void;
};

type CurrencyState = {
  currency: string;
  setCurrency: (data: string) => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  results: [],
  setResults: (data) => set({ results: data }),
}));

export const useCurrencyStore = create<CurrencyState>((set) => ({
  currency: '',
  setCurrency: (data) => set({ currency: data }),
}));

type ItemsState = {
  items: any[];
  setItems: (data: any[]) => void;  
  addItem: (item: any) => void;     
  removeItem: (item: any) => void; 
};

export const useItemsStore = create<ItemsState>((set) => ({
  items: [],
  setItems: (data) => set({ items: data }),
  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),
  removeItem: (item) =>
    set((state) => ({
      items: state.items.filter((i) => i !== item),
    })),
}));
