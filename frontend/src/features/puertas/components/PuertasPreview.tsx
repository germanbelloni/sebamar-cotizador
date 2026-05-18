import type { PuertasConfig } from "../types";

import { MODELOS_PUERTAS_CONFIG } from "../models/modelos";

import { DoorRenderer } from "../svg/components/DoorRenderer";

import { calculateScale } from "@/shared/svg/utils/calculateScale";

import { calculateCenter } from "@/shared/svg/utils/calculateCenter";

import { SVG_COLORS } from "@/shared/svg/constants/colors";

import { MetalGradient } from "@/shared/svg/components/MetalGradient";

import { ShadowOverlay } from "@/shared/svg/components/ShadowOverlay";

import { DimensionLines } from "@/shared/svg/components/DimensionLines";

type Props = {
  config: PuertasConfig;
};

export function PuertasPreview({ config }: Props) {
  const scale = calculateScale(config.ancho, config.alto, 260);

  const width = config.ancho * scale;

  const height = config.alto * scale;

  const { left, top } = calculateCenter(width, height, 500);

  const color = SVG_COLORS[config.color] || SVG_COLORS.blanco;

  const model = MODELOS_PUERTAS_CONFIG[config.modelo];

  if (!model) {
    return null;
  }

  return (
    <div
      className="
        relative

        overflow-hidden

        rounded-[32px]

        border border-border

        bg-black/30

        backdrop-blur-2xl
      "
    >
      <svg viewBox="0 0 500 500" className="w-full">
        <defs>
          <MetalGradient />

          <linearGradient
            id="backgroundGlow"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />

            <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
          </linearGradient>

          <linearGradient
            id="shadowGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />

            <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
          </linearGradient>
        </defs>

        {/* FONDO */}

        <rect
          x="0"
          y="0"
          width="500"
          height="500"
          rx="30"
          fill="url(#backgroundGlow)"
        />

        {/* SOMBRA */}

        <ShadowOverlay
          left={left}
          top={top}
          anchoView={width}
          altoView={height}
        />

        {/* RENDER */}

        <DoorRenderer
          config={config}
          model={model}
          color={color}
          x={left}
          y={top}
          width={width}
          height={height}
        />

        {/* MEDIDAS */}

        <DimensionLines
          left={left}
          top={top}
          anchoView={width}
          altoView={height}
          ancho={config.ancho}
          alto={config.alto}
        />
      </svg>
    </div>
  );
}
