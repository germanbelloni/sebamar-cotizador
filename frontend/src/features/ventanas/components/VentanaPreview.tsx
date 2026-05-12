import type { VentanaConfig } from "../types";

import { Guide } from "../svg/Guide";
import { CortinaPVC } from "../svg/CortinaPVC";
import { CortinaAluminio } from "../svg/CortinaAluminio";
import { CajonBlock } from "../svg/CajonBlock";
import { Marco } from "../svg/Marco";
import { Premarco } from "../svg/Premarco";
import { Contramarco } from "../svg/Contramarco";
import { Vidrios } from "../svg/Vidrios";
import { Hojas } from "../svg/Hojas";
import { Mosquitero } from "../svg/Mosquitero";
import { Cierres } from "../svg/Cierres";
import { Cotas } from "../svg/Cotas";
import { RielInferior } from "../svg/RielInferior";
import { RielSuperior } from "../svg/RielSuperior";

type Props = {
  config: VentanaConfig;
};

export function VentanaPreview({ config }: Props) {
  const maxSize = 300;

  const mayorMedida = Math.max(config.ancho, config.alto);

  const escala = maxSize / mayorMedida;

  const ancho = config.ancho * escala;

  const alto = config.alto * escala;

  const left = 250 - ancho / 2;

  const top = 250 - alto / 2;

  const centerX = 250;

  const esHerrero = config.linea === "Herrero";

  const frameWidth = esHerrero
    ? Math.max(9, ancho * 0.032)
    : Math.max(4, ancho * 0.015);

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
        transition-all duration-300
      "
    >
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Ventana</h3>

        <span className="text-sm text-muted-foreground">
          {config.ancho} × {config.alto}
        </span>
      </div>

      {/* SVG */}

      <div
        className="
          relative overflow-hidden

          mt-6
          flex h-[420px]

          items-center
          justify-center

          rounded-2xl

          border border-white/5

          bg-gradient-to-b
          from-zinc-950
          via-zinc-900
          to-black

          p-6

          transition-all duration-300
        "
      >
        {/* GLOW */}

        <div
          className="
            absolute

            h-[420px]
            w-[420px]

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
            <pattern
              id="mosquiteroPattern"
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 0 0 L 6 6 M 6 0 L 0 6"
                stroke="#D4D4D8"
                strokeWidth="0.5"
              />
            </pattern>
            <pattern
              id="fantasiaPattern"
              width="12"
              height="12"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 0 12 L 12 0"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />

              <path
                d="M -3 9 L 3 15"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />

              <path
                d="M 9 -3 L 15 3"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            </pattern>
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

          {/* GUIA */}

          {config.guia && (
            <Guide
              left={left}
              top={top}
              ancho={ancho}
              alto={alto}
              tieneCortina={config.cortinaPVC || config.cortinaAluminio}
            />
          )}

          {/* CORTINA PVC */}

          {config.cortinaPVC && (
            <CortinaPVC left={left} top={top} ancho={ancho} />
          )}

          {/* CORTINA ALUMINIO */}

          {config.cortinaAluminio && (
            <CortinaAluminio
              left={left}
              top={top}
              ancho={ancho}
              color={aluminioColor}
            />
          )}

          {/* CAJON BLOCK */}

          {config.cajonBlock && (
            <CajonBlock left={left} top={top} ancho={ancho} />
          )}

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

          <RielSuperior
            left={left}
            top={top}
            ancho={ancho}
            color={aluminioColor}
            esHerrero={esHerrero}
          />

          <RielInferior
            left={left}
            top={top}
            ancho={ancho}
            alto={alto}
            color={aluminioColor}
          />

          {/* DIVISION */}

          <rect
            x={centerX - (esHerrero ? 4 : 2)}
            y={top}
            width={esHerrero ? 8 : 4}
            height={alto}
            fill={aluminioColor}
            stroke="url(#aluminumGradient)"
          />

          {/* SOMBRA */}

          <rect
            x={centerX + 1}
            y={top}
            width={1}
            height={alto}
            fill="rgba(0,0,0,0.25)"
          />

          {/* BRILLO */}

          <rect
            x={centerX - 2}
            y={top}
            width={1}
            height={alto}
            fill="rgba(255,255,255,0.12)"
          />

          {/* VIDRIOS */}

          <Vidrios
            left={left}
            top={top}
            ancho={ancho}
            alto={alto}
            tipoVidrio={config.tipoVidrio}
          />

          {/* MOSQUITERO */}

          {config.mosquitero && (
            <Mosquitero left={left} top={top} ancho={ancho} alto={alto} />
          )}

          {/* HOJAS */}

          <Hojas
            left={left}
            top={top}
            ancho={ancho}
            alto={alto}
            strokeWidth={frameWidth / 2}
            esHerrero={esHerrero}
          />

          {/* CIERRES */}

          <Cierres
            centerX={centerX}
            centerY={top + alto / 2}
            ancho={ancho}
            esHerrero={esHerrero}
          />

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

      {/* TECHNICAL INFO */}

      <div className="mt-4 space-y-3 text-sm text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Línea: {config.linea}</span>

          <span>Color: {config.color}</span>
        </div>

        <div
          className="
            rounded-xl
            border border-border
            bg-background

            px-4 py-3

            text-center
          "
        >
          <div className="text-base font-medium text-foreground">
            {config.ancho} × {config.alto} cm
          </div>
        </div>

        <div className="mt-2 text-xs text-muted-foreground">
          Ventana {config.ancho}x{config.alto}
          {" · "}
          {config.linea}
          {" · "}
          {config.color}
          {config.tipoVidrio && ` · ${config.tipoVidrio}`}
          {config.guia && " · guía"}
          {config.mosquitero && " · mosquitero"}
          {config.cajonBlock && " · cajón block"}
          {config.cortinaPVC && " · PVC"}
          {config.cortinaAluminio && " · cortina aluminio"}
          {config.premarco && " · premarco"}
          {config.contramarco && " · contramarco"}
        </div>
      </div>
    </div>
  );
}
