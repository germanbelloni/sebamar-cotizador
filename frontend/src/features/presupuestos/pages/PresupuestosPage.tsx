import { usePresupuestos } from "../hooks/usePresupuestos";
import { useState } from "react";
import { FileText } from "lucide-react";
import { openPdf } from "../api/openPdf";

type Presupuesto = {
  id: string;

  numero: number;

  cliente: string;

  telefono?: string;

  usuario: string;

  total: number;

  fecha: string;

  cantidadItems: number;

  estado?: string;
};
type Props = {
  onOpenPresupuesto: (id: string) => void;
};

export function PresupuestosPage({ onOpenPresupuesto }: Props) {
  const { data, isLoading } = usePresupuestos();
  const [filtro, setFiltro] = useState("pendiente");
  const [busqueda, setBusqueda] = useState("");

  if (isLoading) {
    return (
      <div className="p-10">
        <p className="text-zinc-500">Cargando presupuestos...</p>
      </div>
    );
  }
  const presupuestosFiltrados = (data || [])
    .filter((p: Presupuesto) => {
      if (filtro !== "todos" && p.estado !== filtro) {
        return false;
      }

      const texto = busqueda.toLowerCase();

      return (
        (p.cliente || "").toLowerCase().includes(texto) ||
        String(p.numero).includes(texto)
      );
    })
    .sort((a: Presupuesto, b: Presupuesto) => b.numero - a.numero);
  console.log(presupuestosFiltrados);
  return (
    <div className="p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">
          PRESUPUESTOS NUEVOS 🚀
        </h1>

        <p className="mt-2 text-zinc-500">
          {presupuestosFiltrados.length} presupuesto
          {presupuestosFiltrados.length !== 1 ? "s" : ""} encontrado
          {presupuestosFiltrados.length !== 1 ? "s" : ""}.
        </p>
      </div>

      <div className="mb-6 flex gap-2">
        {["pendiente", "aprobado", "todos"].map((estado) => (
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
        ))}
      </div>
      <div className="mb-6">
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por cliente o número..."
          className="
      w-full
      rounded-xl
      border
      border-border
      bg-card
      px-4
      py-3
    "
        />
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="divide-y divide-border">
          {presupuestosFiltrados?.map((presupuesto: Presupuesto) => (
            <div
              key={presupuesto.id}
              onClick={() => onOpenPresupuesto(presupuesto.id)}
              className={`
    flex
    cursor-pointer
    items-center
    justify-between

    px-6
    py-5

    transition-colors

    hover:bg-muted/40

    ${presupuesto.estado === "aprobado" ? "border-l-4 border-l-lime-500" : ""}
  `}
            >
              <div>
                <div className="text-2xl font-black tracking-tight">
                  {presupuesto.cliente || "Sin cliente"}
                </div>

                <div className="mt-1 text-sm text-muted-foreground">
                  #{presupuesto.numero}
                </div>

                <div className="mt-1 text-xs text-zinc-500">
                  👤 {presupuesto.usuario}
                </div>

                {presupuesto.telefono && (
                  <div className="mt-1 text-xs text-zinc-500">
                    📞 {presupuesto.telefono}
                  </div>
                )}

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

      ${presupuesto.estado === "aprobado" ? "bg-lime-500/10 text-lime-400" : ""}
    `}
                  >
                    {presupuesto.estado || "pendiente"}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black">
                  ${Number(presupuesto.total || 0).toLocaleString("es-AR")}
                </div>

                <div className="mt-1 text-sm text-muted-foreground">
                  {presupuesto.fecha
                    ? new Date(presupuesto.fecha).toLocaleDateString("es-AR")
                    : "-"}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    openPdf(
                      presupuesto.id,
                      presupuesto.cliente || "SIN CLIENTE",
                      presupuesto.fecha ?? new Date().toISOString(),
                    );
                  }}
                  className="
    mt-3
    inline-flex
    items-center
    gap-2

    rounded-xl

    border
    border-border

    px-3
    py-2

    text-xs
    font-semibold

    transition

    hover:bg-muted
  "
                >
                  <FileText size={14} />
                  PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
