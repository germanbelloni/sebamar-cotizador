type Props = {
  left: number;
  top: number;

  ancho: number;
  alto: number;

  color: string;

  frameWidth: number;
};

export function Marco({ left, top, ancho, alto, color, frameWidth }: Props) {
  return (
    <>
      {/* SOMBRA EXTERIOR */}

      <rect
        x={left + 2}
        y={top + 4}
        width={ancho}
        height={alto}
        stroke="rgba(0,0,0,0.18)"
        strokeWidth={frameWidth + 1}
        fill="none"
        opacity={0.6}
      />

      {/* MARCO PRINCIPAL */}

      <rect
        x={left}
        y={top}
        width={ancho}
        height={alto}
        stroke={color}
        strokeWidth={frameWidth}
        fill="none"
        className="transition-all duration-300"
      />

      {/* METAL LIGHT */}

      <rect
        x={left}
        y={top}
        width={ancho}
        height={alto}
        stroke="url(#aluminumGradient)"
        strokeWidth={frameWidth - 1}
        fill="none"
        opacity={0.9}
      />

      {/* BRILLO EXTERIOR */}

      <rect
        x={left + 1}
        y={top + 1}
        width={ancho - 2}
        height={alto - 2}
        stroke="rgba(255,255,255,0.10)"
        strokeWidth={1}
        fill="none"
        className="transition-all duration-300"
      />

      {/* SOMBRA INTERNA */}

      <rect
        x={left + frameWidth / 2}
        y={top + frameWidth / 2}
        width={ancho - frameWidth}
        height={alto - frameWidth}
        stroke="rgba(0,0,0,0.22)"
        strokeWidth={2}
        fill="none"
        className="transition-all duration-300"
      />

      {/* PROFUNDIDAD */}

      <rect
        x={left + 4}
        y={top + 4}
        width={ancho - 8}
        height={alto - 8}
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={1.5}
        fill="none"
        className="transition-all duration-300"
      />
    </>
  );
}
