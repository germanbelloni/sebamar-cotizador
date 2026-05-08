type Props = {
  left: number;
  top: number;

  ancho: number;
  alto: number;

  color: string;
};

export function Contramarco({ left, top, ancho, alto, color }: Props) {
  return (
    <rect
      x={left - 10}
      y={top - 10}
      width={ancho + 20}
      height={alto + 20}
      stroke={color}
      strokeWidth={4}
      fill="none"
      opacity={0.9}
      className="transition-all duration-500"
    />
  );
}
