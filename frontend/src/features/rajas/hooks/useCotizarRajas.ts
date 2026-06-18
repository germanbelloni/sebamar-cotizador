import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { cotizarRajas } from "../api/cotizarRajas";

export function useCotizarRajas() {
  return useMutation({
    mutationFn: cotizarRajas,

    onSuccess: (data) => {
      console.log("✅ COTIZACION RAJAS:", data);
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.error;

        console.error("❌ ERROR RAJAS:", backendMessage || error.message);

        return;
      }

      console.error("❌ ERROR RAJAS:", error);
    },
  });
}
