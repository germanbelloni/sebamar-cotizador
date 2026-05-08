type Props = {
  left: number;
  top: number;

  ancho: number;

  color: string;
};

export function CortinaAluminio({ left, top, ancho, color }: Props) {
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => (
        <g key={i}>
          {/* LAMA */}

          <rect
            x={left}
            y={top + i * 10}
            width={ancho}
            height={8}
            rx={1}
            fill={color}
            className="transition-all duration-300"
          />

          {/* SOMBRA */}

          <rect
            x={left}
            y={top + i * 10 + 6}
            width={ancho}
            height={2}
            fill="rgba(0,0,0,0.18)"
          />

          {/* BRILLO */}

          <rect
            x={left}
            y={top + i * 10}
            width={ancho}
            height={1}
            fill="rgba(255,255,255,0.08)"
          />
        </g>
      ))}
    </>
  );
}
