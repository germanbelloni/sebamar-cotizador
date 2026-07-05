import { Share2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useSharePresupuesto } from "../hooks/useSharePresupuesto";

type Props = {
  presupuesto: {
    cliente?: string;
    telefono?: string;
    items: any[];
    total: number;
  };

  onPdf: () => void;
};

export function CompartirPresupuestoDialog({ presupuesto, onPdf }: Props) {
  const { copy, openWhatsApp } = useSharePresupuesto();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="
            rounded-xl
            bg-emerald-500
            px-4
            py-2
            text-sm
            font-semibold
            text-black
            hover:bg-emerald-400
          "
        >
          <Share2 size={16} className="inline mr-2" />
          Compartir
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Compartir presupuesto</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="flex flex-col gap-3 py-3">
          <button
            onClick={() => openWhatsApp(presupuesto)}
            className="rounded-xl bg-green-500 py-3 font-semibold text-white"
          >
            🟢 Abrir WhatsApp
          </button>

          <button
            onClick={() => copy(presupuesto)}
            className="rounded-xl border py-3 font-semibold"
          >
            📋 Copiar texto
          </button>

          <button
            onClick={onPdf}
            className="rounded-xl border py-3 font-semibold"
          >
            📄 Descargar PDF
          </button>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cerrar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
