import { Trash2 } from "lucide-react";

import type { Cliente } from "@/features/clientes/types";
import type { Empresa } from "@/features/empresa/types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

import { useBudgetStore } from "@/shared/budget/store/useBudgetStore";

import { formatCurrency } from "@/features/ventanas/utils/formatCurrency";

import { PrintableBudget } from "@/features/print/components/PrintableBudget";

type Props = {
  items: BudgetItem[];

  cliente: Cliente;

  empresa: Empresa;
};

export function BudgetPanel({ items, cliente, empresa }: Props) {
  const removeItem = useBudgetStore((state) => state.removeItem);

  const updateCantidad = useBudgetStore((state) => state.updateCantidad);

  const clearBudget = useBudgetStore((state) => state.clearBudget);

  const total = useBudgetStore((state) => state.total);

  return (
    <aside
      className="
        w-[420px]
        border-l border-border
        bg-card
      "
    >
      <div className="flex h-full flex-col">
        {/* HEADER */}

        <div
          className="
            border-b border-border
            px-6 py-5
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Presupuesto</h2>

              <p className="text-sm text-muted-foreground">
                {items.length} productos agregados
              </p>
            </div>

            {items.length > 0 && (
              <button
                onClick={clearBudget}
                className="
                  text-xs
                  font-medium
                  text-red-400

                  transition-colors

                  hover:text-red-300
                "
              >
                Vaciar
              </button>
            )}
          </div>
        </div>

        {/* ITEMS */}

        <div className="flex-1 overflow-auto">
          {items.length === 0 ? (
            <div
              className="
                flex h-full
                items-center
                justify-center

                px-10

                text-center
              "
            >
              <div>
                <p className="text-sm text-muted-foreground">
                  No hay productos cargados.
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Agregá productos desde los módulos.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="
                    rounded-2xl
                    border border-border
                    bg-background
                    p-4
                  "
                >
                  {/* TOP */}

                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3
                        className="
                          truncate
                          text-sm
                          font-semibold
                        "
                      >
                        {item.titulo}
                      </h3>

                      <p
                        className="
                          mt-1
                          text-xs
                          leading-relaxed
                          text-muted-foreground
                        "
                      >
                        {item.descripcion}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="
                        text-muted-foreground
                        transition-colors

                        hover:text-red-400
                      "
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* CANTIDAD */}

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Cantidad
                      </span>

                      <input
                        type="number"
                        min={1}
                        value={item.cantidad}
                        onChange={(e) =>
                          updateCantidad(item.id, Number(e.target.value))
                        }
                        className="
                          h-9
                          w-20

                          rounded-xl
                          border border-border

                          bg-card

                          px-3

                          text-sm
                        "
                      />
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        Unitario
                      </div>

                      <div className="text-sm font-medium">
                        {formatCurrency(item.precioUnitario)}
                      </div>
                    </div>
                  </div>

                  {/* SUBTOTAL */}

                  <div
                    className="
                      mt-4

                      flex items-center
                      justify-between

                      rounded-xl

                      border border-border

                      bg-card

                      px-4 py-3
                    "
                  >
                    <span className="text-sm text-muted-foreground">
                      Subtotal
                    </span>

                    <span className="text-base font-bold">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}

        <div
          className="
            border-t border-border
            p-5
          "
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>

            <span className="text-2xl font-bold">
              {formatCurrency(total())}
            </span>
          </div>

          {items.length > 0 && (
            <PrintableBudget
              items={items}
              cliente={cliente}
              empresa={empresa}
            />
          )}
        </div>
      </div>
    </aside>
  );
}
