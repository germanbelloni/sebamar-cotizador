import type { VidrioType } from "@/shared/types/vidrios";

type Props = {
  left: number;
  top: number;

  ancho: number;
  alto: number;

  tipoVidrio?: VidrioType;
};

export function Vidrios({ left, top, ancho, alto, tipoVidrio }: Props) {
  const esEsmerilado = tipoVidrio === "esmerilado";

  const esFantasia = tipoVidrio === "fantasia";

  const esDVH = tipoVidrio?.includes("DVH");

  const esLaminado = tipoVidrio === "3+3" || tipoVidrio === "4+4";

  const strokeVidrio = esDVH
    ? "rgba(220,220,220,0.30)"
    : esLaminado
      ? "rgba(255,255,255,0.18)"
      : "rgba(255,255,255,0.08)";

  return (
    <>
      {" "}
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
          fill={
            esEsmerilado
              ? "rgba(255,255,255,0.22)"
              : esFantasia
                ? "rgba(120,140,160,0.18)"
                : "url(#glassGradient)"
          }
          stroke={strokeVidrio}
          strokeWidth={esDVH ? 2 : 1}
        />

        {/* DVH */}

        {esDVH && (
          <rect
            x={left + 22}
            y={top + 22}
            width={Math.max(0, ancho / 2 - 40)}
            height={Math.max(0, alto - 44)}
            fill="none"
            stroke="rgba(220,220,220,0.20)"
            strokeWidth={1.5}
          />
        )}

        {/* FANTASÍA */}

        {esFantasia && (
          <rect
            x={left + 16}
            y={top + 16}
            width={Math.max(0, ancho / 2 - 28)}
            height={Math.max(0, alto - 32)}
            fill="url(#fantasiaPattern)"
            opacity={0.7}
          />
        )}
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
          fill={
            esEsmerilado
              ? "rgba(255,255,255,0.22)"
              : esFantasia
                ? "rgba(120,140,160,0.18)"
                : "url(#glassGradient)"
          }
          stroke={strokeVidrio}
          strokeWidth={esDVH ? 2 : 1}
        />

        {/* DVH */}

        {esDVH && (
          <rect
            x={left + ancho / 2 + 18}
            y={top + 22}
            width={Math.max(0, ancho / 2 - 40)}
            height={Math.max(0, alto - 44)}
            fill="none"
            stroke="rgba(220,220,220,0.20)"
            strokeWidth={1.5}
          />
        )}

        {/* FANTASÍA */}

        {esFantasia && (
          <rect
            x={left + ancho / 2 + 12}
            y={top + 16}
            width={Math.max(0, ancho / 2 - 28)}
            height={Math.max(0, alto - 32)}
            fill="url(#fantasiaPattern)"
            opacity={0.7}
          />
        )}
      </g>
    </>
  );
}
