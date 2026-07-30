import { useMutation } from "@tanstack/react-query";

import { cotizarVentana } from "../api/cotizarVentana";

export function useCotizarVentana() {
  return useMutation({
    mutationFn: cotizarVentana,

    onError: (error) => {
      console.error(error);
    },
  });
}
