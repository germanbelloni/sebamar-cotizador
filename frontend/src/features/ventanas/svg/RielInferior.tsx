type Props = {
  left: number;
  top: number;

  ancho: number;
  alto: number;

  color: string;
};

export function RielInferior({ left, top, ancho, alto, color }: Props) {
  return (
    <>
      {/* BASE */}

      <rect
        x={left - 2}
        y={top + alto - 6}
        width={ancho + 4}
        height={12}
        rx={2}
        fill={color}
        className="transition-all duration-300"
      />

      {/* CANAL 1 */}

      <rect
        x={left + 10}
        y={top + alto - 2}
        width={ancho / 2 - 18}
        height={2}
        fill="rgba(0,0,0,0.30)"
      />

      {/* CANAL 2 */}

      <rect
        x={left + ancho / 2 + 8}
        y={top + alto - 2}
        width={ancho / 2 - 18}
        height={2}
        fill="rgba(0,0,0,0.30)"
      />

      {/* BRILLO */}

      <rect
        x={left}
        y={top + alto - 5}
        width={ancho}
        height={1}
        fill="rgba(255,255,255,0.12)"
      />
    </>
  );
}
