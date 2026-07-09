import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deletePresupuesto } from "../api/deletePresupuesto";

export function useDeletePresupuesto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePresupuesto,

    onSuccess() {
      toast.success("Presupuesto eliminado.");

      queryClient.invalidateQueries({
        queryKey: ["presupuestos"],
      });
    },

    onError() {
      toast.error("No se pudo eliminar el presupuesto.");
    },
  });
}
