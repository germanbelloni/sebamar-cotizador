type Props = {
  x: number;

  y: number;
};

export function Bisagra({ x, y }: Props) {
  return <rect x={x} y={y} width="6" height="16" rx="1" fill="#27272A" />;
}
