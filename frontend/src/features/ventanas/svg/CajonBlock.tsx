type Props = {
  left: number;
  top: number;

  ancho: number;
};

export function CajonBlock({ left, top, ancho }: Props) {
  return (
    <>
      {/* SOMBRA */}

      <rect
        x={left - 6}
        y={top - 40}
        width={ancho + 12}
        height={32}
        rx={4}
        fill="rgba(0,0,0,0.25)"
        opacity={0.5}
      />

      {/* CUERPO */}

      <rect
        x={left - 8}
        y={top - 38}
        width={ancho + 16}
        height={30}
        rx={4}
        fill="#3F3F46"
        className="transition-all duration-500"
      />

      {/* TAPA SUPERIOR */}

      <rect
        x={left - 8}
        y={top - 38}
        width={ancho + 16}
        height={6}
        rx={2}
        fill="rgba(255,255,255,0.08)"
      />

      {/* SOMBRA INFERIOR */}

      <rect
        x={left - 8}
        y={top - 14}
        width={ancho + 16}
        height={4}
        fill="rgba(0,0,0,0.22)"
      />

      {/* DIVISIONES */}

      {Array.from({ length: 5 }).map((_, i) => (
        <line
          key={i}
          x1={left + (ancho / 5) * i}
          y1={top - 36}
          x2={left + (ancho / 5) * i}
          y2={top - 12}
          stroke="rgba(255,255,255,0.05)"
        />
      ))}
    </>
  );
}
