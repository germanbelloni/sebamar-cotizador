// RajaVolcable.tsx

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

export function RajaVolcable({
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
            8
            ${left + ancho / 2}
            ${top}
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

      {/* FLECHA */}

      <path
        d={`
          M ${left + ancho / 2 - 40} ${top + alto + 15}
          Q ${left + ancho / 2} ${top + alto + 40}
          ${left + ancho / 2 + 40} ${top + alto + 15}
        `}
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2"
        strokeDasharray="6 6"
      />
    </>
  );
}
