type Props = {
  x: number;

  y: number;

  width: number;

  height: number;

  color: string;

  microperforado?: boolean;
};

export function Lama({ x, y, width, height, color, microperforado }: Props) {
  return (
    <g>
      {/* BASE */}

      <rect x={x} y={y} width={width} height={height} fill={color} />

      {/* SOMBRA */}

      <rect
        x={x}
        y={y + height * 0.7}
        width={width}
        height="1.2"
        fill="rgba(0,0,0,0.22)"
      />

      {/* BRILLO */}

      <rect
        x={x}
        y={y}
        width={width}
        height="1"
        fill="rgba(255,255,255,0.10)"
      />

      {/* MICROPERFORADO */}

      {microperforado && (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="url(#microperforado)"
        />
      )}
    </g>
  );
}
