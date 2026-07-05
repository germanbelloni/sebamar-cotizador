import { Check } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Props = {
  onConfirm: () => void;
};

export function AprobarPresupuestoDialog({ onConfirm }: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="
            flex
            items-center
            gap-2

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
          <Check size={16} />
          Aprobar
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Aprobar presupuesto?</AlertDialogTitle>

          <AlertDialogDescription>
            El presupuesto pasará al estado <strong>Aprobado</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>

          <AlertDialogAction onClick={onConfirm}>Aprobar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
