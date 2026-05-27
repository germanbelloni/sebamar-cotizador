import { useMutation } from "@tanstack/react-query";

import { guardarPresupuesto } from "../api/guardarPresupuesto";

export function useGuardarPresupuesto() {
  return useMutation({
    mutationFn: guardarPresupuesto,

    onSuccess: (data) => {
      console.log("PRESUPUESTO GUARDADO:", data);

      alert("Presupuesto guardado");
    },

    onError: (error) => {
      console.error("ERROR GUARDANDO PRESUPUESTO:", error);

      alert("Error guardando presupuesto");
    },
  });
}
