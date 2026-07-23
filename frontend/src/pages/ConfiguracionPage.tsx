import { useEffect, useState } from "react";

import api from "../lib/api";

import { useAuthStore } from "../store/authStore";
type EstadisticaUsuario = {
  userId: string;
  usuario: string;

  generarPresupuesto: number;
  copiarCarrito: number;
  copiarPresupuesto: number;

  hoy: number;
  ultimos7Dias: number;
  ultimos30Dias: number;

  ultimaActividad: string;
};

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
  const [estadisticas, setEstadisticas] = useState<EstadisticaUsuario[]>([]);

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

  useEffect(() => {
    async function cargarEstadisticas() {
      if (user?.role !== "superadmin") return;

      try {
        const { data } = await api.get("/estadisticas");

        setEstadisticas(data);
      } catch (error) {
        console.error(error);
      }
    }

    cargarEstadisticas();
  }, [user]);

  return (
    <div className="p-10 text-white">
      <div
        className="
  w-full
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
        {/* LOGO */}

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

        {/* COLOR PRIMARIO */}

        <div className="mt-4">
          <label className="mb-2 block text-sm">Color primario</label>

          <input
            type="color"
            value={colorPrimario}
            onChange={(e) => setColorPrimario(e.target.value)}
            className="
      h-12
      w-full
      cursor-pointer
      rounded-2xl
      border
      border-border
      bg-background
      p-1
    "
          />
        </div>

        {/* COLOR SECUNDARIO */}

        <div className="mt-4">
          <label className="mb-2 block text-sm">Color secundario</label>

          <input
            type="color"
            value={colorSecundario}
            onChange={(e) => setColorSecundario(e.target.value)}
            className="
      h-12
      w-full
      cursor-pointer
      rounded-2xl
      border
      border-border
      bg-background
      p-1
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
        {user?.role === "superadmin" && (
          <div
            className="
      mt-10
      rounded-3xl
      border
      border-border
      bg-card
      p-8
    "
          >
            <h2 className="text-2xl font-bold">Estadísticas de uso</h2>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3">Usuario</th>
                    <th className="pb-3 text-center">Generó</th>
                    <th className="pb-3 text-center">Copió carrito</th>
                    <th className="pb-3 text-center">Copió presupuesto</th>

                    <th className="pb-3 text-center">Hoy</th>
                    <th className="pb-3 text-center">7 días</th>
                    <th className="pb-3 text-center">30 días</th>

                    <th className="pb-3">Última actividad</th>
                  </tr>
                </thead>

                <tbody>
                  {estadisticas.map((item) => (
                    <tr key={item.userId} className="border-b border-border/30">
                      <td className="py-3">{item.usuario}</td>

                      <td className="text-center">{item.generarPresupuesto}</td>

                      <td className="text-center">{item.copiarCarrito}</td>

                      <td className="text-center">{item.copiarPresupuesto}</td>

                      <td className="text-center">{item.hoy}</td>

                      <td className="text-center">{item.ultimos7Dias}</td>

                      <td className="text-center">{item.ultimos30Dias}</td>

                      <td>
                        {new Date(item.ultimaActividad).toLocaleString("es-AR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
