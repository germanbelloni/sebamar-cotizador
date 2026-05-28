import { useEffect, useState } from "react";

import { FileText } from "lucide-react";

import api from "../lib/api";

type Presupuesto = {
  id: string;

  numero: number;

  cliente: string;

  fecha: string;

  total: number;

  estado?: string;
};

export default function PresupuestosPage() {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const { data } = await api.get("/presupuestos");

        setPresupuestos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    void cargar();
  }, []);

  function abrirPDF(id: string) {
    window.open(
      `${import.meta.env.VITE_API_URL}/presupuestos/${id}/pdf`,
      "_blank",
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115] p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Presupuestos</h1>

            <p className="mt-1 text-zinc-400">
              Historial de presupuestos generados
            </p>
          </div>
        </div>

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-zinc-800
            bg-[#171a21]
          "
        >
          {loading ? (
            <div
              className="
                p-10
                text-center
                text-zinc-400
              "
            >
              Cargando presupuestos...
            </div>
          ) : presupuestos.length === 0 ? (
            <div
              className="
                p-10
                text-center
                text-zinc-400
              "
            >
              No hay presupuestos todavía
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-[#1f232d]">
                <tr>
                  <th className="p-4 text-left">N°</th>

                  <th className="p-4 text-left">Cliente</th>

                  <th className="p-4 text-left">Fecha</th>

                  <th className="p-4 text-left">Estado</th>

                  <th className="p-4 text-right">Total</th>

                  <th className="p-4 text-center">PDF</th>
                </tr>
              </thead>

              <tbody>
                {presupuestos.map((presupuesto) => (
                  <tr
                    key={presupuesto.id}
                    className="
                        border-t
                        border-zinc-800

                        transition

                        hover:bg-white/5
                      "
                  >
                    <td className="p-4 font-medium">#{presupuesto.numero}</td>

                    <td className="p-4">{presupuesto.cliente || "-"}</td>

                    <td className="p-4 text-zinc-400">
                      {presupuesto.fecha || "-"}
                    </td>

                    <td className="p-4">
                      <span
                        className={`
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            uppercase

                            ${
                              presupuesto.estado === "pendiente"
                                ? "bg-yellow-500/10 text-yellow-400"
                                : ""
                            }

                            ${
                              presupuesto.estado === "enviado"
                                ? "bg-blue-500/10 text-blue-400"
                                : ""
                            }

                            ${
                              presupuesto.estado === "aprobado"
                                ? "bg-lime-500/10 text-lime-400"
                                : ""
                            }

                            ${
                              presupuesto.estado === "rechazado"
                                ? "bg-red-500/10 text-red-400"
                                : ""
                            }
                          `}
                      >
                        {presupuesto.estado || "pendiente"}
                      </span>
                    </td>

                    <td
                      className="
                          p-4
                          text-right
                          font-semibold
                          text-lime-400
                        "
                    >
                      $
                      {new Intl.NumberFormat("es-AR")
                        .format(presupuesto.total || 0)
                        .replace(/\./g, "")}
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => abrirPDF(presupuesto.id)}
                          className="
                              flex
                              h-10
                              w-10
                              items-center
                              justify-center

                              rounded-xl

                              border
                              border-lime-400/20

                              bg-lime-400/10

                              transition

                              hover:bg-lime-400/20
                            "
                        >
                          <FileText size={18} className="text-lime-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
