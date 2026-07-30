import { useMutation } from "@tanstack/react-query";

import { cotizarPostigones } from "../api/cotizarPostigones";

export function useCotizarPostigones() {
  return useMutation({
    mutationFn: cotizarPostigones,

    onError: (error) => {
      console.error(error);
    },
  });
}
