import { useMutation } from "@tanstack/react-query";

import { cotizarPanoFijo } from "../api/cotizarPanoFijo";

export function useCotizarPanoFijo() {
  return useMutation({
    mutationFn: cotizarPanoFijo,

    onError: (error) => {
      console.error(error);
    },
  });
}
