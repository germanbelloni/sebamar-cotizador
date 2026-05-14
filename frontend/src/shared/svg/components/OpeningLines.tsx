type Props = {
  x: number;

  y: number;

  width: number;

  height: number;

  direction?: "left" | "right";
};

export function OpeningLines({
  x,
  y,
  width,
  height,
  direction = "right",
}: Props) {
  return (
    <>
      <line
        x1={x}
        y1={y}
        x2={direction === "right" ? x + width : x - width}
        y2={y + height}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="2"
      />

      <line
        x1={x}
        y1={y}
        x2={direction === "right" ? x + width * 0.85 : x - width * 0.85}
        y2={y + height * 0.15}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="2"
      />
    </>
  );
}
