import { Lama } from "./Lama";

import { Bisagra } from "@/shared/svg/components/Bisagra";

import { Falleba } from "@/shared/svg/components/Falleba";

type Props = {
  x: number;

  y: number;

  width: number;

  height: number;

  color: string;

  hojaFrameThickness: number;

  direccionApertura:
  | "izquierda"
  | "derecha";

  lamas: unknown[];

  microperforado?: boolean;

  tieneManija?: boolean;

  bisagraIzquierda?: boolean;

  bisagraDerecha?: boolean;
};

export function PostigonLeaf({
  x,
  y,
  width,
  height,
  color,
  hojaFrameThickness,
  lamas,
  microperforado,
  tieneManija,
  bisagraIzquierda,
  bisagraDerecha,
}: Props) {
  return (
    <g>
      {/* PERFIL */}

      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="0.8"
      />

      {/* INTERIOR */}

      <rect
        x={x + hojaFrameThickness}
        y={y + hojaFrameThickness}
        width={width - hojaFrameThickness * 2}
        height={height - hojaFrameThickness * 2}
        fill="rgba(0,0,0,0.10)"
      />

      {/* LAMAS */}

      {lamas.map((_, lIndex) => {
        const lamaHeight = height / lamas.length;

        const yLama = y + hojaFrameThickness + lIndex * lamaHeight;

        if (yLama > y + height - hojaFrameThickness * 2) {
          return null;
        }

        return (
          <Lama
            key={lIndex}
            x={x + hojaFrameThickness}
            y={yLama}
            width={width - hojaFrameThickness * 2}
            height={lamaHeight * 0.8}
            color={color}
            microperforado={microperforado}
          />
        );
      })}

      {/* BRILLO METAL */}

      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="url(#metalGradient)"
        pointerEvents="none"
      />

      {/* BISAGRAS IZQ */}

      {bisagraIzquierda && (
        <>
          {[0.15, 0.5, 0.85].map((pos, idx) => (
            <Bisagra key={idx} x={x - 2} y={y + height * pos} />
          ))}
        </>
      )}

      {/* BISAGRAS DER */}

      {bisagraDerecha && (
        <>
          {[0.15, 0.5, 0.85].map((pos, idx) => (
            <Bisagra key={idx} x={x + width - 4} y={y + height * pos} />
          ))}
        </>
      )}

      {/* FALLEBA */}

      {tieneManija && <Falleba x={x + 8} y={y + height / 2 - 22} />}
    </g>
  );
}
