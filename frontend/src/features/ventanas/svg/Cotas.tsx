type Props = {
  left: number;
  top: number;

  ancho: number;
  alto: number;

  anchoReal: number;
  altoReal: number;
};

export function Cotas({ left, top, ancho, alto, anchoReal, altoReal }: Props) {
  const offset = Math.max(55, ancho * 0.16);

  return (
    <>
      {/* COTA ANCHO */}

      <line
        x1={left}
        y1={top + alto + offset}
        x2={left + ancho}
        y2={top + alto + offset}
        stroke="#71717A"
        strokeWidth={1.5}
      />

      {/* FLECHA IZQ */}

      <polygon
        points={`
          ${left + 8},${top + alto + offset - 4}
          ${left},${top + alto + offset}
          ${left + 8},${top + alto + offset + 4}
        `}
        fill="#A1A1AA"
      />

      {/* FLECHA DER */}

      <polygon
        points={`
          ${left + ancho - 8},${top + alto + offset - 4}
          ${left + ancho},${top + alto + offset}
          ${left + ancho - 8},${top + alto + offset + 4}
        `}
        fill="#A1A1AA"
      />

      {/* TEXTO */}

      <text
        x={left + ancho / 2}
        y={top + alto + offset - 6}
        textAnchor="middle"
        fill="#A1A1AA"
        fontSize="14"
      >
        {anchoReal} cm
      </text>

      {/* COTA ALTO */}

      <line
        x1={left - offset}
        y1={top}
        x2={left - offset}
        y2={top + alto}
        stroke="#71717A"
        strokeWidth={1.5}
      />

      {/* FLECHA ARRIBA */}

      <polygon
        points={`
          ${left - offset - 4},${top + 8}
          ${left - offset},${top}
          ${left - offset + 4},${top + 8}
        `}
        fill="#A1A1AA"
      />

      {/* FLECHA ABAJO */}

      <polygon
        points={`
          ${left - offset - 4},${top + alto - 8}
          ${left - offset},${top + alto}
          ${left - offset + 4},${top + alto - 8}
        `}
        fill="#A1A1AA"
      />

      {/* TEXTO */}

      <text
        x={left - offset - 15}
        y={top + alto / 2}
        textAnchor="middle"
        fill="#A1A1AA"
        fontSize="14"
        transform={`rotate(-90 ${left - offset - 15} ${top + alto / 2})`}
      >
        {altoReal} cm
      </text>
    </>
  );
}
