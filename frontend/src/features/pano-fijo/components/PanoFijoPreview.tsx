import type { PanoFijoConfig } from "../types";

import { calculateCenter } from "@/shared/svg/utils/calculateCenter";

import { calculateScale } from "@/shared/svg/utils/calculateScale";

import { SVG_COLORS } from "@/shared/svg/constants/colors";

type Props = {
  config: PanoFijoConfig;
};

export function PanoFijoPreview({ config }: Props) {
  const escala = calculateScale(config.ancho, config.alto, 320);

  const ancho = config.ancho * escala;

  const alto = config.alto * escala;

  const { left, top } = calculateCenter(ancho, alto, 500);

  const esHerrero = config.linea === "herrero";

  const frameWidth = esHerrero
    ? Math.max(12, ancho * 0.03)
    : Math.max(6, ancho * 0.015);

  const aluminioColor =
    SVG_COLORS[config.color as keyof typeof SVG_COLORS] || SVG_COLORS.blanco;

  const esDVH = config.tipoVidrio === "dvh_4_9_4";

  return (
    <div
      className="
        rounded-2xl
        border border-border

        bg-card

        p-6
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Paño fijo</h3>

          <p className="text-sm text-white/45">{config.linea}</p>
        </div>

        <div className="text-sm text-white/55">
          {config.ancho} × {config.alto}
        </div>
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
        "
      >
        <div
          className="
            absolute inset-0

            bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_60%)]
          "
        />

        <svg width="500" height="500" viewBox="0 0 500 500" fill="none">
          {/* MARCO */}

          <rect
            x={left}
            y={top}
            width={ancho}
            height={alto}
            fill={config.color === "blanco" ? "#D6D6D6" : aluminioColor}
            rx={4}
          />

          {/* DVH BACK */}

          {esDVH && (
            <rect
              x={left + frameWidth + 6}
              y={top + frameWidth + 6}
              width={ancho - frameWidth * 2 - 12}
              height={alto - frameWidth * 2 - 12}
              fill="rgba(255,255,255,0.08)"
              opacity={0.22}
            />
          )}

          {/* VIDRIO */}

          <rect
            x={left + frameWidth}
            y={top + frameWidth}
            width={ancho - frameWidth * 2}
            height={alto - frameWidth * 2}
            fill={
              config.tipoVidrio === "esmerilado"
                ? "rgba(255,255,255,0.20)"
                : config.tipoVidrio === "fantasia"
                  ? "rgba(255,255,255,0.14)"
                  : "rgba(120,190,255,0.18)"
            }
          />

          {/* REFLEJO PRINCIPAL */}

          <rect
            x={left + 18}
            y={top + 18}
            width={24}
            height={alto - 36}
            fill="rgba(255,255,255,0.10)"
            rx={999}
          />

          {/* REFLEJO SECUNDARIO */}

          <rect
            x={left + 58}
            y={top + 28}
            width={10}
            height={alto - 56}
            fill="rgba(255,255,255,0.05)"
            rx={999}
          />

          {/* BRILLO DIAGONAL */}

          <line
            x1={left + 30}
            y1={top + 20}
            x2={left + ancho - 25}
            y2={top + alto - 25}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={3}
          />
        </svg>
      </div>
    </div>
  );
}
