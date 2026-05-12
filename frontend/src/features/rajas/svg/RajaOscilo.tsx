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
}: Props) {
  const grosorMarco = esHerrero ? 12 : 8;

  const hojaPadding = esHerrero ? 16 : 14;

  const ladoIzquierdo = isLeft(bisagra);

  const colorHerraje = "#18181B";

  const hojaLeft = left + hojaPadding;

  const hojaTop = top + hojaPadding;

  const hojaAncho = ancho - hojaPadding * 2;

  const hojaAlto = alto - hojaPadding * 2;

  const vidrioPadding = esHerrero ? 10 : 8;

  const rotationManija =
    posicion === "cerrada"
      ? 0
      : posicion === "abrir"
        ? ladoIzquierdo
          ? -90
          : 90
        : 180;

  return (
    <>
      {/* MARCO */}

      <rect
        x={left}
        y={top}
        width={ancho}
        height={alto}
        fill="none"
        stroke={color}
        strokeWidth={4}
      />

      {/* HOJA */}

      <rect
        x={hojaLeft}
        y={hojaTop}
        width={hojaAncho}
        height={hojaAlto}
        fill="rgba(255,255,255,0.03)"
        stroke={color}
        strokeWidth={grosorMarco}
        strokeLinejoin="round"
      />

      {/* VIDRIO */}

      <rect
        x={hojaLeft + vidrioPadding}
        y={hojaTop + vidrioPadding}
        width={hojaAncho - vidrioPadding * 2}
        height={hojaAlto - vidrioPadding * 2}
        fill="url(#glassGradient)"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={1.5}
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
        <g transform={`rotate(${rotationManija}, 5, 0)`}>
          <rect
            x={0}
            y={-20}
            width={10}
            height={40}
            rx={2}
            fill={colorHerraje}
          />

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
          stroke="white"
          strokeWidth="1.2"
          strokeDasharray="4 3"
          opacity="0.4"
        />
      )}

      {/* APERTURA OSCILO */}

      {posicion === "oscilo" && (
        <path
          d={`
            M ${hojaLeft + 10} ${hojaTop + 10}
            L ${left + ancho / 2} ${top + alto - 20}
            L ${hojaLeft + hojaAncho - 10} ${hojaTop + 10}
          `}
          fill="none"
          stroke="white"
          strokeWidth="1.2"
          strokeDasharray="4 3"
          opacity="0.4"
        />
      )}
    </>
  );
}
