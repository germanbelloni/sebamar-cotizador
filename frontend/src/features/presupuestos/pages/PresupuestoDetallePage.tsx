import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

import { DeletePresupuestoDialog } from "../components/DeletePresupuestoDialog";

import { formatCurrency } from "@/features/ventanas/utils/formatCurrency";

import { usePresupuesto } from "../hooks/usePresupuesto";

import { useAuthStore } from "@/store/authStore";

import { updatePresupuestoEstado } from "../api/updatePresupuestoEstado";

import { deletePresupuesto } from "../api/deletePresupuesto";

import { toast } from "sonner";

import { usePresupuestoPdf } from "../hooks/usePresupuestoPdf";

import { CompartirPresupuestoDialog } from "../components/CompartirPresupuestoDialog";

import type { PresupuestoItem } from "../types/presupuesto.types";

import { useUpdatePresupuesto } from "../hooks/useUpdatePresupuesto";

import { useBudgetStore } from "@/shared/budget/store/useBudgetStore";
import { useNavigate } from "react-router-dom";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Eye, Download, Loader2 } from "lucide-react";

type Props = {
  presupuestoId: string;

  onBack: () => void;
};

export function PresupuestoDetallePage({ presupuestoId, onBack }: Props) {
  const { data, isLoading, refetch } = usePresupuesto(presupuestoId);

  const user = useAuthStore((state) => state.user);
  const canViewFinancial =
    user?.role === "admin" || user?.role === "superadmin";
  const showPerfil = user?.role === "superadmin";

  const { view, save, saveAs } = usePresupuestoPdf();

  const navigate = useNavigate();

  const clearBudget = useBudgetStore((state) => state.clearBudget);

  const setItems = useBudgetStore((state) => state.setItems);

  const setEditingPresupuestoId = useBudgetStore(
    (state) => state.setEditingPresupuestoId,
  );

  const setEditingCliente = useBudgetStore((state) => state.setEditingCliente);

  const setEditingFecha = useBudgetStore((state) => state.setEditingFecha);
  const setEditingItem = useBudgetStore((state) => state.setEditingItem);
  const [editing, setEditing] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const [cliente, setCliente] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [validez, setValidez] = useState("");

  const updateMutation = useUpdatePresupuesto();

  async function handleEstadoChange(estado: string) {
    try {
      await updatePresupuestoEstado(presupuestoId, estado);

      await refetch();

      if (estado === "aprobado") {
        toast.success("Presupuesto aprobado.");
      } else {
        toast.success("El presupuesto volvió a pendiente.");
      }
    } catch (error) {
      console.error(error);

      toast.error("No se pudo actualizar el estado.");
    }
  }

  async function handleDelete() {
    try {
      await deletePresupuesto(presupuestoId);

      toast.success("Presupuesto eliminado correctamente.");

      onBack();
    } catch (error) {
      console.error(error);

      toast.error("No se pudo eliminar el presupuesto.");
    }
  }

  function handleEditarPresupuesto() {
    if (!data) return;

    clearBudget();

    setItems(
      data.items.map((item) => ({
        ...item,
        id: item.id ?? crypto.randomUUID(),
        groupKey: crypto.randomUUID(),
      })) as BudgetItem[],
    );

    setEditingPresupuestoId(data.id);

    setEditingCliente({
      nombre: data.cliente || "",
      telefono: data.telefono || "",
    });

    setEditingFecha(data.fecha ?? null);

    navigate("/");
  }

  function handleEditarItem(item: PresupuestoItem) {
    if (!data) return;

    clearBudget();

    setItems(
      data.items.map((i) => ({
        ...i,
        id: i.id ?? crypto.randomUUID(),
        groupKey: crypto.randomUUID(),
      })) as BudgetItem[],
    );

    setEditingPresupuestoId(data.id);

    setEditingCliente({
      nombre: data.cliente || "",
      telefono: data.telefono || "",
    });

    setEditingFecha(data.fecha ?? null);

    setEditingItem(item as BudgetItem);

    navigate("/");
  }

  async function handleSave() {
    try {
      await updateMutation.mutateAsync({
        id: presupuestoId,
        payload: {
          cliente,
          telefono,
          direccion,
          observaciones,
          validez,
        },
      });

      toast.success("Presupuesto actualizado.");

      setEditing(false);

      await refetch();
    } catch (error) {
      console.error(error);

      toast.error("No se pudo actualizar.");
    }
  }
  useEffect(() => {
    if (!data) return;

    setCliente(data.cliente || "");
    setTelefono(data.telefono || "");
    setDireccion(data.direccion || "");
    setObservaciones(data.observaciones || "");
    setValidez(data.validez || "");
  }, [data]);
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

  function getCostoItem(item: PresupuestoItem) {
    if (user?.role === "superadmin") {
      return item.precioProveedor ?? item.precioBase ?? 0;
    }

    return item.precioBase ?? 0;
  }
  const totalCosto =
    data.items?.reduce(
      (acc, item) => acc + getCostoItem(item) * item.cantidad,
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

          {editing ? (
            <div className="mt-4 max-w-md space-y-3">
              <input
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Cliente"
                className="
        w-full
        rounded-xl
        border border-border
        bg-card
        p-3
      "
              />

              <input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Teléfono"
                className="
        w-full
        rounded-xl
        border border-border
        bg-card
        p-3
      "
              />

              <input
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Dirección"
                className="
        w-full
        rounded-xl
        border border-border
        bg-card
        p-3
      "
              />

              <input
                value={validez}
                onChange={(e) => setValidez(e.target.value)}
                placeholder="Validez"
                className="
        w-full
        rounded-xl
        border border-border
        bg-card
        p-3
      "
              />

              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Observaciones"
                className="
        w-full
        rounded-xl
        border border-border
        bg-card
        p-3
      "
              />

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="
          rounded-xl
          bg-lime-500
          px-4
          py-2
          font-semibold
          text-black
        "
                >
                  💾 Guardar
                </button>

                <button
                  onClick={() => setEditing(false)}
                  className="
          rounded-xl
          border border-border
          px-4
          py-2
        "
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-zinc-500">
              {data.cliente || "Sin cliente"}
            </p>
          )}
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

      ${data.estado === "aprobado" ? "bg-lime-500/10 text-lime-400" : ""}

    `}
            >
              {data.estado}
            </span>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={handleEditarPresupuesto}
                className="
    rounded-xl
    border
    border-blue-500
    px-4
    py-2
    text-sm
    font-semibold
    text-blue-400
    transition
    hover:bg-blue-500/10
  "
              >
                ✏ Editar presupuesto
              </button>

              {data.estado === "pendiente" ? (
                <button
                  onClick={() => handleEstadoChange("aprobado")}
                  className="
        rounded-xl
        bg-lime-500
        px-4
        py-2
        text-sm
        font-semibold
        text-black
        transition
        hover:bg-lime-400
      "
                >
                  ✔ Aprobar presupuesto
                </button>
              ) : (
                <button
                  onClick={() => handleEstadoChange("pendiente")}
                  className="
        rounded-xl
        border
        border-yellow-500
        px-4
        py-2
        text-sm
        font-semibold
        text-yellow-400
        transition
        hover:bg-yellow-500/10
      "
                >
                  ↩ Volver a pendiente
                </button>
              )}
              <button
                onClick={() => setEditing(!editing)}
                className="
    rounded-xl
    border
    border-blue-500
    px-4
    py-2
    text-sm
    font-semibold
    text-blue-400
    transition
    hover:bg-blue-500/10
  "
              >
                📝 Editar datos
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="
        rounded-xl
        border
        border-border
        px-4
        py-2
        text-sm
        font-semibold
        transition
        hover:bg-muted
      "
                  >
                    📄 PDF
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    disabled={pdfLoading}
                    onClick={async () => {
                      try {
                        setPdfLoading(true);

                        await view(presupuestoId);
                      } finally {
                        setPdfLoading(false);
                      }
                    }}
                  >
                    {pdfLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Eye className="mr-2 h-4 w-4" />
                    )}

                    {pdfLoading ? "Generando PDF..." : "Ver PDF"}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    disabled={pdfLoading}
                    onClick={async () => {
                      try {
                        setPdfLoading(true);

                        await save(
                          presupuestoId,
                          data.cliente || "SIN CLIENTE",
                          data.fecha ?? new Date().toISOString(),
                        );
                      } finally {
                        setPdfLoading(false);
                      }
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Guardar
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    disabled={pdfLoading}
                    onClick={async () => {
                      try {
                        setPdfLoading(true);

                        await saveAs(
                          presupuestoId,
                          data.cliente || "SIN CLIENTE",
                          data.fecha ?? new Date().toISOString(),
                        );
                      } finally {
                        setPdfLoading(false);
                      }
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Guardar como...
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <CompartirPresupuestoDialog
                presupuesto={{
                  cliente: data.cliente,
                  telefono: data.telefono,
                  items: data.items,
                  total: data.total,
                }}
                onPdf={() =>
                  save(
                    presupuestoId,
                    data.cliente || "SIN CLIENTE",
                    data.fecha ?? new Date().toISOString(),
                  )
                }
              />
              <DeletePresupuestoDialog onConfirm={handleDelete} />
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-zinc-500">Total</p>

          <p className="text-4xl font-black">{formatCurrency(data.total)}</p>
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
        {data.items?.map((item: PresupuestoItem) => (
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

                <p className="mt-2 text-sm text-zinc-400">
                  {item.descripcion.toUpperCase()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-zinc-500">
                  Cantidad: {item.cantidad}
                </p>

                <p className="mt-2 text-xl font-bold">
                  {formatCurrency(item.subtotal)}
                </p>

                <button
                  onClick={() => handleEditarItem(item)}
                  className="
      mt-3
      rounded-lg
      border
      border-blue-500
      px-3
      py-1
      text-xs
      font-semibold
      text-blue-400
      transition
      hover:bg-blue-500/10
    "
                >
                  ✏ Editar
                </button>
              </div>
            </div>

            {/* FINANCIERO ITEM */}

            {canViewFinancial && (
              <div
                className={`
    mt-5
    grid
    ${showPerfil ? "grid-cols-4" : "grid-cols-3"}
    gap-3
  `}
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

                {showPerfil && (
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
                )}

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
