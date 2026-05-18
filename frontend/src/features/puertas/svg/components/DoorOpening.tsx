import { OpeningLines } from "@/shared/svg/components/OpeningLines";

type Props = {
  x: number;

  y: number;

  width: number;

  height: number;

  mano?: "izquierda" | "derecha";
};

export function DoorOpening({ x, y, width, height, mano = "derecha" }: Props) {
  return (
    <OpeningLines
      x={mano === "derecha" ? x + width : x}
      y={y}
      width={width * 0.65}
      height={height}
      direction={mano === "derecha" ? "right" : "left"}
    />
  );
}
