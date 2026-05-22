import { useBudgetStore } from "@/shared/budget/store/useBudgetStore";

export function BudgetDebug() {
  const items = useBudgetStore((state) => state.items);

  const total = useBudgetStore((state) => state.total);

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[380px] rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-white shadow-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
          Budget Debug
        </h2>

        <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs">
          {items.length} items
        </span>
      </div>

      <div className="max-h-[320px] space-y-3 overflow-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-3"
          >
            <div className="text-sm font-semibold">{item.titulo}</div>

            <div className="mt-1 text-xs text-zinc-400">{item.descripcion}</div>

            <div className="mt-2 flex items-center justify-between text-xs">
              <span>Cantidad: {item.cantidad}</span>

              <span className="font-bold text-emerald-400">
                ${item.subtotal.toLocaleString("es-AR")}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-zinc-800 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">TOTAL</span>

          <span className="text-xl font-black text-white">
            ${total().toLocaleString("es-AR")}
          </span>
        </div>
      </div>
    </div>
  );
}
