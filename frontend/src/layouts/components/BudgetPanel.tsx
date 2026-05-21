import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";

import { formatCurrency } from "@/features/ventanas/utils/formatCurrency";

import { buildBudgetMessage } from "@/features/ventanas/utils/buildBudgetMessage";

import type { Cliente } from "@/features/clientes/types";

import type { Empresa } from "@/features/empresa/types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

import { useBudgetStore } from "@/shared/budget/store/useBudgetStore";

type Props = {
  items: BudgetItem[];

  setItems?: React.Dispatch<React.SetStateAction<BudgetItem[]>>;

  cliente: Cliente;

  empresa: Empresa;
};

export function BudgetPanel({
  items,

  cliente,

  empresa,
}: Props) {
  const navigate = useNavigate();

  const removeItem = useBudgetStore((state) => state.removeItem);

  const updateCantidad = useBudgetStore((state) => state.updateCantidad);

  function handleRemoveItem(id: string) {
    removeItem(id);
  }

  function handleQuantityChange(
    id: string,

    currentCantidad: number,

    delta: number,
  ) {
    const nuevaCantidad = Math.max(
      1,

      currentCantidad + delta,
    );

    updateCantidad(id, nuevaCantidad);
  }

  const total = items.reduce(
    (acc, item) => acc + item.subtotal,

    0,
  );

  const canShare =
    items.length > 0 && cliente.nombre.trim() && cliente.telefono.trim();

  function handleShareWhatsApp() {
    const message = buildBudgetMessage(
      items as never,

      cliente,
    );

    const encoded = encodeURIComponent(message);

    window.open(
      `https://wa.me/?text=${encoded}`,

      "_blank",
    );
  }

  function handlePrint() {
    navigate("/print", {
      state: {
        empresa,

        cliente,

        items,
      },
    });
  }

  return (
    <aside
      className="
        w-[420px]
        border-l border-border
        bg-card/50
        p-4
        backdrop-blur
      "
    >
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Presupuesto</h3>

          <p className="text-xs text-muted-foreground">
            {items.length} productos
          </p>
        </div>
      </div>

      {/* ITEMS */}

      <div
        className="
          mt-4
          max-h-[calc(100vh-220px)]
          space-y-2
          overflow-y-auto
          pr-1
        "
      >
        {items.length === 0 ? (
          <div
            className="
              rounded-xl
              border border-border
              bg-background
              p-3
            "
          >
            <p className="text-xs text-muted-foreground">
              No hay productos agregados.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="
                rounded-xl
                border border-border
                bg-background
                p-3
              "
            >
              {/* TOP */}

              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-medium capitalize text-muted-foreground">
                  {item.modulo}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="
                    rounded-md
                    border border-border
                    px-2 py-1
                    text-[11px]
                    text-muted-foreground
                    transition-all
                    hover:border-border
                    hover:bg-muted
                    hover:text-foreground
                  "
                >
                  Eliminar
                </button>
              </div>

              {/* TITLE */}

              <div className="mt-2 text-sm font-semibold text-foreground">
                {item.titulo}
              </div>

              {/* DESCRIPTION */}

              <div
                className="
                  mt-2
                  text-xs
                  leading-relaxed
                  text-muted-foreground
                "
              >
                {item.descripcion}
              </div>

              {/* CANTIDAD */}

              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  Cantidad
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleQuantityChange(
                        item.id,

                        item.cantidad,

                        -1,
                      )
                    }
                    className="
                      rounded-md
                      border border-border
                      px-2 py-1
                      text-xs
                      transition-all
                      hover:bg-muted
                    "
                  >
                    −
                  </button>

                  <span className="min-w-[20px] text-center text-sm">
                    {item.cantidad}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      handleQuantityChange(
                        item.id,

                        item.cantidad,

                        1,
                      )
                    }
                    className="
                      rounded-md
                      border border-border
                      px-2 py-1
                      text-xs
                      transition-all
                      hover:bg-muted
                    "
                  >
                    +
                  </button>
                </div>
              </div>

              {/* PRICE */}

              <div className="mt-3 flex justify-between">
                <div>
                  <div className="text-[9px] text-muted-foreground">
                    Unitario
                  </div>

                  <div className="text-sm">
                    {formatCurrency(item.precioUnitario)}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[9px] text-muted-foreground">
                    Subtotal
                  </div>

                  <div
                    className="
    text-sm
    font-bold
    text-emerald-400
  "
                  >
                    {formatCurrency(item.subtotal)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* TOTAL */}

      <div
        className="
          mt-4
          rounded-xl
          border border-border
          bg-background
          p-3
        "
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Total</span>

          <span
            className="
    text-lg
    font-black
    text-emerald-400
  "
          >
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* ACTIONS */}

      <div className="mt-4 space-y-2">
        <Button
          className="w-full"
          onClick={handlePrint}
          disabled={items.length === 0}
        >
          Imprimir / PDF
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleShareWhatsApp}
          disabled={!canShare}
        >
          Compartir WhatsApp
        </Button>

        {!canShare && (
          <p className="text-center text-[11px] text-muted-foreground">
            Completá nombre, teléfono y agregá productos.
          </p>
        )}
      </div>
    </aside>
  );
}
