import { OpeningLines } from "@/shared/svg/components/OpeningLines";

import type { PuertasConfig } from "../../types";

import type { PuertaModeloConfig } from "../../models/types";

import { DoorLeaf } from "./DoorLeaf";

import { DoorGlass } from "./DoorGlass";

import { DoorTravesano } from "./DoorTravesano";

import { DoorDivisions } from "./DoorDivisions";

import { DoorHandle } from "./DoorHandle";
import { DoorAntiPanicBar } from "./DoorAntiPanicBar";

type Props = {
  config: PuertasConfig;

  model: PuertaModeloConfig;

  color: string;

  x: number;

  y: number;

  width: number;

  height: number;
};

export function DoorRenderer({
  config,
  model,
  color,
  x,
  y,
  width,
  height,
}: Props) {
  return (
    <>
      {/* HOJA */}

      <DoorLeaf x={x} y={y} width={width} height={height} color={color} />

      {/* VIDRIOS */}

      {model.glassAreas?.map((glass, index) => (
        <DoorGlass
          key={index}
          glass={glass}
          x={x}
          y={y}
          width={width}
          height={height}
          vidrio={config.vidrio}
        />
      ))}

      {/* TRAVESAÑOS */}

      {model.travesanos?.map((travesano, index) => (
        <DoorTravesano
          key={index}
          travesano={travesano}
          x={x}
          y={y}
          width={width}
          height={height}
        />
      ))}

      {/* DIVISIONES */}

      {model.verticalDivisions && (
        <DoorDivisions
          divisions={model.verticalDivisions}
          x={x}
          y={y}
          width={width}
          height={height}
        />
      )}

      {/* MANIJA */}

      <DoorHandle
        x={x}
        y={y}
        width={width}
        height={height}
        mano={config.mano}
      />

      {config.extras.barraAntipanico ? (
        <DoorAntiPanicBar
          x={x}
          y={y}
          width={width}
          height={height}
          mano={config.mano}
        />
      ) : null}

      {/* APERTURA */}

      <OpeningLines
        x={config.mano === "derecha" ? x + width : x}
        y={y}
        width={80}
        height={height}
        direction={config.mano === "derecha" ? "right" : "left"}
      />
    </>
  );
}
