// RajaBrazo.tsx

import type { RajaBisagra } from "../types";
import type { VidrioType } from "@/shared/types/vidrios";

type Props = {
  left: number;

  top: number;

  ancho: number;

  alto: number;

  bisagra?: RajaBisagra;

  color: string;

  esHerrero: boolean;

  tipoVidrio?: VidrioType;
};

export function RajaBrazo({
  left,
  top,
  ancho,
  alto,
  color,
  esHerrero,
  tipoVidrio,
}: Props) {
  const grosorMarco = esHerrero ? 12 : 8;

  const hojaPadding = esHerrero ? 16 : 14;

  const hojaLeft = left + hojaPadding;

  const hojaTop = top + hojaPadding;

  const hojaAncho = ancho - hojaPadding * 2;

  const hojaAlto = alto - hojaPadding * 2;

  const vidrioPadding = esHerrero ? 10 : 8;

  const colorHerraje = "#18181B";

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
        x={left + 3}
        y={top + 4}
        width={ancho}
        height={alto}
        fill="none"
        stroke="rgba(0,0,0,0.25)"
        strokeWidth={5}
        opacity={0.6}
      />

      {/* MARCO FIJO */}

      <rect
        x={left}
        y={top}
        width={ancho}
        height={alto}
        fill="rgba(255,255,255,0.015)"
        stroke={color}
        strokeWidth={4}
      />

      {/* HOJA */}

      <rect
        x={hojaLeft + 2}
        y={hojaTop + 3}
        width={hojaAncho}
        height={hojaAlto}
        fill="none"
        stroke="rgba(0,0,0,0.20)"
        strokeWidth={grosorMarco + 1}
        opacity={0.7}
      />

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

      <rect
        x={hojaLeft}
        y={hojaTop}
        width={hojaAncho}
        height={hojaAlto}
        fill="none"
        stroke="url(#aluminumGradient)"
        strokeWidth={Math.max(1, grosorMarco - 1)}
        opacity={0.85}
      />

      {/* VIDRIO */}

      <rect
        x={hojaLeft + vidrioPadding + 2}
        y={hojaTop + vidrioPadding + 3}
        width={hojaAncho - vidrioPadding * 2}
        height={hojaAlto - vidrioPadding * 2}
        rx={2}
        fill="rgba(0,0,0,0.16)"
      />

      <rect
        x={hojaLeft + vidrioPadding}
        y={hojaTop + vidrioPadding}
        width={hojaAncho - vidrioPadding * 2}
        height={hojaAlto - vidrioPadding * 2}
        rx={2}
        fill="url(#glassGradient)"
        stroke={strokeVidrio}
        strokeWidth={esDVH ? 2 : 1.5}
      />

      {esDVH && (
        <rect
          x={hojaLeft + vidrioPadding + 6}
          y={hojaTop + vidrioPadding + 6}
          width={hojaAncho - vidrioPadding * 2 - 12}
          height={hojaAlto - vidrioPadding * 2 - 12}
          rx={1}
          fill="none"
          stroke="rgba(220,220,220,0.20)"
          strokeWidth={1.5}
        />
      )}

      {/* REFLEJOS */}

      <rect
        x={hojaLeft + vidrioPadding + 5}
        y={hojaTop + vidrioPadding + 5}
        width={hojaAncho - vidrioPadding * 2 - 10}
        height={2}
        fill="rgba(255,255,255,0.10)"
        opacity={0.8}
      />

      <rect
        x={hojaLeft + vidrioPadding + 10}
        y={hojaTop + vidrioPadding + 10}
        width={Math.max(8, hojaAncho * 0.08)}
        height={Math.max(0, hojaAlto - 40)}
        fill="rgba(255,255,255,0.10)"
        opacity={0.4}
      />

      {/* BISAGRAS SUPERIORES */}

      <rect
        x={left + ancho * 0.2}
        y={top + 2}
        width={32}
        height={6}
        rx={1}
        fill={colorHerraje}
      />

      <rect
        x={left + ancho * 0.8 - 32}
        y={top + 2}
        width={32}
        height={6}
        rx={1}
        fill={colorHerraje}
      />

      {/* BRAZO */}

      <g transform={`translate(${left + ancho / 2 - 20}, ${top + alto - 24})`}>
        <rect x={15} y={8} width={10} height={6} rx={1} fill={colorHerraje} />

        <path
          d="M 20 8 L 20 -10 L 35 -15"
          fill="none"
          stroke={colorHerraje}
          strokeWidth={4}
          strokeLinecap="round"
        />

        <rect x={5} y={2} width={30} height={6} rx={2} fill={colorHerraje} />
      </g>

      {/* APERTURA */}

      <path
        d={`
          M ${hojaLeft + 15} ${hojaTop + hojaAlto - 15}
          L ${left + ancho / 2} ${top + 20}
          L ${hojaLeft + hojaAncho - 15} ${hojaTop + hojaAlto - 15}
        `}
        fill="none"
        stroke="rgba(255,255,255,0.20)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />
    </>
  );
}
