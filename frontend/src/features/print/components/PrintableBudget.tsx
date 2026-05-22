import { Button } from "@/components/ui/button";

import { Printer, User, MessageSquare } from "lucide-react";

import type { Cliente } from "@/features/clientes/types";
import type { Empresa } from "@/features/empresa/types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

import { formatCurrency } from "@/features/ventanas/utils/formatCurrency";
import { useShareWhatsApp } from "@/shared/budget/hooks/useShareWhatsApp";

type Props = {
  empresa: Empresa;

  cliente: Cliente;

  items: BudgetItem[];
};

export function PrintableBudget({ empresa, cliente, items }: Props) {
  const total = items.reduce((acc, item) => acc + item.subtotal, 0);

  const today = new Date();

  const formattedDate = today.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const presupuestoId = `${today.getDate()}${
    today.getMonth() + 1
  }${today.getFullYear().toString().slice(-2)}`;

  const primaryColor = empresa.primaryColor || "#111827";

  const { share } = useShareWhatsApp({
    empresa: empresa.nombre,
    cliente: cliente.nombre,
    telefono: cliente.telefono,
  });

  return (
    <div className="min-h-screen bg-zinc-100 py-12 print:bg-white print:py-0">
      {/* ACTIONS */}

      <div className="print-hidden mx-auto mb-8 flex w-[850px] items-center justify-between px-4">
        <h2 className="font-medium text-zinc-500">
          Vista Previa de Presupuesto
        </h2>

        <div className="flex items-center gap-3">
          <Button onClick={share} variant="outline" className="rounded-full">
            <MessageSquare className="mr-2 h-4 w-4" />
            WhatsApp
          </Button>

          <Button
            onClick={() => window.print()}
            className="rounded-full shadow-lg transition-all hover:shadow-xl"
            style={{
              backgroundColor: primaryColor,
            }}
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimir o Guardar PDF
          </Button>
        </div>
      </div>

      {/* PAGE */}

      <div
        className="
          relative
          mx-auto
          w-[850px]
          overflow-hidden
          rounded-[32px]
          bg-white
          shadow-[0_0_50px_-12px_rgba(0,0,0,0.10)]

          print:w-full
          print:rounded-none
          print:shadow-none
        "
      >
        {/* TOP ACCENT */}

        <div
          className="h-3 w-full"
          style={{
            background: `linear-gradient(to right, ${primaryColor}, ${empresa.secondaryColor})`,
          }}
        />

        {/* DECORATION */}

        <div
          className="
            absolute
            right-[-120px]
            top-[-120px]

            h-[320px]
            w-[320px]

            rounded-full

            blur-3xl
            opacity-10
          "
          style={{
            backgroundColor: primaryColor,
          }}
        />

        <div className="p-16">
          {/* HEADER */}

          <div className="flex items-start justify-between">
            {/* LEFT */}

            <div>
              <img
                src={empresa.logo}
                alt={empresa.nombre}
                className="mb-6 h-20 object-contain"
              />

              <div className="space-y-1 text-sm font-medium text-zinc-500">
                {empresa.direccion && <p>{empresa.direccion}</p>}

                <p>
                  {empresa.telefono} · {empresa.email}
                </p>
              </div>
            </div>

            {/* RIGHT */}

            <div className="text-right">
              <h2
                className="
                  absolute
                  right-16
                  top-12

                  select-none

                  text-7xl
                  font-black
                  tracking-tighter

                  opacity-[0.04]
                "
              >
                PRESUPUESTO
              </h2>

              <div
                className="
                  inline-flex

                  rounded-2xl

                  px-6 py-3

                  text-sm
                  font-bold
                  uppercase
                  tracking-[0.3em]

                  text-white

                  shadow-xl
                "
                style={{
                  background: `linear-gradient(to right, ${primaryColor}, ${empresa.secondaryColor})`,
                }}
              >
                Presupuesto
              </div>

              <div className="mt-10 space-y-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">
                    Número
                  </span>

                  <span className="font-mono text-2xl font-black text-zinc-900">
                    #{presupuestoId}
                  </span>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">
                    Fecha de emisión
                  </span>

                  <span className="font-medium text-zinc-700">
                    {formattedDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CLIENT */}

          <div className="mt-16 grid grid-cols-2 gap-12 border-t border-zinc-100 pt-12">
            <div>
              <div className="mb-4 flex items-center gap-2 text-zinc-400">
                <User size={14} />

                <span className="text-xs font-bold uppercase tracking-[0.25em]">
                  Información del Cliente
                </span>
              </div>

              <h3 className="text-3xl font-black tracking-tight text-zinc-900">
                {cliente.nombre || "Consumidor Final"}
              </h3>

              <p className="mt-2 text-zinc-500">
                {cliente.telefono || "Sin teléfono registrado"}
              </p>
            </div>

            {/* NOTE */}

            <div
              className="
                rounded-3xl

                border border-zinc-100

                bg-gradient-to-br
                from-zinc-50
                to-white

                p-7

                shadow-sm
              "
            >
              <div className="mb-3 flex items-center gap-2 text-zinc-400">
                <MessageSquare size={14} />

                <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
                  Nota rápida
                </span>
              </div>

              <p className="text-sm leading-relaxed text-zinc-500">
                Este documento representa una cotización formal de los productos
                solicitados.
                <br />
                Los valores pueden variar según disponibilidad y costos de
                materiales.
              </p>
            </div>
          </div>

          {/* TABLE */}

          <div className="mt-14 overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm">
            {/* HEAD */}

            <div
              className="
                grid
                grid-cols-[90px_1fr_180px_180px]

                px-8
                py-5

                text-[11px]
                font-bold
                uppercase
                tracking-[0.25em]

                text-white
              "
              style={{
                background: `linear-gradient(to right, ${primaryColor}, ${empresa.secondaryColor})`,
              }}
            >
              <div>Cant.</div>

              <div>Descripción detallada</div>

              <div className="text-right">Unitario</div>

              <div className="text-right">Subtotal</div>
            </div>

            {/* BODY */}

            <div className="divide-y divide-zinc-100">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="
                    grid
                    grid-cols-[90px_1fr_180px_180px]

                    px-8
                    py-6

                    transition-colors

                    hover:bg-zinc-50/60
                  "
                >
                  <div className="font-mono font-semibold text-zinc-900">
                    {item.cantidad}
                  </div>

                  <div>
                    <div className="font-semibold leading-relaxed text-zinc-800">
                      {item.descripcion}
                    </div>

                    <div className="mt-1 text-xs text-zinc-400">
                      {item.titulo}
                    </div>
                  </div>

                  <div className="text-right text-zinc-600">
                    {formatCurrency(item.precioUnitario)}
                  </div>

                  <div className="text-right font-bold text-zinc-900">
                    {formatCurrency(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TOTAL */}

          <div className="mt-14 flex justify-end">
            <div className="w-full max-w-[420px]">
              <div
                className="
                  relative
                  overflow-hidden

                  rounded-[32px]

                  p-8

                  text-white

                  shadow-[0_20px_60px_rgba(0,0,0,0.18)]
                "
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${empresa.secondaryColor})`,
                }}
              >
                <div
                  className="
                    absolute
                    right-[-40px]
                    top-[-40px]

                    h-[180px]
                    w-[180px]

                    rounded-full

                    bg-white
                    opacity-10
                  "
                />

                <div className="relative">
                  <div className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">
                    Total Final
                  </div>

                  <div className="mt-4 text-5xl font-black tracking-tight">
                    {formatCurrency(total)}
                  </div>

                  <div className="mt-4 text-sm text-white/70">IVA incluido</div>
                </div>
              </div>
            </div>
          </div>

          {/* TERMS */}

          <div className="mt-20 border-l-2 border-zinc-200 pl-6">
            <h4 className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
              Términos y condiciones
            </h4>

            <ul className="space-y-2 text-[13px] leading-relaxed text-zinc-500">
              <li>• Validez del presupuesto: 15 días corridos.</li>

              <li>• Plazo estimado de entrega: 20 a 30 días hábiles.</li>

              <li>• Los precios pueden variar según disponibilidad.</li>
            </ul>
          </div>

          {/* FOOTER */}

          <div className="mt-20 flex items-end justify-between border-t border-zinc-100 pt-8">
            <div>
              <p className="text-sm text-zinc-400">Gracias por confiar en</p>

              <p className="mt-1 text-xl font-bold tracking-tight text-zinc-900">
                {empresa.nombre}
              </p>
            </div>

            <div className="text-right text-sm text-zinc-500">
              <p>{empresa.telefono}</p>

              <p>{empresa.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
