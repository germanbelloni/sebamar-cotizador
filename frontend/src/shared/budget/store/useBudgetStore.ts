import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { BudgetItem } from "../types/budget.types";

type BudgetState = {
  items: BudgetItem[];
  editingItem: BudgetItem | null;

  setEditingItem: (item: BudgetItem | null) => void;

  replaceItem: (item: BudgetItem) => void;

  addItem: (item: BudgetItem) => void;
  removeItem: (id: string) => void;
  clearBudget: () => void;
  updateCantidad: (id: string, cantidad: number) => void;

  setItems: (items: BudgetItem[]) => void;

  editingPresupuestoId: string | null;
  setEditingPresupuestoId: (id: string | null) => void;

  editingCliente: {
    nombre: string;
    telefono: string;
  } | null;

  setEditingCliente: (
    cliente: {
      nombre: string;
      telefono: string;
    } | null,
  ) => void;

  editingFecha: string | null;
  setEditingFecha: (fecha: string | null) => void;

  total: () => number;
};

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      items: [],

      editingItem: null,

      editingPresupuestoId: null,
      editingCliente: null,
      editingFecha: null,
      /* ========================= */
      /* ADD ITEM */
      /* ========================= */

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.groupKey === item.groupKey,
          );

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

          return {
            items: [...state.items, item],
          };
        }),
      /* ========================= */
      /* REPLACE ITEM */
      /* ========================= */

      replaceItem: (item) =>
        set((state) => {
          const nuevosItems = state.items.map((i) => {
            if (i.id !== item.id) {
              return i;
            }

            return {
              ...item,
              groupKey: i.groupKey,
            };
          });

          return {
            items: nuevosItems,
            editingItem: null,
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
          editingItem: null,
          editingPresupuestoId: null,
          editingCliente: null,
          editingFecha: null,
        }),

      /* ========================= */
      /* SET ITEMS */
      /* ========================= */

      setItems: (items) =>
        set({
          items,
        }),

      /* ========================= */
      /* EDITING PRESUPUESTO */
      /* ========================= */
      setEditingItem: (item) =>
        set({
          editingItem: item,
        }),
      setEditingPresupuestoId: (id) =>
        set({
          editingPresupuestoId: id,
        }),

      setEditingCliente: (cliente) =>
        set({
          editingCliente: cliente,
        }),

      setEditingFecha: (fecha) =>
        set({
          editingFecha: fecha,
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

      partialize: (state) => ({
        items: state.items,
        editingItem: state.editingItem,
        editingPresupuestoId: state.editingPresupuestoId,
        editingCliente: state.editingCliente,
        editingFecha: state.editingFecha,
      }),
    },
  ),
);
