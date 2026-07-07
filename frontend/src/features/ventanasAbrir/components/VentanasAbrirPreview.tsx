// =========================
// VENTANAS ABRIR PREVIEW
// =========================

import type { VentanasAbrirConfig } from "../types";
import { VentanaAbrir } from "../svg/VentanaAbrir";
import { Premarco } from "@/features/ventanas/svg/Premarco";
import { Contramarco } from "@/features/ventanas/svg/Contramarco";
import { Marco } from "@/features/ventanas/svg/Marco";
import { Cotas } from "@/features/ventanas/svg/Cotas";
import { MetalGradient } from "@/shared/svg/components/MetalGradient";
import { SVG_COLORS } from "@/shared/svg/constants/colors";
import { calculateScale } from "@/shared/svg/utils/calculateScale";
import { calculateCenter } from "@/shared/svg/utils/calculateCenter";

type Props = {
  config: VentanasAbrirConfig;
};

export function VentanasAbrirPreview({ config }: Props) {
  const escala = calculateScale(config.ancho, config.alto, 240);

  const ancho = config.ancho * escala;

  const alto = config.alto * escala;

  const { left, top } = calculateCenter(ancho, alto, 500);

  const esHerrero = config.linea === "Herrero";

  const frameWidth = esHerrero
    ? Math.max(10, ancho * 0.04)
    : Math.max(5, ancho * 0.02);

  const aluminioColor =
    SVG_COLORS[config.color as keyof typeof SVG_COLORS] || SVG_COLORS.blanco;

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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Ventana de Abrir</h3>

        <span className="text-sm text-muted-foreground">
          {config.ancho} × {config.alto}
        </span>
      </div>

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
            <MetalGradient />

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
          </defs>

          {config.premarco && (
            <Premarco left={left} top={top} ancho={ancho} alto={alto} />
          )}

          {config.contramarco && (
            <Contramarco
              left={left}
              top={top}
              ancho={ancho}
              alto={alto}
              color={aluminioColor}
            />
          )}

          <Marco
            left={left}
            top={top}
            ancho={ancho}
            alto={alto}
            color={aluminioColor}
            frameWidth={frameWidth}
          />

          <VentanaAbrir
            left={left}
            top={top}
            ancho={ancho}
            alto={alto}
            color={aluminioColor}
            esHerrero={esHerrero}
            tipoVidrio={config.tipoVidrio}
            bisagra={config.bisagra}
          />

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
          Ventana de Abrir {config.ancho}x{config.alto}
          {" · "}
          {config.linea}
          {" · "}
          {config.color}
          {config.tipoVidrio && ` · ${config.tipoVidrio}`}
          {config.bisagra && ` · bisagra ${config.bisagra}`}
          {config.mosquitero && " · mosquitero"}
          {config.premarco && " · premarco"}
          {config.contramarco && " · contramarco"}
        </div>
      </div>
    </div>
  );
}
