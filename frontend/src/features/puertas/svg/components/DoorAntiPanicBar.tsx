type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  mano: "izquierda" | "derecha";
};

export function DoorAntiPanicBar({ x, y, width, height, mano }: Props) {
  const barraWidth = width * 0.45;

  const barraHeight = 6;

  const barraX = mano === "izquierda" ? x + width * 0.18 : x + width * 0.37;

  const barraY = y + height * 0.5;

  return (
    <rect
      x={barraX}
      y={barraY}
      width={barraWidth}
      height={barraHeight}
      rx={3}
      fill="#d9d9d9"
      stroke="#888"
      strokeWidth={1}
    />
  );
}
