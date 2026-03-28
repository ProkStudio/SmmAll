import { create } from "zustand";

type UiState = {
  search: string;
  setSearch: (value: string) => void;
};

export const useUiStore = create<UiState>((set) => ({
  search: "",
  setSearch: (value) => set({ search: value }),
}));
