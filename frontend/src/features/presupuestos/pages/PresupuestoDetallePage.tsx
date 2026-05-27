import { ArrowLeft } from "lucide-react";

import { formatCurrency } from "@/features/ventanas/utils/formatCurrency";

import { usePresupuesto } from "../hooks/usePresupuesto";

type Props = {
  presupuestoId: string;

  onBack: () => void;
};

export function PresupuestoDetallePage({ presupuestoId, onBack }: Props) {
  const { data, isLoading } = usePresupuesto(presupuestoId);

  if (isLoading) {
    return (
      <div className="p-10">
        <p className="text-zinc-500">Cargando presupuesto...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-10">
        <p className="text-red-400">No se pudo cargar el presupuesto.</p>
      </div>
    );
  }

  return (
    <div className="p-10">
      {/* HEADER */}

      <div className="mb-10 flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="
              mb-4
              flex
              items-center
              gap-2

              text-sm
              text-zinc-400

              transition-colors

              hover:text-white
            "
          >
            <ArrowLeft size={16} />
            Volver
          </button>

          <h1 className="text-4xl font-black tracking-tight">
            Presupuesto #{data.numero}
          </h1>

          <p className="mt-2 text-zinc-500">{data.cliente || "Sin cliente"}</p>
        </div>

        <div className="text-right">
          <p className="text-sm text-zinc-500">Total</p>

          <p className="text-4xl font-black">
            {formatCurrency(data.total || 0)}
          </p>
        </div>
      </div>

      {/* ITEMS */}

      <div className="space-y-4">
        {data.items?.map((item: any) => (
          <div
            key={item.id}
            className="
              rounded-2xl
              border border-border
              bg-card

              p-6
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold">{item.titulo}</h3>

                <p className="mt-2 text-sm text-zinc-400">{item.descripcion}</p>
              </div>

              <div className="text-right">
                <p className="text-sm text-zinc-500">
                  Cantidad: {item.cantidad}
                </p>

                <p className="mt-2 text-xl font-bold">
                  {formatCurrency(item.subtotal)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
