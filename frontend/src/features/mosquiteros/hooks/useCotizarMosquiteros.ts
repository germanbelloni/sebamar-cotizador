import { useMutation } from "@tanstack/react-query";

import { cotizarMosquiteros } from "../api/cotizarMosquiteros";

import type { MosquiterosConfig } from "../types";

export function useCotizarMosquiteros() {
  return useMutation<number, Error, MosquiterosConfig>({
    mutationFn: cotizarMosquiteros,

    onSuccess: (data) => {
      console.log("COTIZACION MOSQUITEROS:", data);
    },

    onError: (error) => {
      console.error(error);
    },
  });
}
