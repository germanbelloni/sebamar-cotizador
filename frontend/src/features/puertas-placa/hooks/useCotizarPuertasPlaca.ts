import { useMutation } from "@tanstack/react-query";

import { cotizarPuertasPlaca } from "../api/cotizarPuertasPlaca";

export function useCotizarPuertasPlaca() {
  return useMutation({
    mutationFn: cotizarPuertasPlaca,
    onError: (error) => {
      console.error(error);
    },
  });
}
