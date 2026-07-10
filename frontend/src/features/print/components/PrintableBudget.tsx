import { useEffect, useState } from "react";
import { ArrowLeft, Copy, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Cliente } from "@/features/clientes/types";
import type { Empresa } from "@/features/empresa/types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";
import { useGuardarPresupuesto } from "@/shared/budget/hooks/useGuardarPresupuesto";

import { budgetToApi } from "@/shared/budget/serializers/budgetToApi";

import { PrintableBudgetRenderer } from "../render/PrintableBudgetRenderer";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { budgetToWhatsApp } from "@/shared/budget/serializers/budgetToWhatsApp";
import { openPdf } from "@/features/presupuestos/api/openPdf";
import { useBudgetStore } from "@/shared/budget/store/useBudgetStore";
import { useUpdatePresupuestoCompleto } from "@/features/presupuestos/hooks/useUpdatePresupuestoCompleto";

type Props = {
  numero: number;
  fecha: string;

  empresa: Empresa;
  cliente: Cliente;
  items: BudgetItem[];
};
type PresupuestoGuardadoResponse = {
  _id?: string;
  id?: string;
  numero?: number;
};
export function PrintableBudget({
  numero,
  fecha,
  empresa,
  cliente,
  items,
}: Props) {
  const navigate = useNavigate();
  const primaryColor = empresa.primaryColor || "#111827";

  const guardarMutation = useGuardarPresupuesto();
  const updateMutation = useUpdatePresupuestoCompleto();
  const editingPresupuestoId = useBudgetStore(
    (state) => state.editingPresupuestoId,
  );

  const setEditingPresupuestoId = useBudgetStore(
    (state) => state.setEditingPresupuestoId,
  );
  const setEditingCliente = useBudgetStore((state) => state.setEditingCliente);

  const setEditingFecha = useBudgetStore((state) => state.setEditingFecha);

  const clearBudget = useBudgetStore((state) => state.clearBudget);
  const [presupuestoGuardado, setPresupuestoGuardado] = useState<{
    id: string;
    numero?: number;
  } | null>(null);

  function handleGuardarPresupuesto() {
    if (!cliente.nombre?.trim()) {
      toast.error("Debe ingresar un cliente");
      return;
    }

    if (!cliente.telefono?.trim()) {
      toast.error("Debe ingresar un teléfono");
      return;
    }

    guardarMutation.mutate(
      budgetToApi({
        items,
        cliente: cliente.nombre,
        telefono: cliente.telefono,
      }),
      {
        onSuccess: (data: PresupuestoGuardadoResponse) => {
          console.log("PRESUPUESTO GUARDADO:", data);

          setPresupuestoGuardado({
            id: data._id || data.id || "",
            numero: data.numero,
          });

          toast.success("Presupuesto guardado. Ya podés descargar el PDF.");
        },
      },
    );
  }

  async function handleActualizarPresupuesto() {
    if (!editingPresupuestoId) return;

    try {
      await updateMutation.mutateAsync({
        id: editingPresupuestoId,
        cliente: cliente.nombre,
        telefono: cliente.telefono,
        items,
        total: items.reduce((acc, item) => acc + item.subtotal, 0),
      });

      setPresupuestoGuardado({
        id: editingPresupuestoId,
      });

      clearBudget();

      setEditingPresupuestoId(null);
      setEditingCliente(null);
      setEditingFecha(null);

      toast.success("Presupuesto actualizado.");

      navigate("/");
    } catch (error) {
      console.error(error);

      toast.error("No se pudo actualizar el presupuesto.");
    }
  }
  function handleCopyText() {
    const text = budgetToWhatsApp({
      empresa: empresa.nombre,
      cliente: cliente.nombre,
      items,
      total: items.reduce((acc, item) => acc + item.subtotal, 0),
    });

    navigator.clipboard.writeText(text);

    toast.success("Texto copiado al portapapeles.");
  }

  useEffect(() => {
    document.body.style.background = "white";

    return () => {
      document.body.style.background = "";
    };
  }, []);

  return (
    <div className="w-full bg-white py-2 print:bg-white print:py-0">
      {editingPresupuestoId && (
        <div
          className="
      mx-auto
      mb-6
      flex
      w-[850px]
      items-center
      justify-between
      rounded-2xl
      border
      border-amber-400
      bg-amber-50
      px-6
      py-4
      text-amber-700
      print:hidden
    "
        >
          <div>
            <p className="font-bold">
              ✏ Estás editando un presupuesto existente
            </p>

            <p className="text-sm">
              Los cambios reemplazarán el presupuesto original.
            </p>
          </div>
        </div>
      )}
      <div className="print-hidden mx-auto mb-8 flex w-[850px] items-center justify-between px-4">
        {/* IZQUIERDA */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-full border-zinc-300 text-black hover:bg-zinc-100"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>

        {/* DERECHA */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            className="rounded-full bg-zinc-200 text-black hover:bg-zinc-300"
            onClick={
              editingPresupuestoId
                ? handleActualizarPresupuesto
                : handleGuardarPresupuesto
            }
          >
            {editingPresupuestoId ? "Actualizar presupuesto" : "Guardar"}
          </Button>

          <Button
            variant="outline"
            className="rounded-full border-zinc-300 text-black hover:bg-zinc-100"
            onClick={handleCopyText}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copiar texto
          </Button>

          {presupuestoGuardado && (
            <Button
              className="rounded-full shadow-lg transition-all hover:shadow-xl"
              style={{
                backgroundColor: primaryColor,
              }}
              onClick={() =>
                openPdf(presupuestoGuardado.id, cliente.nombre, fecha)
              }
            >
              <Printer className="mr-2 h-4 w-4" />
              PDF
            </Button>
          )}
        </div>
      </div>

      <PrintableBudgetRenderer
        numero={numero}
        fecha={fecha}
        empresa={empresa}
        cliente={cliente}
        items={items}
      />
    </div>
  );
}
