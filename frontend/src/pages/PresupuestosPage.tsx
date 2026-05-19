import { useEffect, useState } from "react";

import { FileText } from "lucide-react";

import { apiFetch } from "@/lib/api";

type Presupuesto = {
  id: string;
  numero: number;
  cliente: string;
  fecha: string;
  total: number;
};

export default function PresupuestosPage() {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const data = (await apiFetch("/api/presupuestos")) as Presupuesto[];

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
      `${import.meta.env.VITE_API_URL}/api/presupuestos/${id}/pdf`,
      "_blank",
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Presupuestos</h1>

            <p className="text-zinc-400 mt-1">
              Historial de presupuestos generados
            </p>
          </div>
        </div>

        <div className="bg-[#171a21] border border-zinc-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-zinc-400">
              Cargando presupuestos...
            </div>
          ) : presupuestos.length === 0 ? (
            <div className="p-10 text-center text-zinc-400">
              No hay presupuestos todavía
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-[#1f232d]">
                <tr>
                  <th className="text-left p-4">N°</th>

                  <th className="text-left p-4">Cliente</th>

                  <th className="text-left p-4">Fecha</th>

                  <th className="text-right p-4">Total</th>

                  <th className="text-center p-4">PDF</th>
                </tr>
              </thead>

              <tbody>
                {presupuestos.map((presupuesto) => (
                  <tr
                    key={presupuesto.id}
                    className="border-t border-zinc-800 hover:bg-white/5 transition"
                  >
                    <td className="p-4 font-medium">#{presupuesto.numero}</td>

                    <td className="p-4">{presupuesto.cliente || "-"}</td>

                    <td className="p-4 text-zinc-400">
                      {presupuesto.fecha || "-"}
                    </td>

                    <td className="p-4 text-right font-semibold text-lime-400">
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
                            h-10
                            w-10

                            rounded-xl

                            border
                            border-lime-400/20

                            bg-lime-400/10

                            flex
                            items-center
                            justify-center

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
