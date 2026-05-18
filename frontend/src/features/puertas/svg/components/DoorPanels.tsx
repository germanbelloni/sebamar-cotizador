type Props = {
  x: number;

  y: number;

  width: number;

  height: number;
};

export function DoorPanels({ x, y, width, height }: Props) {
  return (
    <>
      <rect x={x} y={y} width={width} height={height} fill="rgba(0,0,0,0.22)" />

      <line
        x1={x}
        y1={y}
        x2={x + width}
        y2={y}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />

      <line
        x1={x}
        y1={y + height}
        x2={x + width}
        y2={y + height}
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="1"
      />
    </>
  );
}
