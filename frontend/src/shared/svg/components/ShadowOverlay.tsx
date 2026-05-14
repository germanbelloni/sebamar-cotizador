type Props = {
  left: number;

  top: number;

  anchoView: number;

  altoView: number;
};

export function ShadowOverlay({ left, top, anchoView, altoView }: Props) {
  return (
    <rect
      x={left}
      y={top}
      width={anchoView}
      height={altoView}
      fill="url(#shadowGradient)"
      opacity="0.4"
    />
  );
}
