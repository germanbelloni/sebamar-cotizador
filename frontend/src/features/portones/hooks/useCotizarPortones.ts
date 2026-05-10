import { useMutation } from "@tanstack/react-query";

import { cotizarPortones } from "../api/cotizarPortones";

export function useCotizarPortones() {
  return useMutation({
    mutationFn: cotizarPortones,

    onSuccess: (data) => {
      console.log("COTIZACION PORTONES:", data);
    },

    onError: (error) => {
      console.error(error);
    },
  });
}
