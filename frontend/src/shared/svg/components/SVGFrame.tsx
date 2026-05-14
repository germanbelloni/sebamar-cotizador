type Props = {
  left: number;

  top: number;

  anchoView: number;

  altoView: number;

  color: string;
};

export function SVGFrame({ left, top, anchoView, altoView, color }: Props) {
  return (
    <rect
      x={left - 4}
      y={top - 4}
      width={anchoView + 8}
      height={altoView + 8}
      rx="4"
      fill={color}
      stroke="rgba(255,255,255,0.08)"
      strokeWidth="1"
    />
  );
}
