import { useState } from "react";

import api from "../lib/api";

import { useAuthStore } from "../store/authStore";

export default function ConfiguracionPage() {
  const user = useAuthStore((state) => state.user);
  const refreshUser = useAuthStore((state) => state.refreshUser);

  const [margen, setMargen] = useState(user?.margen || 0);

  const [empresa, setEmpresa] = useState(user?.empresa || "");
  const [logo, setLogo] = useState(user?.logo || "");
  const [nombreEmpresa, setNombreEmpresa] = useState(user?.nombreEmpresa || "");

  const [colorPrimario, setColorPrimario] = useState(
    user?.colorPrimario || "#D6B400",
  );

  const [colorSecundario, setColorSecundario] = useState(
    user?.colorSecundario || "#1f2937",
  );

  const [telefono, setTelefono] = useState(user?.telefono || "");

  const [direccion, setDireccion] = useState(user?.direccion || "");

  const [email, setEmail] = useState(user?.email || "");

  const [observacionesPdf, setObservacionesPdf] = useState(
    user?.observacionesPdf || "",
  );

  const [loading, setLoading] = useState(false);

  async function handleGuardar() {
    try {
      setLoading(true);
      const response = await api.patch("/auth/configuracion", {
        margen,

        empresa,

        nombreEmpresa,

        telefono,

        direccion,

        email,

        observacionesPdf,

        logo,

        colorPrimario,

        colorSecundario,
      });

      refreshUser(response.data.user);

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

        {/* EMPRESA */}

        <div className="mt-4">
          <label className="mb-2 block text-sm">Identificador empresa</label>

          <input
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
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

        {/* NOMBRE COMERCIAL */}

        <div className="mt-4">
          <label className="mb-2 block text-sm">Nombre comercial</label>

          <input
            value={nombreEmpresa}
            onChange={(e) => setNombreEmpresa(e.target.value)}
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

        {/* TELEFONO */}

        <div className="mt-4">
          <label className="mb-2 block text-sm">Teléfono</label>

          <input
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
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

        {/* DIRECCION */}

        <div className="mt-4">
          <label className="mb-2 block text-sm">Dirección</label>

          <input
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
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

        {/* EMAIL */}

        <div className="mt-4">
          <label className="mb-2 block text-sm">Email</label>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <div className="mt-4">
          <label className="mb-2 block text-sm">Logo</label>

          <input
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            placeholder="/logos/sebamar.png"
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
        <div className="mt-4">
          <label className="mb-2 block text-sm">Color primario</label>

          <input
            value={colorPrimario}
            onChange={(e) => setColorPrimario(e.target.value)}
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

        <div className="mt-4">
          <label className="mb-2 block text-sm">Color secundario</label>

          <input
            value={colorSecundario}
            onChange={(e) => setColorSecundario(e.target.value)}
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

        {/* OBSERVACIONES PDF */}

        <div className="mt-4">
          <label className="mb-2 block text-sm">Observaciones PDF</label>

          <textarea
            value={observacionesPdf}
            onChange={(e) => setObservacionesPdf(e.target.value)}
            className="
              w-full
              rounded-2xl
              border
              border-border
              bg-background
              p-4
            "
            rows={4}
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
