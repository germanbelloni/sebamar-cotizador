type Props = {
  centerX: number;
  centerY: number;

  ancho: number;

  esHerrero: boolean;
};

export function Cierres({ centerX, centerY, ancho, esHerrero }: Props) {
  if (esHerrero) {
    return (
      <>
        {/* SOMBRA */}

        <line
          x1={centerX + 1}
          y1={centerY - 20}
          x2={centerX + 1}
          y2={centerY + 20}
          stroke="rgba(0,0,0,0.35)"
          strokeWidth={6}
          strokeLinecap="round"
        />

        {/* BASE */}

        <line
          x1={centerX}
          y1={centerY - 20}
          x2={centerX}
          y2={centerY + 20}
          stroke="#27272A"
          strokeWidth={5}
          strokeLinecap="round"
        />

        {/* BRILLO */}

        <line
          x1={centerX - 1}
          y1={centerY - 18}
          x2={centerX - 1}
          y2={centerY + 18}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={1}
          strokeLinecap="round"
        />
      </>
    );
  }

  return (
    <>
      {/* IZQ */}

      <g>
        <rect
          x={centerX - ancho / 2 + 6}
          y={centerY - 12}
          width={7}
          height={24}
          rx={3}
          fill="#D4D4D8"
        />

        <rect
          x={centerX - ancho / 2 + 8}
          y={centerY - 11}
          width={1}
          height={20}
          fill="rgba(255,255,255,0.25)"
        />
      </g>

      {/* DER */}

      <g>
        <rect
          x={centerX + ancho / 2 - 13}
          y={centerY - 12}
          width={7}
          height={24}
          rx={3}
          fill="#D4D4D8"
        />

        <rect
          x={centerX + ancho / 2 - 17}
          y={centerY - 11}
          width={1}
          height={20}
          fill="rgba(255,255,255,0.25)"
        />
      </g>
    </>
  );
}
