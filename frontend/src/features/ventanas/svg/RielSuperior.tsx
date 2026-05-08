type Props = {
  left: number;
  top: number;

  ancho: number;

  color: string;

  esHerrero: boolean;
};

export function RielSuperior({ left, top, ancho, color, esHerrero }: Props) {
  const height = esHerrero ? 10 : 6;

  return (
    <>
      {/* BASE */}

      <rect
        x={left - 2}
        y={top - height / 2}
        width={ancho + 4}
        height={height}
        rx={2}
        fill={color}
        className="transition-all duration-300"
      />

      {/* SOMBRA */}

      <rect
        x={left}
        y={top + 1}
        width={ancho}
        height={2}
        fill="rgba(0,0,0,0.22)"
      />

      {/* BRILLO */}

      <rect
        x={left}
        y={top - 2}
        width={ancho}
        height={1}
        fill="rgba(255,255,255,0.10)"
      />
    </>
  );
}
