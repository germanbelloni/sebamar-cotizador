// RajaBrazo.tsx

import { Vidrios } from "@/features/ventanas/svg/Vidrios";

type Props = {
  left: number;

  top: number;

  ancho: number;

  alto: number;

  color: string;

  esHerrero: boolean;

  tipoVidrio?: any;
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
  return (
    <>
      <g
        transform={`
          rotate(
            10
            ${left + ancho / 2}
            ${top + alto}
          )
        `}
      >
        <rect
          x={left + 16}
          y={top + 16}
          width={ancho - 32}
          height={alto - 32}
          rx={2}
          fill="rgba(255,255,255,0.03)"
          stroke={color}
          strokeWidth={esHerrero ? 6 : 3}
        />

        <Vidrios
          left={left + 4}
          top={top + 4}
          ancho={ancho - 8}
          alto={alto - 8}
          tipoVidrio={tipoVidrio}
        />
      </g>

      {/* BRAZOS */}

      <line
        x1={left + 30}
        y1={top + alto - 40}
        x2={left + 70}
        y2={top + alto - 80}
        stroke="rgba(220,220,220,0.35)"
        strokeWidth={3}
      />

      <line
        x1={left + ancho - 30}
        y1={top + alto - 40}
        x2={left + ancho - 70}
        y2={top + alto - 80}
        stroke="rgba(220,220,220,0.35)"
        strokeWidth={3}
      />
    </>
  );
}
