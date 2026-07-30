import { useMutation } from "@tanstack/react-query";

import { cotizarCortina } from "../api/cotizarCortina";

export function useCotizarCortina() {
  return useMutation({
    mutationFn: cotizarCortina,

    onError: (error) => {
      console.error(error);
    },
  });
}
