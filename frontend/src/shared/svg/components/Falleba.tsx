type Props = {
  x: number;

  y: number;
};

export function Falleba({ x, y }: Props) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect width="10" height="44" rx="2" fill="#18181B" />

      <rect x="6" y="12" width="14" height="4" rx="1" fill="#3F3F46" />
    </g>
  );
}
