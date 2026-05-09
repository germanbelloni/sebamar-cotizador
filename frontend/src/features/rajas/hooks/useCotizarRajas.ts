import { useMutation } from "@tanstack/react-query";

import { cotizarRajas } from "../api/cotizarRajas";

export function useCotizarRajas() {
  return useMutation({
    mutationFn: cotizarRajas,

    onSuccess: (data) => {
      console.log("COTIZACION RAJAS:", data);
    },

    onError: (error) => {
      console.error(error);
    },
  });
}
