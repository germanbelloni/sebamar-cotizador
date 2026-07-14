import { create } from "zustand";

type State = {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
};

export const useGlobalLoadingStore = create<State>((set) => ({
  isLoading: false,
  setLoading: (value) =>
    set({
      isLoading: value,
    }),
}));
