import { useMutation } from "@tanstack/react-query";

import { cotizarPanoFijo } from "../api/cotizarPanoFijo";

export function useCotizarPanoFijo() {
  return useMutation({
    mutationFn: cotizarPanoFijo,

    onSuccess: (data) => {
      console.log("COTIZACION pano fijo:", data);
    },

    onError: (error) => {
      console.error(error);
    },
  });
}
