import type { PostigonesConfig } from "../types";

import { DimensionLines } from "@/shared/svg/components/DimensionLines";
import { MetalGradient } from "@/shared/svg/components/MetalGradient";
import { MicroperforadoPattern } from "@/shared/svg/components/MicroperforadoPattern";
import { ShadowOverlay } from "@/shared/svg/components/ShadowOverlay";
import { SVG_COLORS } from "@/shared/svg/constants/colors";
import { calculateScale } from "@/shared/svg/utils/calculateScale";
import { calculateCenter } from "@/shared/svg/utils/calculateCenter";

type Props = {
  config: PostigonesConfig;
};

export function PostigonPreview({ config }: Props) {
  const escala = calculateScale(config.ancho, config.alto, 250);

  const anchoView = config.ancho * escala;

  const altoView = config.alto * escala;

  const { left, top } = calculateCenter(anchoView, altoView, 500);

  const baseColor =
    SVG_COLORS[config.color as keyof typeof SVG_COLORS] || SVG_COLORS.blanco;

  const cantidadHojas = config.tipo === "corredizo" ? 2 : config.cantidadHojas;

  const hojaFrameThickness = 8;

  const numLamas = Math.floor(altoView / 12);

  const lamas = Array.from({
    length: numLamas,
  });

  // CORREDIZO

  const overlap = config.tipo === "corredizo" ? anchoView * 0.08 : 0;

  const leafWidth =
    config.tipo === "corredizo" ? anchoView / 2 : anchoView / cantidadHojas;

  const herrajeColor = config.herrajeBlanco ? "#E4E4E7" : "#27272A";

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
        <h3 className="text-lg font-semibold">Postigón</h3>

        <span className="text-sm text-muted-foreground">
          {config.ancho} × {config.alto}
        </span>
      </div>

      <div
        className="
          relative
          mt-6
          flex
          h-[420px]
          items-center
          justify-center
          overflow-hidden
          rounded-2xl
          border border-white/5
          bg-gradient-to-b
          from-zinc-950
          via-zinc-900
          to-black
          p-6
        "
      >
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

            <MicroperforadoPattern />

            <linearGradient
              id="shadowGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />

              <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
            </linearGradient>
          </defs>

          {/* FONDO */}

          <rect x="0" y="0" width="500" height="500" fill="#050505" rx="24" />

          {/* MARCO */}

          <rect
            x={left - 4}
            y={top - 4}
            width={anchoView + 8}
            height={altoView + 8}
            rx="4"
            fill={baseColor}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />

          {/* SOMBRA */}

          <ShadowOverlay
            left={left}
            top={top}
            anchoView={anchoView}
            altoView={altoView}
          />

          {/* COTAS */}

          <DimensionLines
            left={left}
            top={top}
            anchoView={anchoView}
            altoView={altoView}
            ancho={config.ancho}
            alto={config.alto}
          />

          {/* HOJAS */}

          {Array.from({
            length: cantidadHojas,
          }).map((_, i) => {
            let xPos = left + i * leafWidth;

            // CORREDIZO

            if (config.tipo === "corredizo") {
              xPos = i === 0 ? left : left + leafWidth - overlap;
            }

            // CIERRE

            const esHojaCierre = (() => {
              if (cantidadHojas === 2) {
                return config.hojaCierre === "izquierda" ? i === 0 : i === 1;
              }

              if (cantidadHojas === 3) {
                return config.hojaCierre === "centro-izquierda"
                  ? i === 1
                  : i === 2;
              }

              if (cantidadHojas === 4) {
                return config.hojaCierre === "centro-izquierda"
                  ? i === 1
                  : i === 2;
              }

              return false;
            })();

            return (
              <g key={i}>
                {/* PERFIL */}

                <rect
                  x={xPos}
                  y={top}
                  width={leafWidth}
                  height={altoView}
                  fill={baseColor}
                  stroke="rgba(0,0,0,0.25)"
                  strokeWidth="0.8"
                />

                {/* INTERIOR */}

                <rect
                  x={xPos + hojaFrameThickness}
                  y={top + hojaFrameThickness}
                  width={leafWidth - hojaFrameThickness * 2}
                  height={altoView - hojaFrameThickness * 2}
                  fill="rgba(0,0,0,0.10)"
                />

                {/* LAMAS */}

                {lamas.map((_, lIndex) => {
                  const lamaHeight = altoView / numLamas;

                  const yLama = top + hojaFrameThickness + lIndex * lamaHeight;

                  return (
                    <g key={lIndex}>
                      <rect
                        x={xPos + hojaFrameThickness}
                        y={yLama}
                        width={leafWidth - hojaFrameThickness * 2}
                        height={lamaHeight * 0.8}
                        fill={baseColor}
                      />

                      <rect
                        x={xPos + hojaFrameThickness}
                        y={yLama + lamaHeight * 0.65}
                        width={leafWidth - hojaFrameThickness * 2}
                        height="1.2"
                        fill="rgba(0,0,0,0.22)"
                      />

                      {config.microperforado && (
                        <rect
                          x={xPos + hojaFrameThickness}
                          y={yLama}
                          width={leafWidth - hojaFrameThickness * 2}
                          height={lamaHeight * 0.8}
                          fill="url(#microperforado)"
                        />
                      )}
                    </g>
                  );
                })}

                {/* BRILLO */}

                <rect
                  x={xPos}
                  y={top}
                  width={leafWidth}
                  height={altoView}
                  fill="url(#metalGradient)"
                />

                {/* BISAGRAS */}

                {config.tipo === "abrir" &&
                  (i === 0 || i === cantidadHojas - 1) && (
                    <g>
                      {[0.15, 0.5, 0.85].map((pos, bIdx) => (
                        <rect
                          key={bIdx}
                          x={i === 0 ? xPos - 2 : xPos + leafWidth - 4}
                          y={top + altoView * pos}
                          width="6"
                          height="16"
                          rx="1"
                          fill={herrajeColor}
                        />
                      ))}
                    </g>
                  )}

                {/* CIERRE */}

                {esHojaCierre && (
                  <g
                    transform={`translate(${xPos + 8}, ${
                      top + altoView / 2 - 22
                    })`}
                  >
                    <rect width="10" height="44" rx="2" fill={herrajeColor} />

                    <rect
                      x="6"
                      y="12"
                      width="14"
                      height="4"
                      rx="1"
                      fill={herrajeColor}
                    />
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        {cantidadHojas} hojas · {config.color}
      </div>
    </div>
  );
}
