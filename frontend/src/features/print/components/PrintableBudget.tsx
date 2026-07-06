import { useEffect } from "react";
import { MessageSquare, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Cliente } from "@/features/clientes/types";
import type { Empresa } from "@/features/empresa/types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

import { useShareWhatsApp } from "@/shared/budget/hooks/useShareWhatsApp";
import { useGuardarPresupuesto } from "@/shared/budget/hooks/useGuardarPresupuesto";

import { budgetToApi } from "@/shared/budget/serializers/budgetToApi";

import { PrintableBudgetRenderer } from "../render/PrintableBudgetRenderer";

import { generarPdf } from "../api/generarPdf";

type Props = {
  numero: number;
  fecha: string;

  empresa: Empresa;
  cliente: Cliente;
  items: BudgetItem[];
};

export function PrintableBudget({
  numero,
  fecha,
  empresa,
  cliente,
  items,
}: Props) {
  const primaryColor = empresa.primaryColor || "#111827";

  const { share } = useShareWhatsApp({
    empresa: empresa.nombre,
    cliente: cliente.nombre,
    telefono: cliente.telefono,
  });

  const guardarMutation = useGuardarPresupuesto();

  function handleGuardarPresupuesto() {
    if (!cliente.nombre?.trim()) {
      alert("Debe ingresar un cliente");
      return;
    }

    if (!cliente.telefono?.trim()) {
      alert("Debe ingresar un teléfono");
      return;
    }

    guardarMutation.mutate(
      budgetToApi({
        items,
        cliente: cliente.nombre,
        telefono: cliente.telefono,
      }),
    );
  }

  useEffect(() => {
    document.body.style.background = "white";

    return () => {
      document.body.style.background = "";
    };
  }, []);

  return (
    <div className="w-full bg-white py-2 print:bg-white print:py-0">
      <div className="print-hidden mx-auto mb-8 flex w-[850px] items-center justify-between px-4">
        <h2 className="font-medium text-zinc-500">
          Vista previa del presupuesto
        </h2>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            className="rounded-full"
            onClick={handleGuardarPresupuesto}
          >
            Guardar
          </Button>

          <Button variant="outline" className="rounded-full" onClick={share}>
            <MessageSquare className="mr-2 h-4 w-4" />
            WhatsApp
          </Button>

          <Button
            className="rounded-full shadow-lg transition-all hover:shadow-xl"
            style={{
              backgroundColor: primaryColor,
            }}
            onClick={() =>
              generarPdf({
                numero,
                fecha,
                empresa,
                cliente,
                items,
              })
            }
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimir / PDF
          </Button>
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
