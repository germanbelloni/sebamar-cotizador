import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { cotizarVentanasAbrir } from "../api/cotizarVentanasAbrir";

export function useCotizarVentanasAbrir() {
  return useMutation({
    mutationFn: cotizarVentanasAbrir,

    onSuccess: (data) => {
      console.log("✅ COTIZACION VENTANAS ABRIR:", data);
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.error;

        console.error(
          "❌ ERROR VENTANAS ABRIR:",
          backendMessage || error.message,
        );

        return;
      }

      console.error("❌ ERROR VENTANAS ABRIR:", error);
    },
  });
}
