import { useMutation } from "@tanstack/react-query";

import { cotizarSuperficies } from "../api/cotizarSuperficies";

export function useCotizarSuperficies() {
  return useMutation({
    mutationFn: cotizarSuperficies,

    onSuccess: (data) => {
      console.log("COTIZACION SUPERFICIES:", data);
    },

    onError: (error) => {
      console.error(error);
    },
  });
}
