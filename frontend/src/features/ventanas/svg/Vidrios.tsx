type Props = {
  left: number;
  top: number;

  ancho: number;
  alto: number;
};

export function Vidrios({ left, top, ancho, alto }: Props) {
  return (
    <>
      {/* VIDRIO IZQUIERDO */}

      <g>
        {/* SOMBRA PROFUNDA */}

        <rect
          x={left + 14}
          y={top + 14}
          width={Math.max(0, ancho / 2 - 24)}
          height={Math.max(0, alto - 28)}
          fill="rgba(0,0,0,0.14)"
          rx={2}
        />

        {/* BRILLO INTERNO */}

        <rect
          x={left + 18}
          y={top + 18}
          width={Math.max(0, ancho / 2 - 32)}
          height={2}
          fill="rgba(255,255,255,0.10)"
          opacity={0.8}
        />

        {/* REFLEJO */}

        <rect
          x={left + 24}
          y={top + 20}
          width={10}
          height={Math.max(0, alto - 40)}
          fill="rgba(255,255,255,0.10)"
          opacity={0.5}
        />

        {/* VIDRIO */}

        <rect
          x={left + 16}
          y={top + 16}
          width={Math.max(0, ancho / 2 - 28)}
          height={Math.max(0, alto - 32)}
          fill="url(#glassGradient)"
          className="transition-all duration-300"
        />
      </g>

      {/* VIDRIO DERECHO */}

      <g>
        {/* SOMBRA PROFUNDA */}

        <rect
          x={left + ancho / 2 + 10}
          y={top + 14}
          width={Math.max(0, ancho / 2 - 24)}
          height={Math.max(0, alto - 28)}
          fill="rgba(0,0,0,0.14)"
          rx={2}
        />

        {/* BRILLO INTERNO */}

        <rect
          x={left + ancho / 2 + 14}
          y={top + 18}
          width={Math.max(0, ancho / 2 - 32)}
          height={2}
          fill="rgba(255,255,255,0.10)"
          opacity={0.8}
        />

        {/* REFLEJO */}

        <rect
          x={left + ancho / 2 + 20}
          y={top + 20}
          width={10}
          height={Math.max(0, alto - 40)}
          fill="rgba(255,255,255,0.10)"
          opacity={0.5}
        />

        {/* VIDRIO */}

        <rect
          x={left + ancho / 2 + 12}
          y={top + 16}
          width={Math.max(0, ancho / 2 - 28)}
          height={Math.max(0, alto - 32)}
          fill="url(#glassGradient)"
          className="transition-all duration-300"
        />
      </g>
    </>
  );
}
