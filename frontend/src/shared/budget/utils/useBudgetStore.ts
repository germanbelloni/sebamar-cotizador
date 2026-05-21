import { create } from "zustand";

import type { BudgetItem } from "../types/budget.types";

type BudgetState = {
  items: BudgetItem[];

  addItem: (item: BudgetItem) => void;

  removeItem: (id: string) => void;

  clearBudget: () => void;

  updateCantidad: (id: string, cantidad: number) => void;

  total: () => number;
};

export const useBudgetStore = create<BudgetState>((set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  clearBudget: () =>
    set({
      items: [],
    }),

  updateCantidad: (id, cantidad) =>
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== id) {
          return item;
        }

        return {
          ...item,

          cantidad,

          subtotal: item.precioUnitario * cantidad,
        };
      }),
    })),

  total: () =>
    get().items.reduce((acc, item) => {
      return acc + Number(item.subtotal || 0);
    }, 0),
}));
