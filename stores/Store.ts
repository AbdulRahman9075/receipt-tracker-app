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
