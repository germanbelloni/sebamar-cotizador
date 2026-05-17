import { useMutation } from "@tanstack/react-query";

import { cotizarMarcos } from "../api/cotizarMarcos";

export function useCotizarMarcos() {
  return useMutation({
    mutationFn: cotizarMarcos,
  });
}
