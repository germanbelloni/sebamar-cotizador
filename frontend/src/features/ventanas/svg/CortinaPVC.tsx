type Props = {
  left: number;
  top: number;

  ancho: number;
};

export function CortinaPVC({ left, top, ancho }: Props) {
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          x1={left}
          y1={top + i * 10}
          x2={left + ancho}
          y2={top + i * 10}
          stroke="#E4E4E7"
          strokeWidth={6}
          strokeLinecap="round"
          opacity={0.9}
          className="transition-all duration-300"
        />
      ))}
    </>
  );
}
