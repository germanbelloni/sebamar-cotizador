type Props = {
  left: number;

  top: number;

  anchoView: number;

  altoView: number;

  ancho: number;

  alto: number;
};

export function DimensionLines({
  left,
  top,
  anchoView,
  altoView,
  ancho,
  alto,
}: Props) {
  return (
    <>
      {/* VERTICAL */}

      <line
        x1={left - 45}
        y1={top}
        x2={left - 45}
        y2={top + altoView}
        stroke="#A1A1AA"
        strokeWidth="1"
      />

      <polygon
        points={`${left - 45},${top} ${left - 49},${top + 8} ${left - 41},${top + 8}`}
        fill="#A1A1AA"
      />

      <polygon
        points={`${left - 45},${top + altoView} ${left - 49},${top + altoView - 8} ${left - 41},${top + altoView - 8}`}
        fill="#A1A1AA"
      />

      <text
        x={left - 58}
        y={top + altoView / 2}
        fill="#D4D4D8"
        fontSize="12"
        textAnchor="middle"
        transform={`rotate(-90 ${left - 58} ${top + altoView / 2})`}
      >
        {alto} cm
      </text>

      {/* HORIZONTAL */}

      <line
        x1={left}
        y1={top + altoView + 45}
        x2={left + anchoView}
        y2={top + altoView + 45}
        stroke="#A1A1AA"
        strokeWidth="1"
      />

      <polygon
        points={`${left},${top + altoView + 45} ${left + 8},${top + altoView + 41} ${left + 8},${top + altoView + 49}`}
        fill="#A1A1AA"
      />

      <polygon
        points={`${left + anchoView},${top + altoView + 45} ${left + anchoView - 8},${top + altoView + 41} ${left + anchoView - 8},${top + altoView + 49}`}
        fill="#A1A1AA"
      />

      <text
        x={left + anchoView / 2}
        y={top + altoView + 65}
        fill="#D4D4D8"
        fontSize="12"
        textAnchor="middle"
      >
        {ancho} cm
      </text>
    </>
  );
}
