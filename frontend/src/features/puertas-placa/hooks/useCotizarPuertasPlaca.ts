import { useMutation } from "@tanstack/react-query";

import { cotizarPuertasPlaca } from "../api/cotizarPuertasPlaca";

export function useCotizarPuertasPlaca() {
  return useMutation({
    mutationFn: cotizarPuertasPlaca,

    onSuccess: (data) => {
      console.log("COTIZACION PUERTA PLACA:", data);
    },

    onError: (error) => {
      console.error(error);
    },
  });
}
