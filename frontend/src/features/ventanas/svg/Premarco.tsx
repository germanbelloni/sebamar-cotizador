type Props = {
  left: number;
  top: number;

  ancho: number;
  alto: number;
};

export function Premarco({ left, top, ancho, alto }: Props) {
  return (
    <>
      <rect
        x={left - 18}
        y={top - 18}
        width={ancho + 36}
        height={alto + 36}
        stroke="#52525B"
        strokeWidth={4}
        fill="none"
        className="transition-all duration-500"
      />
    </>
  );
}
