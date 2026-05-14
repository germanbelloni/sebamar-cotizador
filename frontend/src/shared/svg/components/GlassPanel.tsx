type Props = {
  x: number;

  y: number;

  width: number;

  height: number;

  tipoVidrio?: string;
};

export function GlassPanel({ x, y, width, height, tipoVidrio }: Props) {
  const opacity =
    tipoVidrio === "dvh" ? 0.22 : tipoVidrio === "laminado" ? 0.18 : 0.14;

  return (
    <>
      {/* VIDRIO */}

      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={`rgba(120,180,255,${opacity})`}
      />

      {/* REFLEJO */}

      <rect
        x={x}
        y={y}
        width={width * 0.35}
        height={height}
        fill="rgba(255,255,255,0.08)"
      />

      {/* BRILLO */}

      <line
        x1={x + 6}
        y1={y + 6}
        x2={x + width - 6}
        y2={y + 6}
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />
    </>
  );
}
