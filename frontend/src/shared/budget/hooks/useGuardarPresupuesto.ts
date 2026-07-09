import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { guardarPresupuesto } from "../api/guardarPresupuesto";

export function useGuardarPresupuesto() {
  return useMutation({
    mutationFn: guardarPresupuesto,

    onSuccess: (data) => {
      console.log("PRESUPUESTO GUARDADO:", data);

      toast.success("Presupuesto guardado");
    },

    onError: (error) => {
      console.error("ERROR GUARDANDO PRESUPUESTO:", error);

      toast.error("Error guardando presupuesto");
    },
  });
}
