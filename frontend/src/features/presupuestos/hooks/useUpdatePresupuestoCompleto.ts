import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { updatePresupuestoCompleto } from "../api/updatePresupuestoCompleto";

export function useUpdatePresupuestoCompleto() {
  return useMutation({
    mutationFn: updatePresupuestoCompleto,

    onSuccess: () => {
      toast.success("Presupuesto actualizado.");
    },

    onError: (error) => {
      console.error(error);

      toast.error("No se pudo actualizar.");
    },
  });
}
