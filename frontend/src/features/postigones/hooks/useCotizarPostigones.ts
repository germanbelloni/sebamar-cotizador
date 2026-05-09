import { useMutation } from "@tanstack/react-query";

import { cotizarPostigones } from "../api/cotizarPostigones";

export function useCotizarPostigones() {
  return useMutation({
    mutationFn: cotizarPostigones,

    onSuccess: (data) => {
      console.log("COTIZACION POSTIGONES:", data);
    },

    onError: (error) => {
      console.error(error);
    },
  });
}
