import { useMutation } from "@tanstack/react-query";

import { cotizarPuertas } from "../api/cotizarPuertas";

export function useCotizarPuertas() {
  return useMutation({
    mutationFn: cotizarPuertas,

    onSuccess: (data) => {
      console.log("COTIZACION PUERTAS:", data);
    },

    onError: (error) => {
      console.error(error);
    },
  });
}
