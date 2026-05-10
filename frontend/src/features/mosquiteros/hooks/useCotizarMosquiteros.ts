import { useMutation } from "@tanstack/react-query";

import { cotizarMosquiteros } from "../api/cotizarMosquiteros";

export function useCotizarMosquiteros() {
  return useMutation({
    mutationFn: cotizarMosquiteros,

    onSuccess: (data) => {
      console.log("COTIZACION MOSQUITEROS:", data);
    },

    onError: (error) => {
      console.error(error);
    },
  });
}
