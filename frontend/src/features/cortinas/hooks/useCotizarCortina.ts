import { useMutation } from "@tanstack/react-query";

import { cotizarCortina } from "../api/cotizarCortina";

export function useCotizarCortina() {
  return useMutation({
    mutationFn: cotizarCortina,

    onSuccess: (data) => {
      console.log("COTIZACION CORTINAS:", data);
    },

    onError: (error) => {
      console.error(error);
    },
  });
}
