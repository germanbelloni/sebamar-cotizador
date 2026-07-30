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

  const hojaFrameThickness = config.marco === "fino" ? 5 : 8;

  const numLamas = Math.floor(altoView / 12);

  const lamas = Array.from({
    length: numLamas,
  });
  // CORREDIZO

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
    via-black
    to-black
    p-6
  "
      >
        {/* GLOW SUAVE */}

        <div
          className="
    pointer-events-none
    absolute
    inset-0
    bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_30%,transparent_65%)]
  "
        />

        <div
          className="
    pointer-events-none
    absolute
    left-0
    right-0
    top-1/2
    h-[120px]
    -translate-y-1/2
    bg-gradient-to-r
    from-transparent
    via-white/5
    to-transparent
    blur-3xl
  "
        />

        {/* SOMBRA LATERAL IZQ */}

        <div
          className="
      pointer-events-none
      absolute
      inset-y-0
      left-0
      w-[160px]
      bg-gradient-to-r
      from-black
      via-black/70
      to-transparent
    "
        />

        {/* SOMBRA LATERAL DER */}

        <div
          className="
      pointer-events-none
      absolute
      inset-y-0
      right-0
      w-[160px]
      bg-gradient-to-l
      from-black
      via-black/70
      to-transparent
    "
        />
        <svg
          width="500"
          height="500"
          viewBox="0 0 500 500"
          fill="none"
          className="
            drop-shadow-[0_18px_35px_rgba(0,0,0,0.45)]
          "
        >
          <defs>
            <MetalGradient />

            <MicroperforadoPattern />

            <radialGradient id="backgroundGlow" cx="50%" cy="35%" r="80%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />

              <stop offset="45%" stopColor="rgba(24,24,27,0.95)" />

              <stop offset="100%" stopColor="#050505" />
            </radialGradient>

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

          {/* MARCO */}

          <rect
            x={left - (config.marco === "fino" ? 2 : 4)}
            y={top - (config.marco === "fino" ? 2 : 4)}
            width={anchoView + (config.marco === "fino" ? 4 : 8)}
            height={altoView + (config.marco === "fino" ? 4 : 8)}
            rx="4"
            fill={baseColor}
            stroke="rgba(255,255,255,0.12)"
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
              xPos = i === 0 ? left : left + leafWidth;
            }

            // CIERRE

            const cierreConfig = (() => {
              // 2 HOJAS

              if (cantidadHojas === 2) {
                if (config.hojaCierre === "izquierda") {
                  return {
                    hojaIndex: 0,

                    lado: "derecha",

                    direccion: "izquierda",
                  };
                }

                return {
                  hojaIndex: 1,

                  lado: "izquierda",

                  direccion: "derecha",
                };
              }

              // 3 HOJAS

              if (cantidadHojas === 3) {
                if (config.hojaCierre === "hoja-izquierda") {
                  return {
                    hojaIndex: 0,
                    lado: "derecha",
                    direccion: "izquierda",
                  };
                }

                if (config.hojaCierre === "centro-izquierda") {
                  return {
                    hojaIndex: 1,
                    lado: "derecha",
                    direccion: "izquierda",
                  };
                }

                if (config.hojaCierre === "centro-derecha") {
                  return {
                    hojaIndex: 1,
                    lado: "izquierda",
                    direccion: "derecha",
                  };
                }

                if (config.hojaCierre === "hoja-derecha") {
                  return {
                    hojaIndex: 2,
                    lado: "izquierda",
                    direccion: "derecha",
                  };
                }
              }

              // 4 HOJAS

              if (cantidadHojas === 4) {
                if (config.hojaCierre === "centro-izquierda") {
                  return {
                    hojaIndex: 1,

                    lado: "derecha",

                    direccion: "izquierda",
                  };
                }

                return {
                  hojaIndex: 2,

                  lado: "izquierda",

                  direccion: "derecha",
                };
              }

              return null;
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

                {/* =========================
                    HERRAJE CORREDIZO
                ========================= */}

                {config.tipo === "corredizo" && (
                  <g
                    transform={`translate(${
                      i === 0 ? xPos + leafWidth - 12 : xPos + 8
                    }, ${top + altoView / 2 - 18})`}
                  >
                    {/* canal lateral */}

                    <rect width="4" height="36" rx="2" fill="rgba(0,0,0,0.5)" />

                    {/* brillo */}

                    <rect
                      x="1"
                      y="4"
                      width="1"
                      height="28"
                      rx="1"
                      fill="rgba(255,255,255,0.22)"
                    />
                  </g>
                )}

                {/* =========================
                    CIERRE ABRIR
                ========================= */}

                {config.tipo === "abrir" &&
                  cierreConfig &&
                  cierreConfig.hojaIndex === i && (
                    <g
                      transform={`translate(${
                        cierreConfig.lado === "izquierda"
                          ? xPos + 8
                          : xPos + leafWidth - 18
                      }, ${top + altoView / 2 - 22})`}
                    >
                      <rect width="10" height="44" rx="2" fill={herrajeColor} />

                      <rect
                        x={cierreConfig.direccion === "derecha" ? 6 : -10}
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
