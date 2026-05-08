type Props = {
  left: number;
  top: number;

  ancho: number;
  alto: number;
};

export function Mosquitero({ left, top, ancho, alto }: Props) {
  return (
    <>
      {/* GLOW */}

      <rect
        x={left + 10}
        y={top + 10}
        width={ancho / 2 - 16}
        height={alto - 20}
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={2}
        rx={2}
        className="transition-all duration-500"
      />

      {/* MOSQUITERO */}

      <rect
        x={left + 16}
        y={top + 16}
        width={ancho / 2 - 28}
        height={alto - 32}
        fill="url(#mosquiteroPattern)"
        opacity={0.35}
        className="transition-all duration-500"
      />
    </>
  );
}
