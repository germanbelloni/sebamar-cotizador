import { useMutation } from "@tanstack/react-query";

import { cotizarPatagonicas } from "../api/cotizarPatagonicas";

export function useCotizarPatagonicas() {
  return useMutation({
    mutationFn: cotizarPatagonicas,

    onSuccess: (data) => {
      console.log("COTIZACION PATAGONICAS:", data);
    },

    onError: (error) => {
      console.error(error);
    },
  });
}
