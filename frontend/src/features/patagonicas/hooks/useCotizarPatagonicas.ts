import { useMutation } from "@tanstack/react-query";

import { cotizarPatagonicas } from "../api/cotizarPatagonicas";

export function useCotizarPatagonicas() {
  return useMutation({
    mutationFn: cotizarPatagonicas,

    onError: (error) => {
      console.error(error);
    },
  });
}
