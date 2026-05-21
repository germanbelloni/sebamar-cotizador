import { create } from "zustand";

import { persist } from "zustand/middleware";

import type { BudgetItem } from "../types/budget.types";

type BudgetState = {
  items: BudgetItem[];

  addItem: (item: BudgetItem) => void;

  removeItem: (id: string) => void;

  clearBudget: () => void;

  updateCantidad: (id: string, cantidad: number) => void;

  total: () => number;
};

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      items: [],

      /* ========================= */
      /* ADD ITEM */
      /* ========================= */

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.groupKey === item.groupKey,
          );

          // =========================
          // EXISTE
          // =========================

          if (existingItem) {
            return {
              items: state.items.map((i) => {
                if (i.groupKey !== item.groupKey) {
                  return i;
                }

                const nuevaCantidad = i.cantidad + item.cantidad;

                return {
                  ...i,

                  cantidad: nuevaCantidad,

                  subtotal: i.precioUnitario * nuevaCantidad,
                };
              }),
            };
          }

          // =========================
          // NUEVO
          // =========================

          return {
            items: [...state.items, item],
          };
        }),

      /* ========================= */
      /* REMOVE */
      /* ========================= */

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      /* ========================= */
      /* CLEAR */
      /* ========================= */

      clearBudget: () =>
        set({
          items: [],
        }),

      /* ========================= */
      /* UPDATE CANTIDAD */
      /* ========================= */

      updateCantidad: (id, cantidad) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== id) {
              return item;
            }

            const cantidadFinal = Math.max(1, Number(cantidad) || 1);

            return {
              ...item,

              cantidad: cantidadFinal,

              subtotal: item.precioUnitario * cantidadFinal,
            };
          }),
        })),

      /* ========================= */
      /* TOTAL */
      /* ========================= */

      total: () =>
        get().items.reduce((acc, item) => {
          return acc + Number(item.subtotal || 0);
        }, 0),
    }),
    {
      name: "sebamar-budget-storage",
    },
  ),
);
