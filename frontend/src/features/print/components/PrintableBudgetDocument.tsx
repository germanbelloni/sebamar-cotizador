import { User } from "lucide-react";

import type { Cliente } from "@/features/clientes/types";
import type { Empresa } from "@/features/empresa/types";

import type { BudgetItem } from "@/shared/budget/types/budget.types";

import { formatCurrency } from "@/features/ventanas/utils/formatCurrency";

type Props = {
  numero: number;
  fecha: string;

  empresa: Empresa;
  cliente: Cliente;
  items: BudgetItem[];
};

export function PrintableBudgetDocument({
  numero,
  fecha,
  empresa,
  cliente,
  items,
}: Props) {
  const total = items.reduce((acc, item) => acc + item.subtotal, 0);

  const formattedDate = fecha
    ? new Date(fecha).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  const presupuestoId = numero || "-";

  const primaryColor = empresa.primaryColor || "#111827";

  return (
    <div
      className="
        relative
        mx-auto
        w-[850px]
        overflow-hidden
        rounded-[32px]
        bg-white

        print:w-full
        print:rounded-none
        print:shadow-none
      "
    >
      {/* TOP BAR */}

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

          opacity-10
          blur-3xl
        "
        style={{
          backgroundColor: primaryColor,
        }}
      />

      <div className="p-8 print:p-6">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          {/* EMPRESA */}

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

          {/* INFO */}

          <div className="relative text-right">
            <h2
              className="
    absolute
    right-0
    top-0

    select-none

    text-6xl
    font-black
    tracking-tighter

    opacity-[0.04]

    print:hidden
  "
            >
              PRESUPUESTO
            </h2>

            <div
              className="
                inline-flex
                rounded-2xl

                px-6
                py-3

                text-sm
                font-bold
                uppercase
                tracking-[0.30em]

                text-white

                shadow-xl
              "
              style={{
                background: `linear-gradient(to right, ${primaryColor}, ${empresa.secondaryColor})`,
              }}
            >
              Presupuesto
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">
                  Número
                </span>

                <span className="text-2xl font-black tracking-tight">
                  #{presupuestoId}
                </span>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">
                  Fecha de emisión
                </span>

                <span className="text-sm font-medium text-zinc-700">
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* CLIENTE */}
        <div className="mt-8 grid grid-cols-2 gap-12 border-t border-zinc-100 pt-12">
          <div>
            <div className="mb-4 flex items-center gap-2 text-zinc-400">
              <User size={14} />

              <span className="text-xs font-bold uppercase tracking-[0.25em]">
                Información del Cliente
              </span>
            </div>

            <h3 className="text-xl font-bold tracking-tight text-zinc-900">
              {cliente.nombre || "Consumidor Final"}
            </h3>

            <p className="mt-2 text-zinc-500">
              {cliente.telefono || "Sin teléfono registrado"}
            </p>
          </div>
        </div>
        {/* TABLA */}
        <div className="mt-14 overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm print:mt-6">
          {/* HEADER */}

          <div
            className="
              grid
              grid-cols-[90px_1fr_180px_180px]

              px-8
              py-3

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

          {/* ITEMS */}

          <div className="divide-y divide-zinc-100">
            {items.map((item) => (
              <div
                key={item.id}
                className="
                  grid
                  grid-cols-[90px_1fr_180px_180px]

                  px-8
                  py-2

                  transition-colors

                  hover:bg-zinc-50/60

                  print:py-1
                "
              >
                <div className="font-mono font-semibold text-zinc-900">
                  {item.cantidad}
                </div>

                <div>
                  <div className="font-semibold leading-relaxed text-zinc-800">
                    {item.descripcion.toUpperCase()}
                  </div>

                  <div className="mt-1 text-[10px] text-zinc-400">
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
        </div>{" "}
        {/* TOTAL */}
        <div className="mt-14 flex justify-end print:mt-6">
          <div className="w-full max-w-[420px]">
            <div
              className="
                relative
                overflow-hidden

                rounded-[32px]

                p-5

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
                <div className="text-xs font-bold uppercase tracking-[0.30em] text-white/60">
                  Total Final
                </div>

                <div className="mt-4 text-3xl font-black tracking-tight">
                  {formatCurrency(total)}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* TÉRMINOS */}
        <div
          className="
            mt-8

            rounded-xl

            border
            border-zinc-200

            px-5
            py-2

            text-xs

            print:py-1
          "
        >
          <h4 className="mb-3 text-[10px] font-bold uppercase tracking-[0.30em] text-zinc-400">
            Términos y condiciones
          </h4>

          <ul className="space-y-1 text-[13px] leading-relaxed text-zinc-500">
            <li>• Validez del presupuesto: 7 días.</li>

            <li>• Plazo de entrega: 10/15 días hábiles.</li>

            <li>
              • Consultar envío / Los precios pueden variar sin previo aviso.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
