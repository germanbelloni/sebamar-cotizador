type Props = {
  left: number;
  top: number;
  ancho: number;

  color: string;
};

export function CortinaAluminio({ left, top, ancho, color }: Props) {
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          x1={left}
          y1={top + i * 10}
          x2={left + ancho}
          y2={top + i * 10}
          stroke={color}
          strokeWidth={8}
          opacity={0.9}
        />
      ))}
    </>
  );
}
