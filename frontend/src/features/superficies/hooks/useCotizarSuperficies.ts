import { useMutation } from "@tanstack/react-query";

import { cotizarsuperficies } from "../api/cotizarsuperficies";

export function useCotizarsuperficies() {
  return useMutation({
    mutationFn: cotizarsuperficies,

    onSuccess: (data) => {
      console.log("COTIZACION superficies:", data);
    },

    onError: (error) => {
      console.error(error);
    },
  });
}
