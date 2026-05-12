// RajaVolcable.tsx

import type { VidrioType } from "@/shared/types/vidrios";

type Props = {
  left: number;

  top: number;

  ancho: number;

  alto: number;

  color: string;

  esHerrero: boolean;

  tipoVidrio?: VidrioType;
};

export function RajaVolcable({
  left,
  top,
  ancho,
  alto,
  color,
  esHerrero,
}: Props) {
  const grosorMarco = esHerrero ? 12 : 8;

  const hojaPadding = esHerrero ? 16 : 14;

  const hojaLeft = left + hojaPadding;

  const hojaTop = top + hojaPadding;

  const hojaAncho = ancho - hojaPadding * 2;

  const hojaAlto = alto - hojaPadding * 2;

  const vidrioPadding = esHerrero ? 10 : 8;

  const colorHerraje = "#18181B";

  return (
    <>
      {/* MARCO FIJO */}

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

      {/* BISAGRAS BASE */}

      <rect
        x={left + ancho * 0.2}
        y={top + alto - 9}
        width={38}
        height={7}
        rx={1}
        fill={colorHerraje}
      />

      <rect
        x={left + ancho * 0.8 - 38}
        y={top + alto - 9}
        width={38}
        height={7}
        rx={1}
        fill={colorHerraje}
      />

      {/* CIERRE */}

      <g transform={`translate(${left + ancho / 2 - 12}, ${top + 6})`}>
        <rect width={24} height={12} rx={2} fill={colorHerraje} />

        <circle
          cx={12}
          cy={18}
          r={6}
          fill="none"
          stroke={colorHerraje}
          strokeWidth={4}
        />
      </g>

      {/* APERTURA */}

      <path
        d={`
          M ${hojaLeft + 10} ${hojaTop + 10}
          L ${left + ancho / 2} ${top + alto - 20}
          L ${hojaLeft + hojaAncho - 10} ${hojaTop + 10}
        `}
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />
    </>
  );
}
