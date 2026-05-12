import type { VidrioType } from "@/shared/types/vidrios";

import type { RajaBisagra } from "../types";

import { isLeft } from "@/shared/utils/openings/getOpeningSide";

type Props = {
  left: number;

  top: number;

  ancho: number;

  alto: number;

  color: string;

  esHerrero: boolean;

  tipoVidrio?: VidrioType;

  bisagra?: RajaBisagra;
};

export function RajaAbrir({
  left,
  top,
  ancho,
  alto,
  color,
  esHerrero,
  tipoVidrio,
  bisagra,
}: Props) {
  const grosorMarco = esHerrero ? 12 : 8;

  const hojaPadding = esHerrero ? 16 : 14;

  const hojaLeft = left + hojaPadding;

  const hojaTop = top + hojaPadding;

  const hojaAncho = ancho - hojaPadding * 2;

  const hojaAlto = alto - hojaPadding * 2;

  const vidrioPadding = esHerrero ? 10 : 8;

  const colorHerraje = "#18181B";

  const ladoIzquierdo = isLeft(bisagra);

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

      {/* BISAGRA SUPERIOR */}

      <rect
        x={ladoIzquierdo ? left + 2 : left + ancho - 9}
        y={top + 34}
        width={7}
        height={38}
        rx={1}
        fill={colorHerraje}
      />

      {/* BISAGRA INFERIOR */}

      <rect
        x={ladoIzquierdo ? left + 2 : left + ancho - 9}
        y={top + alto - 72}
        width={7}
        height={38}
        rx={1}
        fill={colorHerraje}
      />

      {/* MANIJA */}

      <g
        transform={`
          translate(
            ${ladoIzquierdo ? left + ancho - 20 : left + 10},
            ${top + alto / 2 - 24}
          )
        `}
      >
        {/* BASE */}

        <rect x={0} y={0} width={10} height={48} rx={2} fill={colorHerraje} />

        {/* BRAZO */}

        <path
          d={
            ladoIzquierdo
              ? `
                M 5 16
                L -12 16
                Q -18 16 -18 24
                L -18 46
              `
              : `
                M 5 16
                L 22 16
                Q 28 16 28 24
                L 28 46
              `
          }
          fill="none"
          stroke={colorHerraje}
          strokeWidth={7}
          strokeLinecap="round"
        />
      </g>

      {/* APERTURA */}

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
    </>
  );
}
