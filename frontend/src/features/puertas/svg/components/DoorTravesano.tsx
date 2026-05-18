import type { Travesano } from "../../models/types";

type Props = {
  travesano: Travesano;

  x: number;

  y: number;

  width: number;

  height: number;
};

export function DoorTravesano({ travesano, x, y, width, height }: Props) {
  return (
    <rect
      x={x + width * 0.12}
      y={y + height * travesano.y}
      width={width * 0.76}
      height={height * travesano.height}
      rx="2"
      fill="rgba(0,0,0,0.22)"
    />
  );
}
