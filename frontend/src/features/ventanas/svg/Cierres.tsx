type Props = {
  centerX: number;

  ancho: number;

  esHerrero: boolean;
};

export function Cierres({ centerX, ancho, esHerrero }: Props) {
  if (esHerrero) {
    return (
      <line
        x1={centerX}
        y1={230}
        x2={centerX}
        y2={270}
        stroke="#09090B"
        strokeWidth={4}
        strokeLinecap="round"
      />
    );
  }

  return (
    <>
      <rect
        x={centerX - ancho / 2 + 10}
        y={235}
        width={6}
        height={24}
        rx={2}
        fill="#D4D4D8"
      />

      <rect
        x={centerX + ancho / 2 - 16}
        y={235}
        width={6}
        height={24}
        rx={2}
        fill="#D4D4D8"
      />
    </>
  );
}
