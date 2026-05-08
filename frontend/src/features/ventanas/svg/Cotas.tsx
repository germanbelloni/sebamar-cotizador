type Props = {
  left: number;
  top: number;

  ancho: number;
  alto: number;

  medidaAncho: number;
  medidaAlto: number;
};

export function Cotas({
  left,
  top,
  ancho,
  alto,
  medidaAncho,
  medidaAlto,
}: Props) {
  return (
    <>
      {/* ANCHO */}

      <line
        x1={left}
        y1={top + alto + 70}
        x2={left + ancho}
        y2={top + alto + 70}
        stroke="#71717A"
        strokeWidth={1.5}
      />

      <text
        x={left + ancho / 2}
        y={top + alto + 65}
        textAnchor="middle"
        fill="#A1A1AA"
        fontSize="14"
      >
        {medidaAncho} cm
      </text>

      {/* ALTO */}

      <line
        x1={left - 70}
        y1={top}
        x2={left - 70}
        y2={top + alto}
        stroke="#71717A"
        strokeWidth={1.5}
      />

      <text
        x={left - 85}
        y={250}
        textAnchor="middle"
        fill="#A1A1AA"
        fontSize="14"
        transform={`rotate(-90 ${left - 85} 250)`}
      >
        {medidaAlto} cm
      </text>
    </>
  );
}
