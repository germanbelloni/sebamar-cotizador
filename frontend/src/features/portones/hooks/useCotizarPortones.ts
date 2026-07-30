import { useMutation } from "@tanstack/react-query";

import { cotizarPortones } from "../api/cotizarPortones";

export function useCotizarPortones() {
  return useMutation({
    mutationFn: cotizarPortones,

    onError: (error) => {
      console.error(error);
    },
  });
}
