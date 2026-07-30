import { useMutation } from "@tanstack/react-query";

import {
  cotizarMosquiteros,
  type CotizacionMosquiterosResponse,
} from "../api/cotizarMosquiteros";

import type { MosquiterosConfig } from "../types";

export function useCotizarMosquiteros() {
  return useMutation<CotizacionMosquiterosResponse, Error, MosquiterosConfig>({
    mutationFn: cotizarMosquiteros,

    onError: (error) => {
      console.error(error);
    },
  });
}
