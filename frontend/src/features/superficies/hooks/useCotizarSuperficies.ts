// useCotizarSuperficies.ts

import { useMutation } from "@tanstack/react-query";

import { cotizarSuperficies } from "../api/cotizarSuperficies";

export function useCotizarSuperficies() {
  return useMutation({
    mutationFn: cotizarSuperficies,

    onError: (error) => {
      console.error(error);
    },
  });
}
