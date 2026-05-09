import { useMutation } from "@tanstack/react-query";

import { cotizarVentana } from "../api/cotizarVentana";

export function useCotizarVentana() {
  return useMutation({
    mutationFn: cotizarVentana,

    onSuccess: (data) => {
      console.log("COTIZACION:", data);
    },

    onError: (error) => {
      console.error(error);
    },
  });
}
