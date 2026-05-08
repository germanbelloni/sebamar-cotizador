type Props = {
  left: number;
  top: number;

  ancho: number;
  alto: number;

  strokeWidth: number;

  esHerrero: boolean;
};

export function Hojas({
  left,
  top,
  ancho,
  alto,
  strokeWidth,
  esHerrero,
}: Props) {
  const offset = esHerrero ? 12 : 18;

  const glassInset = esHerrero ? 16 : 22;

  return (
    <>
      {/* HOJA IZQUIERDA */}

      <g className="transition-all duration-300 hover:opacity-90">
        <rect
          x={left + offset}
          y={top + offset}
          width={ancho / 2 - offset * 1.7}
          height={alto - offset * 2}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={strokeWidth}
          fill="rgba(255,255,255,0.01)"
          className="transition-all duration-300 hover:stroke-white"
        />

        {/* SOMBRA */}

        <rect
          x={left + glassInset}
          y={top + glassInset}
          width={ancho / 2 - glassInset * 1.7}
          height={alto - glassInset * 2}
          stroke="rgba(0,0,0,0.18)"
          strokeWidth={1}
          fill="none"
        />
      </g>

      {/* HOJA DERECHA */}

      <g className="transition-all duration-300 hover:opacity-90">
        <rect
          x={left + ancho / 2 + (esHerrero ? 8 : 14)}
          y={top + offset}
          width={ancho / 2 - offset * 1.7}
          height={alto - offset * 2}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={strokeWidth}
          fill="rgba(255,255,255,0.01)"
          className="transition-all duration-300 hover:stroke-white"
        />

        {/* SOMBRA */}

        <rect
          x={left + ancho / 2 + (esHerrero ? 12 : 18)}
          y={top + glassInset}
          width={ancho / 2 - glassInset * 1.7}
          height={alto - glassInset * 2}
          stroke="rgba(0,0,0,0.18)"
          strokeWidth={1}
          fill="none"
        />
      </g>
    </>
  );
}
