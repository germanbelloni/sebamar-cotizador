import { useState } from "react";

import api from "../lib/api";

import { useAuthStore } from "../store/authStore";

export default function ConfiguracionPage() {
  const user = useAuthStore((state) => state.user);

  const [margen, setMargen] = useState(user?.margen || 0);

  const [loading, setLoading] = useState(false);

  async function handleGuardar() {
    try {
      setLoading(true);

      await api.patch("/auth/configuracion", {
        margen,
      });

      alert("Configuración guardada");
    } catch (error) {
      console.log(error);

      alert("Error guardando configuración");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-10 text-white">
      <div
        className="
          max-w-xl

          rounded-3xl
          border
          border-border

          bg-card

          p-8
        "
      >
        <h1
          className="
            text-3xl
            font-black
          "
        >
          Configuración
        </h1>

        <p
          className="
            mt-2
            text-sm
            text-muted-foreground
          "
        >
          Configuración comercial de la empresa.
        </p>

        {/* MARGEN */}

        <div className="mt-8">
          <label
            className="
              mb-2
              block
              text-sm
            "
          >
            Margen global (%)
          </label>

          <input
            type="number"
            value={margen}
            onChange={(e) => setMargen(Number(e.target.value))}
            className="
              h-12
              w-full

              rounded-2xl
              border
              border-border

              bg-background

              px-4
            "
          />
        </div>

        {/* ACTION */}

        <button
          onClick={handleGuardar}
          disabled={loading}
          className="
            mt-8

            h-12
            w-full

            rounded-2xl

            bg-lime-400

            font-bold
            text-black

            transition-opacity

            hover:opacity-90
          "
        >
          {loading ? "Guardando..." : "Guardar configuración"}
        </button>
      </div>
    </div>
  );
}
