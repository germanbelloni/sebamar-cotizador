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

export function RajaBrazo({ left, top, ancho, alto, color, esHerrero }: Props) {
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

      {/* BRAZO DE EMPUJE */}

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
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />
    </>
  );
}
