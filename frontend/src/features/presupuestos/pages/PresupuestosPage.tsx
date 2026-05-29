import { usePresupuestos } from "../hooks/usePresupuestos";
import { useState } from "react";

type Presupuesto = {
  id: string;

  numero: number;

  cliente: string;

  usuario: string;

  total: number;

  fecha: string;

  estado?: string;
};
type Props = {
  onOpenPresupuesto: (id: string) => void;
};

export function PresupuestosPage({ onOpenPresupuesto }: Props) {
  const { data, isLoading } = usePresupuestos();
  const [filtro, setFiltro] = useState("pendiente");

  if (isLoading) {
    return (
      <div className="p-10">
        <p className="text-zinc-500">Cargando presupuestos...</p>
      </div>
    );
  }
  const presupuestosFiltrados =
    filtro === "todos"
      ? data
      : data?.filter((p: Presupuesto) => p.estado === filtro);

  return (
    <div className="p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">
          PRESUPUESTOS NUEVOS 🚀
        </h1>

        <p className="mt-2 text-zinc-500">
          Historial de presupuestos guardados.
        </p>
      </div>

      <div className="mb-6 flex gap-2">
        {["pendiente", "enviado", "aprobado", "rechazado", "todos"].map(
          (estado) => (
            <button
              key={estado}
              onClick={() => setFiltro(estado)}
              className={`
        rounded-xl
        px-4
        py-2
        text-sm
        font-semibold
        capitalize
        transition

        ${
          filtro === estado
            ? "bg-lime-400 text-black"
            : "bg-card border border-border"
        }
      `}
            >
              {estado}
            </button>
          ),
        )}
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="divide-y divide-border">
          {presupuestosFiltrados?.map((presupuesto: Presupuesto) => (
            <div
              key={presupuesto.id}
              onClick={() => onOpenPresupuesto(presupuesto.id)}
              className="
                flex
                cursor-pointer
                items-center
                justify-between

                px-6
                py-5

                transition-colors

                hover:bg-muted/40
              "
            >
              <div>
                <div className="text-lg font-semibold">
                  {presupuesto.cliente || "Sin cliente"}
                </div>

                <div className="mt-1 text-sm text-muted-foreground">
                  #{presupuesto.numero} · {presupuesto.usuario}
                </div>

                <div className="mt-2">
                  <span
                    className={`
      rounded-full
      px-2
      py-1
      text-xs
      font-semibold
      uppercase

      ${
        presupuesto.estado === "pendiente"
          ? "bg-yellow-500/10 text-yellow-400"
          : ""
      }

      ${presupuesto.estado === "enviado" ? "bg-blue-500/10 text-blue-400" : ""}

      ${presupuesto.estado === "aprobado" ? "bg-lime-500/10 text-lime-400" : ""}

      ${presupuesto.estado === "rechazado" ? "bg-red-500/10 text-red-400" : ""}
    `}
                  >
                    {presupuesto.estado || "pendiente"}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold">
                  ${Number(presupuesto.total || 0).toLocaleString("es-AR")}
                </div>

                <div className="mt-1 text-sm text-muted-foreground">
                  {presupuesto.fecha || "-"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
