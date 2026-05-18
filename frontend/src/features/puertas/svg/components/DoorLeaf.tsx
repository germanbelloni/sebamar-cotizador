type Props = {
  x: number;

  y: number;

  width: number;

  height: number;

  color: string;
};

export function DoorLeaf({ x, y, width, height, color }: Props) {
  return (
    <>
      {/* HOJA */}

      <rect x={x} y={y} width={width} height={height} rx="8" fill={color} />

      {/* BRILLO */}

      <rect
        x={x}
        y={y}
        width={width * 0.18}
        height={height}
        fill="rgba(255,255,255,0.08)"
      />

      {/* SOMBRA */}

      <rect
        x={x + width * 0.82}
        y={y}
        width={width * 0.18}
        height={height}
        fill="rgba(0,0,0,0.08)"
      />

      {/* INNER BORDER */}

      <rect
        x={x + 3}
        y={y + 3}
        width={width - 6}
        height={height - 6}
        rx="6"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
    </>
  );
}
