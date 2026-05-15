import { useMutation } from "@tanstack/react-query";

import { cotizarPuertas } from "../api/cotizarPuertas";

export function useCotizarPuertas() {
  return useMutation({
    mutationFn: cotizarPuertas,
  });
}
