type Props = {
  divisions: number[];

  x: number;

  y: number;

  width: number;

  height: number;
};

export function DoorDivisions({ divisions, x, y, width, height }: Props) {
  return (
    <>
      {divisions.map((division, index) => (
        <rect
          key={index}
          x={x + width * division}
          y={y + height * 0.08}
          width={3}
          height={height * 0.78}
          fill="rgba(0,0,0,0.28)"
        />
      ))}
    </>
  );
}
