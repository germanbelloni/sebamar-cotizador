import type { PanoFijoConfig } from "../types";

import { calculateCenter } from "@/shared/svg/utils/calculateCenter";

import { calculateScale } from "@/shared/svg/utils/calculateScale";

import { SVG_COLORS } from "@/shared/svg/constants/colors";

import { Premarco } from "@/features/ventanas/svg/Premarco";
import { Contramarco } from "@/features/ventanas/svg/Contramarco";

type Props = {
  config: PanoFijoConfig;
};

export function PanoFijoPreview({ config }: Props) {
  const escala = calculateScale(config.ancho, config.alto, 320);

  const ancho = config.ancho * escala;

  const alto = config.alto * escala;

  const { left, top } = calculateCenter(ancho, alto, 500);

  const esHerrero = config.linea?.toLowerCase() === "herrero";

  // MÁS GRUESO EN HERRERO
  const frameWidth = esHerrero ? 14 : 22;

  const aluminioColor =
    SVG_COLORS[config.color as keyof typeof SVG_COLORS] || SVG_COLORS.blanco;

  // TODOS LOS LADOS IGUALES
  const marcoColor = config.color === "blanco" ? "#DCDCDC" : aluminioColor;

  // AHORA:
  // 👉 TODOS usan el vidrio estilo esmerilado suave
  // 👉 ESMERILADO usa el azul clásico
  const vidrioFill =
    config.tipoVidrio === "esmerilado" ? "url(#glassBlue)" : "url(#glassSoft)";

  const esDVH = ["dvh", "dvh_4_9_4", "DVH 4+9+4", "DVH 5+9+5"].includes(
    config.tipoVidrio,
  );

  const glassLeft = left + frameWidth;

  const glassTop = top + frameWidth;

  const glassWidth = ancho - frameWidth * 2;

  const glassHeight = alto - frameWidth * 2;

  const verticalBarWidth = esHerrero ? 10 : 14;

  const verticalBarX = glassLeft + glassWidth / 2 - verticalBarWidth / 2;

  const horizontalBarHeight = esHerrero ? 10 : 14;

  // posición proporcional al alto real: 200 cm desde arriba
  const horizontalRatio = Math.min(200 / config.alto, 1);

  const horizontalBarY =
    glassTop + glassHeight * horizontalRatio - horizontalBarHeight / 2;

  return (
    <div className="h-full">
      <div className="flex justify-end">
        <div className="font-mono text-sm text-white/55">
          {config.ancho} × {config.alto}
        </div>
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
        "
      >
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none">
          <defs>
            {/* ====================================== */}
            {/* VIDRIO AZUL */}
            {/* ====================================== */}

            <linearGradient id="glassBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7ec2e2" stopOpacity="0.25" />

              <stop offset="40%" stopColor="#a3d5ed" stopOpacity="0.18" />

              <stop offset="100%" stopColor="#5fa1bf" stopOpacity="0.30" />
            </linearGradient>

            {/* ====================================== */}
            {/* VIDRIO SUAVE / ESMERILADO */}
            {/* ====================================== */}

            <linearGradient id="glassSoft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.20" />

              <stop offset="100%" stopColor="#dfe6ee" stopOpacity="0.10" />
            </linearGradient>

            {/* ====================================== */}
            {/* REFLEJO */}
            {/* ====================================== */}

            <linearGradient
              id="glassReflection"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />

              <stop offset="30%" stopColor="#ffffff" stopOpacity="0" />

              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* ====================================== */}
            {/* SOMBRA */}
            {/* ====================================== */}

            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodColor="#000000"
                floodOpacity="0.5"
              />
            </filter>
          </defs>

          {/* ====================================== */}
          {/* VIDRIO */}
          {/* ====================================== */}

          <rect
            x={glassLeft}
            y={glassTop}
            width={glassWidth}
            height={glassHeight}
            fill={
              config.tipoVidrio === "fantasia"
                ? "rgba(240,245,255,0.20)"
                : vidrioFill
            }
          />

          {config.travesanoVertical && (
            <rect
              x={verticalBarX}
              y={glassTop}
              width={verticalBarWidth}
              height={glassHeight}
              fill={marcoColor}
            />
          )}

          {config.travesanoHorizontal && (
            <rect
              x={glassLeft}
              y={horizontalBarY}
              width={glassWidth}
              height={horizontalBarHeight}
              fill={marcoColor}
            />
          )}

          {/* DVH */}

          {esDVH && (
            <rect
              x={glassLeft + 2}
              y={glassTop + 2}
              width={glassWidth - 4}
              height={glassHeight - 4}
              stroke="rgba(0,0,0,0.65)"
              strokeWidth="3"
              fill="none"
              opacity={0.8}
            />
          )}

          {/* ====================================== */}
          {/* MARCO */}
          {/* ====================================== */}

          <g filter="url(#shadow)">
            {esHerrero ? (
              <>
                {/* SUPERIOR */}

                <rect
                  x={left}
                  y={top}
                  width={ancho}
                  height={frameWidth}
                  fill={marcoColor}
                />

                {/* INFERIOR */}

                <rect
                  x={left}
                  y={top + alto - frameWidth}
                  width={ancho}
                  height={frameWidth}
                  fill={marcoColor}
                />

                {/* IZQUIERDA */}

                <rect
                  x={left}
                  y={top + frameWidth}
                  width={frameWidth}
                  height={alto - frameWidth * 2}
                  fill={marcoColor}
                />

                {/* DERECHA */}

                <rect
                  x={left + ancho - frameWidth}
                  y={top + frameWidth}
                  width={frameWidth}
                  height={alto - frameWidth * 2}
                  fill={marcoColor}
                />

                {/* UNIONES */}

                <line
                  x1={left}
                  y1={top + frameWidth}
                  x2={left + frameWidth}
                  y2={top + frameWidth}
                  stroke="rgba(0,0,0,0.12)"
                />

                <line
                  x1={left + ancho - frameWidth}
                  y1={top + frameWidth}
                  x2={left + ancho}
                  y2={top + frameWidth}
                  stroke="rgba(0,0,0,0.12)"
                />

                <line
                  x1={left}
                  y1={top + alto - frameWidth}
                  x2={left + frameWidth}
                  y2={top + alto - frameWidth}
                  stroke="rgba(0,0,0,0.12)"
                />

                <line
                  x1={left + ancho - frameWidth}
                  y1={top + alto - frameWidth}
                  x2={left + ancho}
                  y2={top + alto - frameWidth}
                  stroke="rgba(0,0,0,0.12)"
                />
              </>
            ) : (
              <>
                {/* MODENA */}

                <rect
                  x={left}
                  y={top}
                  width={ancho}
                  height={alto}
                  fill="none"
                  stroke={marcoColor}
                  strokeWidth={frameWidth * 2}
                  rx={2}
                />

                {/* INGLETES */}

                <line
                  x1={left}
                  y1={top}
                  x2={glassLeft}
                  y2={glassTop}
                  stroke="rgba(0,0,0,0.25)"
                  strokeWidth="1.5"
                />

                <line
                  x1={left + ancho}
                  y1={top}
                  x2={left + ancho - frameWidth}
                  y2={glassTop}
                  stroke="rgba(0,0,0,0.25)"
                  strokeWidth="1.5"
                />

                <line
                  x1={left}
                  y1={top + alto}
                  x2={glassLeft}
                  y2={top + alto - frameWidth}
                  stroke="rgba(0,0,0,0.35)"
                  strokeWidth="1.5"
                />

                <line
                  x1={left + ancho}
                  y1={top + alto}
                  x2={left + ancho - frameWidth}
                  y2={top + alto - frameWidth}
                  stroke="rgba(0,0,0,0.35)"
                  strokeWidth="1.5"
                />

                {/* RELIEVE */}

                <rect
                  x={left + 3}
                  y={top + 3}
                  width={ancho - 6}
                  height={alto - 6}
                  fill="none"
                  stroke="rgba(0,0,0,0.08)"
                  strokeWidth="2"
                  rx={1}
                />

                <rect
                  x={glassLeft - 3}
                  y={glassTop - 3}
                  width={glassWidth + 6}
                  height={glassHeight + 6}
                  fill="none"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1"
                />
              </>
            )}
          </g>

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
              color={config.color}
            />
          )}

          {/* ====================================== */}
          {/* REFLEJOS */}
          {/* ====================================== */}

          <g style={{ pointerEvents: "none" }}>
            <polygon
              points={`
                ${glassLeft + 15},${glassTop}
                ${Math.min(glassLeft + 75, glassLeft + glassWidth)},${glassTop}
                ${glassLeft},${Math.min(glassTop + 75, glassTop + glassHeight)}
                ${glassLeft},${glassTop + 15}
              `}
              fill="url(#glassReflection)"
              opacity={0.6}
            />

            <polygon
              points={`
                ${glassLeft + 95},${glassTop}
                ${Math.min(glassLeft + 120, glassLeft + glassWidth)},${glassTop}
                ${glassLeft},${Math.min(glassTop + 120, glassTop + glassHeight)}
                ${glassLeft},${glassTop + 95}
              `}
              fill="url(#glassReflection)"
              opacity={0.3}
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
