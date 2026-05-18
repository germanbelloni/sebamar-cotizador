import type { PuertaMano } from "../../types";

type Props = {
  x: number;

  y: number;

  width: number;

  height: number;

  mano: PuertaMano;
};

export function DoorHandle({ x, y, width, height, mano }: Props) {
  const handleX = mano === "derecha" ? x + width * 0.08 : x + width * 0.9;

  return (
    <>
      {/* MANIJA */}

      <rect
        x={handleX}
        y={y + height * 0.45}
        width={4}
        height={height * 0.12}
        rx="999"
        fill="#111"
      />

      {/* SOMBRA */}

      <rect
        x={handleX + 1}
        y={y + height * 0.45}
        width={1}
        height={height * 0.12}
        fill="rgba(255,255,255,0.25)"
      />
    </>
  );
}
