import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePresupuesto } from "../api/updatePresupuesto";

export function useUpdatePresupuesto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: {
        cliente?: string;
        telefono?: string;
        direccion?: string;
        observaciones?: string;
        validez?: string;
      };
    }) => updatePresupuesto(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["presupuesto"],
      });

      queryClient.invalidateQueries({
        queryKey: ["presupuestos"],
      });
    },
  });
}
