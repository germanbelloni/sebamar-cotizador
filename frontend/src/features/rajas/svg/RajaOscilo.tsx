// RajaOscilo.tsx

import type { VidrioType } from "@/shared/types/vidrios";

import { isLeft } from "@/shared/utils/openings/getOpeningSide";

import type { RajaBisagra } from "../types";

type PosicionOscilo = "cerrada" | "abrir" | "oscilo";

type Props = {
  left: number;

  top: number;

  ancho: number;

  alto: number;

  color: string;

  esHerrero: boolean;

  posicion?: PosicionOscilo;

  bisagra?: RajaBisagra;

  tipoVidrio?: VidrioType;
};

export function RajaOscilo({
  left,
  top,
  ancho,
  alto,
  color,
  esHerrero,
  posicion = "cerrada",
  bisagra,
  tipoVidrio,
}: Props) {
  const frameWidth = esHerrero
    ? Math.max(10, ancho * 0.05)
    : Math.max(6, ancho * 0.028);

  const hojaPadding = esHerrero ? 16 : 14;

  const vidrioPadding = esHerrero ? 12 : 10;

  const ladoIzquierdo = isLeft(bisagra);

  const colorHerraje = "#18181B";

  const hojaLeft = left + hojaPadding;

  const hojaTop = top + hojaPadding;

  const hojaAncho = ancho - hojaPadding * 2;

  const hojaAlto = alto - hojaPadding * 2;

  const vidrioX = hojaLeft + vidrioPadding;

  const vidrioY = hojaTop + vidrioPadding;

  const vidrioAncho = hojaAncho - vidrioPadding * 2;

  const vidrioAlto = hojaAlto - vidrioPadding * 2;

  const rotationManija =
    posicion === "cerrada"
      ? 0
      : posicion === "abrir"
        ? ladoIzquierdo
          ? -90
          : 90
        : 180;

  const esDVH = tipoVidrio?.includes("DVH");

  const esLaminado = tipoVidrio === "3+3" || tipoVidrio === "4+4";

  const strokeVidrio = esDVH
    ? "rgba(220,220,220,0.30)"
    : esLaminado
      ? "rgba(255,255,255,0.18)"
      : "rgba(255,255,255,0.08)";

  return (
    <>
      {/* SOMBRA */}

      <rect
        x={hojaLeft + 2}
        y={hojaTop + 3}
        width={hojaAncho}
        height={hojaAlto}
        fill="none"
        stroke="rgba(0,0,0,0.20)"
        strokeWidth={frameWidth + 1}
        opacity={0.7}
      />

      {/* HOJA */}

      <rect
        x={hojaLeft}
        y={hojaTop}
        width={hojaAncho}
        height={hojaAlto}
        fill="rgba(255,255,255,0.025)"
        stroke={color}
        strokeWidth={frameWidth}
        strokeLinejoin="round"
        className="transition-all duration-300"
      />

      {/* GRADIENTE */}

      <rect
        x={hojaLeft}
        y={hojaTop}
        width={hojaAncho}
        height={hojaAlto}
        fill="none"
        stroke="url(#aluminumGradient)"
        strokeWidth={Math.max(1, frameWidth - 1)}
        strokeLinejoin="round"
        opacity={0.9}
      />

      {/* SOMBRA INTERNA */}

      <rect
        x={hojaLeft + frameWidth / 2}
        y={hojaTop + frameWidth / 2}
        width={Math.max(0, hojaAncho - frameWidth)}
        height={Math.max(0, hojaAlto - frameWidth)}
        fill="none"
        stroke="rgba(0,0,0,0.22)"
        strokeWidth={2}
      />

      {/* VIDRIO */}

      <rect
        x={vidrioX + 2}
        y={vidrioY + 3}
        width={Math.max(0, vidrioAncho)}
        height={Math.max(0, vidrioAlto)}
        rx={2}
        fill="rgba(0,0,0,0.16)"
      />

      <rect
        x={vidrioX}
        y={vidrioY}
        width={Math.max(0, vidrioAncho)}
        height={Math.max(0, vidrioAlto)}
        rx={2}
        fill="url(#glassGradient)"
        stroke={strokeVidrio}
        strokeWidth={esDVH ? 2 : 1}
      />

      {/* DVH */}

      {esDVH && (
        <rect
          x={vidrioX + 6}
          y={vidrioY + 6}
          width={Math.max(0, vidrioAncho - 12)}
          height={Math.max(0, vidrioAlto - 12)}
          rx={1}
          fill="none"
          stroke="rgba(220,220,220,0.20)"
          strokeWidth={1.5}
        />
      )}

      {/* REFLEJOS */}

      <rect
        x={vidrioX + 5}
        y={vidrioY + 5}
        width={Math.max(0, vidrioAncho - 10)}
        height={2}
        fill="rgba(255,255,255,0.10)"
        opacity={0.8}
      />

      <rect
        x={vidrioX + 10}
        y={vidrioY + 10}
        width={Math.max(0, vidrioAncho * 0.08)}
        height={Math.max(0, vidrioAlto - 20)}
        fill="rgba(255,255,255,0.10)"
        opacity={0.45}
      />

      {/* BISAGRAS */}

      <rect
        x={ladoIzquierdo ? left + 2 : left + ancho - 9}
        y={top + 34}
        width={7}
        height={38}
        rx={1.5}
        fill={colorHerraje}
      />

      <rect
        x={ladoIzquierdo ? left + 2 : left + ancho - 9}
        y={top + alto - 72}
        width={7}
        height={38}
        rx={1.5}
        fill={colorHerraje}
      />

      {/* MANIJA */}

      <g
        transform={`
          translate(
            ${ladoIzquierdo ? left + ancho - 22 : left + 12},
            ${top + alto / 2}
          )
        `}
      >
        <g
          transform={`
            rotate(
              ${rotationManija},
              5,
              0
            )
          `}
        >
          {/* BASE */}

          <rect
            x={0}
            y={-20}
            width={10}
            height={40}
            rx={2}
            fill={colorHerraje}
          />

          {/* REFLEJO */}

          <rect
            x={2}
            y={-17}
            width={1.5}
            height={34}
            fill="rgba(255,255,255,0.22)"
          />

          {/* BRAZO */}

          <path
            d="
              M 5 -5
              L 5 35
              Q 5 42 12 42
              L 25 42
            "
            fill="none"
            stroke={colorHerraje}
            strokeWidth={7}
            strokeLinecap="round"
          />
        </g>
      </g>

      {/* APERTURA LATERAL */}

      {posicion === "abrir" && (
        <path
          d={
            ladoIzquierdo
              ? `
                M ${left + 14} ${top + 16}
                L ${left + ancho - 26} ${top + alto / 2}
                L ${left + 14} ${top + alto - 16}
              `
              : `
                M ${left + ancho - 14} ${top + 16}
                L ${left + 26} ${top + alto / 2}
                L ${left + ancho - 14} ${top + alto - 16}
              `
          }
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
      )}

      {/* OSCILO */}

      {posicion === "oscilo" && (
        <path
          d={`
            M ${hojaLeft + 10} ${hojaTop + 10}
            L ${left + ancho / 2} ${top + alto - 20}
            L ${hojaLeft + hojaAncho - 10} ${hojaTop + 10}
          `}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
      )}
    </>
  );
}
