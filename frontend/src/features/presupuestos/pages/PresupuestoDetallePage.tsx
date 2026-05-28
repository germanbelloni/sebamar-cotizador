import { ArrowLeft } from "lucide-react";

import { formatCurrency } from "@/features/ventanas/utils/formatCurrency";

import { usePresupuesto } from "../hooks/usePresupuesto";

import { useAuthStore } from "@/store/authStore";

import { updatePresupuestoEstado } from "../api/updatePresupuestoEstado";

type Props = {
  presupuestoId: string;

  onBack: () => void;
};

export function PresupuestoDetallePage({ presupuestoId, onBack }: Props) {
  const { data, isLoading } = usePresupuesto(presupuestoId);

  const user = useAuthStore((state) => state.user);

  const canViewFinancial =
    user?.role === "admin" || user?.role === "superadmin";

  async function handleEstadoChange(estado: string) {
    try {
      await updatePresupuestoEstado(presupuestoId, estado);

      window.location.reload();
    } catch (error) {
      console.log(error);

      alert("Error actualizando estado");
    }
  }

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

  // =========================
  // 💰 FINANCIERO
  // =========================

  const totalCosto =
    data.items?.reduce(
      (acc: number, item: any) => acc + (item.precioBase || 0) * item.cantidad,
      0,
    ) || 0;

  const totalVenta = data.total || 0;

  const ganancia = totalVenta - totalCosto;

  const margen =
    totalCosto > 0 ? ((ganancia / totalCosto) * 100).toFixed(1) : 0;

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
          <div className="mt-4 flex items-center gap-3">
            <span
              className={`
      rounded-full
      px-3
      py-1
      text-xs
      font-semibold
      uppercase

      ${data.estado === "pendiente" ? "bg-yellow-500/10 text-yellow-400" : ""}

      ${data.estado === "enviado" ? "bg-blue-500/10 text-blue-400" : ""}

      ${data.estado === "aprobado" ? "bg-lime-500/10 text-lime-400" : ""}

      ${data.estado === "rechazado" ? "bg-red-500/10 text-red-400" : ""}
    `}
            >
              {data.estado}
            </span>

            <select
              value={data.estado}
              onChange={(e) => handleEstadoChange(e.target.value)}
              className="
      rounded-xl
      border border-border
      bg-card
      px-3
      py-2
      text-sm
    "
            >
              <option value="pendiente">Pendiente</option>

              <option value="enviado">Enviado</option>

              <option value="aprobado">Aprobado</option>

              <option value="rechazado">Rechazado</option>
            </select>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-zinc-500">Total</p>

          <p className="text-4xl font-black">
            {formatCurrency(data.total || 0)}
          </p>
        </div>
      </div>

      {/* RESUMEN FINANCIERO */}

      {canViewFinancial && (
        <div
          className="
            mb-8

            grid
            grid-cols-4
            gap-4
          "
        >
          <div
            className="
              rounded-2xl
              border border-border
              bg-card
              p-5
            "
          >
            <p className="text-xs text-zinc-500">COSTO</p>

            <p className="mt-2 text-2xl font-black">
              {formatCurrency(totalCosto)}
            </p>
          </div>

          <div
            className="
              rounded-2xl
              border border-border
              bg-card
              p-5
            "
          >
            <p className="text-xs text-zinc-500">VENTA</p>

            <p className="mt-2 text-2xl font-black">
              {formatCurrency(totalVenta)}
            </p>
          </div>

          <div
            className="
              rounded-2xl
              border border-lime-400/20
              bg-lime-400/5
              p-5
            "
          >
            <p className="text-xs text-zinc-500">GANANCIA</p>

            <p
              className="
                mt-2
                text-2xl
                font-black
                text-lime-400
              "
            >
              {formatCurrency(ganancia)}
            </p>
          </div>

          <div
            className="
              rounded-2xl
              border border-fuchsia-400/20
              bg-fuchsia-400/5
              p-5
            "
          >
            <p className="text-xs text-zinc-500">MARGEN</p>

            <p
              className="
                mt-2
                text-2xl
                font-black
                text-fuchsia-400
              "
            >
              {margen}%
            </p>
          </div>
        </div>
      )}

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

            {/* FINANCIERO ITEM */}

            {canViewFinancial && (
              <div
                className="
                  mt-5

                  grid
                  grid-cols-4
                  gap-3
                "
              >
                <div
                  className="
                    rounded-xl
                    border border-border
                    bg-background
                    p-3
                  "
                >
                  <p className="text-[11px] text-zinc-500">Base</p>

                  <p className="mt-1 font-semibold">
                    {formatCurrency(item.precioBase || 0)}
                  </p>
                </div>

                <div
                  className="
                    rounded-xl
                    border border-border
                    bg-background
                    p-3
                  "
                >
                  <p className="text-[11px] text-zinc-500">Perfil</p>

                  <p className="mt-1 font-semibold uppercase">
                    {item.perfilAplicado || "-"}
                  </p>
                </div>

                <div
                  className="
                    rounded-xl
                    border border-border
                    bg-background
                    p-3
                  "
                >
                  <p className="text-[11px] text-zinc-500">Margen</p>

                  <p className="mt-1 font-semibold">
                    {item.margenAplicado || 0}%
                  </p>
                </div>

                <div
                  className="
                    rounded-xl
                    border border-lime-400/20
                    bg-lime-400/5
                    p-3
                  "
                >
                  <p className="text-[11px] text-zinc-500">Final</p>

                  <p className="mt-1 font-semibold text-lime-400">
                    {formatCurrency(item.precioFinal || 0)}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
