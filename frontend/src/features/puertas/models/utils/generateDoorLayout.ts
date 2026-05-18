import type { PuertasConfig } from "../../types";

type DoorLeaf = {
  x: number;

  width: number;

  openingDirection?: "left" | "right";

  isFixed?: boolean;
};

type DoorLayout = {
  leaves: DoorLeaf[];
};

export function generateDoorLayout(config: PuertasConfig): DoorLayout {
  const totalWidth = config.ancho;

  /* SIMPLE */

  if (config.tipoConfiguracion === "simple") {
    return {
      leaves: [
        {
          x: 0,

          width: totalWidth,

          openingDirection: config.mano === "izquierda" ? "left" : "right",
        },
      ],
    };
  }

  /* DOBLE */

  if (config.tipoConfiguracion === "doble") {
    return {
      leaves: [
        {
          x: 0,

          width: totalWidth / 2,

          openingDirection: "left",
        },

        {
          x: totalWidth / 2,

          width: totalWidth / 2,

          openingDirection: "right",
        },
      ],
    };
  }

  /* PUERTA Y MEDIA */

  if (config.tipoConfiguracion === "puerta_y_media") {
    const principal = config.anchoPrincipal || 80;

    return {
      leaves: [
        {
          x: 0,

          width: principal,

          openingDirection: config.mano === "izquierda" ? "left" : "right",
        },

        {
          x: principal,

          width: totalWidth - principal,

          isFixed: true,
        },
      ],
    };
  }

  /* PORTON */

  if (config.tipoConfiguracion === "porton") {
    const hojas = config.hojas || 2;

    const leafWidth = totalWidth / hojas;

    return {
      leaves: Array.from({ length: hojas }).map((_, index) => ({
        x: index * leafWidth,

        width: leafWidth,

        openingDirection: index % 2 === 0 ? "left" : "right",
      })),
    };
  }

  return {
    leaves: [],
  };
}
