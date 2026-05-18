import { GlassPanel } from "@/shared/svg/components/GlassPanel";

import type { GlassArea } from "../../models/types";

type Props = {
  glass: GlassArea;

  x: number;

  y: number;

  width: number;

  height: number;

  vidrio?: string;
};

export function DoorGlass({ glass, x, y, width, height, vidrio }: Props) {
  return (
    <GlassPanel
      x={x + width * glass.x}
      y={y + height * glass.y}
      width={width * glass.width}
      height={height * glass.height}
      tipoVidrio={vidrio}
    />
  );
}
