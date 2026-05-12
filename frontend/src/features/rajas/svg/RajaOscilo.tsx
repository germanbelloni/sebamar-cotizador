// RajaOscilo.tsx

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

export function RajaOscilo({
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
            -6
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

      {/* DOBLE FLECHA */}

      <path
        d={`
          M ${left + ancho + 10} ${top + alto - 20}
          Q ${left + ancho + 35} ${top + alto - 50}
          ${left + ancho + 5} ${top + alto - 85}
        `}
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="2"
        strokeDasharray="6 6"
      />

      <path
        d={`
          M ${left + ancho / 2 - 35} ${top + alto + 15}
          Q ${left + ancho / 2} ${top + alto + 35}
          ${left + ancho / 2 + 35} ${top + alto + 15}
        `}
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="2"
        strokeDasharray="6 6"
      />
    </>
  );
}
