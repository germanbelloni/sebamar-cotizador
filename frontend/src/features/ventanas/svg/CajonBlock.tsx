type Props = {
  left: number;
  top: number;
  ancho: number;
};

export function CajonBlock({ left, top, ancho }: Props) {
  return (
    <rect
      x={left - 8}
      y={top - 38}
      width={ancho + 16}
      height={30}
      rx={4}
      fill="#3F3F46"
    />
  );
}
