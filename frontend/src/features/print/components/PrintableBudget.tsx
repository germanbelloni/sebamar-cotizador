import { Button } from "@/components/ui/button";

import type { Cliente } from "@/features/clientes/types";
import type { Empresa } from "@/features/empresa/types";
import type { VentanaItem } from "@/features/ventanas/types";

import { formatCurrency } from "@/features/ventanas/utils/formatCurrency";

type Props = {
  empresa: Empresa;

  cliente: Cliente;

  items: VentanaItem[];
};

export function PrintableBudget({ empresa, cliente, items }: Props) {
  const total = items.reduce(
    (acc, item) => acc + item.subtotal * item.cantidad,
    0,
  );

  const today = new Date();

  const formattedDate = today.toLocaleDateString("es-AR");

  const presupuestoId = Date.now().toString().slice(-4);

  return (
    <div
      className="
        min-h-screen
        bg-zinc-300
        py-10
        print:bg-white
        print:py-0
      "
    >
      {/* ACTIONS */}

      <div className="mx-auto mb-4 flex w-[820px] justify-end print:hidden">
        <Button onClick={() => window.print()}>Imprimir / Guardar PDF</Button>
      </div>

      {/* DOCUMENT */}

      <div
        className="
          mx-auto
          w-[820px]
          bg-white
          text-black
        "
      >
        {/* OUTER BORDER */}

        <div
          className="border-[14px] p-5"
          style={{
            borderColor: empresa.primaryColor || "#d6c221",
          }}
        >
          {/* TOP */}

          <div className="flex justify-between gap-8">
            {/* LEFT */}

            <div className="flex-1">
              {empresa.logo ? (
                <img
                  src={empresa.logo}
                  alt={empresa.nombre}
                  className="mb-3 h-16 object-contain"
                />
              ) : (
                <h1 className="text-[32px] font-black uppercase leading-none tracking-tight">
                  {empresa.nombre}
                </h1>
              )}

              <div className="mt-3 space-y-[2px] text-[13px] leading-tight text-zinc-800">
                {empresa.direccion && <p>{empresa.direccion}</p>}

                {empresa.telefono && <p>{empresa.telefono}</p>}

                {empresa.email && <p>{empresa.email}</p>}
              </div>
            </div>

            {/* RIGHT */}

            <div className="w-[250px] shrink-0 text-right">
              <div
                className="
                  inline-flex
                  items-center
                  justify-center
                  px-5 py-2
                  text-[28px]
                  font-black
                  uppercase
                  tracking-wide
                "
                style={{
                  backgroundColor: empresa.primaryColor || "#d6c221",
                }}
              >
                PRESUPUESTO
              </div>

              <div className="mt-8 space-y-1 text-[13px] leading-tight">
                <p>
                  <span className="font-bold">Fecha:</span> {formattedDate}
                </p>

                <p>
                  <span className="font-bold">Detalle Nº:</span> {presupuestoId}
                </p>
              </div>
            </div>
          </div>

          {/* CLIENTE */}

          <div className="mt-8 border border-zinc-400">
            <div className="border-b border-zinc-400 bg-zinc-100 px-3 py-2 text-[13px] font-bold uppercase">
              Facturar a:
            </div>

            <div className="space-y-1 p-3 text-[13px]">
              <p className="font-semibold uppercase">{cliente.nombre || "-"}</p>

              <p>{cliente.telefono || "-"}</p>
            </div>
          </div>

          {/* TABLE */}

          <div className="mt-8">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-zinc-100">
                  <th className="border border-zinc-400 px-2 py-2 text-left font-bold">
                    Cant.
                  </th>

                  <th className="border border-zinc-400 px-2 py-2 text-left font-bold">
                    Descripción
                  </th>

                  <th className="border border-zinc-400 px-2 py-2 text-right font-bold">
                    Precio unitario
                  </th>

                  <th className="border border-zinc-400 px-2 py-2 text-right font-bold">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-zinc-300 px-2 py-3 align-top">
                      {item.cantidad}
                    </td>

                    <td className="border border-zinc-300 px-2 py-3 align-top">
                      {item.description}
                    </td>

                    <td className="border border-zinc-300 px-2 py-3 text-right align-top whitespace-nowrap">
                      {formatCurrency(item.subtotal)}
                    </td>

                    <td className="border border-zinc-300 px-2 py-3 text-right align-top whitespace-nowrap font-semibold">
                      {formatCurrency(item.subtotal * item.cantidad)}
                    </td>
                  </tr>
                ))}

                {/* EMPTY ROWS */}

                {Array.from({
                  length: Math.max(0, 10 - items.length),
                }).map((_, index) => (
                  <tr key={index}>
                    <td className="h-[42px] border border-zinc-300" />

                    <td className="border border-zinc-300" />

                    <td className="border border-zinc-300" />

                    <td className="border border-zinc-300" />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTAL */}

          <div className="mt-6 flex justify-end">
            <div className="w-[320px] border-2 border-black">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-[22px] font-black uppercase">Total</span>

                <span className="text-[24px] font-black">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>

          {/* FOOTER */}

          <div className="mt-12 border-t border-zinc-400 pt-4 text-center text-[12px] text-zinc-700">
            <p>Gracias por confiar en {empresa.nombre}</p>

            {empresa.telefono && (
              <p className="mt-1">Consultas: {empresa.telefono}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
