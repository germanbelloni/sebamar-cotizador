import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updatePresupuestoEstado } from "../api/updatePresupuestoEstado";

type Payload = {
  id: string;
  estado: "pendiente" | "aprobado";
};

export function useUpdatePresupuestoEstado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, estado }: Payload) =>
      updatePresupuestoEstado(id, estado),

    onSuccess() {
      toast.success("Presupuesto aprobado.");

      queryClient.invalidateQueries({
        queryKey: ["presupuestos"],
      });
    },

    onError() {
      toast.error("No se pudo actualizar el presupuesto.");
    },
  });
}
