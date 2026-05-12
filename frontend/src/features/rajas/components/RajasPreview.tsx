import type { RajasConfig } from "../types";

import { Marco } from "@/features/ventanas/svg/Marco";
import { Premarco } from "@/features/ventanas/svg/Premarco";
import { Contramarco } from "@/features/ventanas/svg/Contramarco";
import { Cotas } from "@/features/ventanas/svg/Cotas";

import { RajaAbrir } from "../svg/RajaAbrir";
import { RajaBrazo } from "../svg/RajaBrazo";
import { RajaVolcable } from "../svg/RajaVolcable";
import { RajaOscilo } from "../svg/RajaOscilo";

import { Vidrios } from "@/features/ventanas/svg/Vidrios";

type Props = {
  config: RajasConfig;
};

export function RajasPreview({ config }: Props) {
  const maxSize = 280;

  const mayorMedida = Math.max(config.ancho, config.alto);

  const escala = maxSize / mayorMedida;

  const ancho = config.ancho * escala;

  const alto = config.alto * escala;

  const left = 250 - ancho / 2;

  const top = 250 - alto / 2;

  const esHerrero = config.linea === "Herrero";

  const frameWidth = esHerrero
    ? Math.max(10, ancho * 0.04)
    : Math.max(5, ancho * 0.02);

  const colorMap = {
    blanco: "#E4E4E7",

    negro: "#18181B",

    "bronce colonial": "#2e411f",

    "simil madera": "#7C2D12",
  };

  const aluminioColor = colorMap[config.color];

  return (
    <div
      className="
        rounded-2xl
        border border-border

        bg-card

        p-6
      "
    >
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Raja</h3>

        <span className="text-sm text-muted-foreground">
          {config.ancho} × {config.alto}
        </span>
      </div>

      {/* SVG */}

      <div
        className="
          relative overflow-hidden

          mt-6

          flex h-[500px]

          items-center
          justify-center

          rounded-2xl

          border border-white/5

          bg-gradient-to-b
          from-zinc-950
          via-zinc-900
          to-black

          p-6
        "
      >
        {/* GLOW */}

        <div
          className="
            absolute

            h-[400px]
            w-[400px]

            rounded-full

            bg-white/[0.015]

            blur-3xl
          "
        />

        <svg
          width="500"
          height="500"
          viewBox="0 0 500 500"
          fill="none"
          className="
            drop-shadow-[0_0_18px_rgba(0,0,0,0.35)]
          "
        >
          <defs>
            <linearGradient id="glassGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />

              <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
            </linearGradient>

            <linearGradient
              id="aluminumGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />

              <stop offset="20%" stopColor="rgba(255,255,255,0.10)" />

              <stop offset="50%" stopColor="rgba(0,0,0,0.10)" />

              <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
            </linearGradient>
          </defs>

          {/* PREMARCO */}

          {config.premarco && (
            <Premarco left={left} top={top} ancho={ancho} alto={alto} />
          )}

          {/* CONTRAMARCO */}

          {config.contramarco && (
            <Contramarco
              left={left}
              top={top}
              ancho={ancho}
              alto={alto}
              color={aluminioColor}
            />
          )}

          {/* MARCO */}

          <Marco
            left={left}
            top={top}
            ancho={ancho}
            alto={alto}
            color={aluminioColor}
            frameWidth={frameWidth}
          />

          {/* HOJA ABIERTA */}
          {/* MODELOS */}

          {config.modelo === "raja" && (
            <RajaAbrir
              left={left}
              top={top}
              ancho={ancho}
              alto={alto}
              color={aluminioColor}
              esHerrero={esHerrero}
              tipoVidrio={config.tipoVidrio}
            />
          )}

          {config.modelo === "brazo" && (
            <RajaBrazo
              left={left}
              top={top}
              ancho={ancho}
              alto={alto}
              color={aluminioColor}
              esHerrero={esHerrero}
              tipoVidrio={config.tipoVidrio}
            />
          )}

          {config.modelo === "volcable" && (
            <RajaVolcable
              left={left}
              top={top}
              ancho={ancho}
              alto={alto}
              color={aluminioColor}
              esHerrero={esHerrero}
              tipoVidrio={config.tipoVidrio}
            />
          )}

          {config.modelo === "oscilobatiente" && (
            <RajaOscilo
              left={left}
              top={top}
              ancho={ancho}
              alto={alto}
              color={aluminioColor}
              esHerrero={esHerrero}
              tipoVidrio={config.tipoVidrio}
            />
          )}

          {/* BRAZOS */}

          <line
            x1={left + 30}
            y1={top + alto - 30}
            x2={left + 70}
            y2={top + alto - 60}
            stroke="rgba(220,220,220,0.35)"
            strokeWidth={3}
            strokeLinecap="round"
          />

          <line
            x1={left + ancho - 30}
            y1={top + alto - 30}
            x2={left + ancho - 70}
            y2={top + alto - 60}
            stroke="rgba(220,220,220,0.35)"
            strokeWidth={3}
            strokeLinecap="round"
          />

          {/* MOSQUITERO */}

          {config.mosquitero && (
            <rect
              x={left + 10}
              y={top + 10}
              width={ancho - 20}
              height={alto - 20}
              fill="url(#mosquiteroPattern)"
              opacity={0.25}
            />
          )}

          {/* COTAS */}

          <Cotas
            left={left}
            top={top}
            ancho={ancho}
            alto={alto}
            anchoReal={config.ancho}
            altoReal={config.alto}
          />
        </svg>
      </div>

      {/* INFO */}

      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
        <div className="flex justify-between">
          <span>Línea</span>

          <span>{config.linea}</span>
        </div>

        <div className="flex justify-between">
          <span>Vidrio</span>

          <span>{config.tipoVidrio || "4mm"}</span>
        </div>

        <div className="flex justify-between">
          <span>Modelo</span>

          <span>{config.modelo}</span>
        </div>
      </div>
    </div>
  );
}
