type Props = {
  left: number;
  top: number;

  ancho: number;
  alto: number;

  strokeWidth: number;

  esHerrero: boolean;

  tipoConstruccion?: "3_hojas_2_guias" | "3_hojas_3_guias";
};

export function Hojas3({
  left,
  top,
  ancho,
  alto,
  strokeWidth,
  esHerrero,
  tipoConstruccion = "3_hojas_2_guias",
}: Props) {
  const offset = esHerrero ? 12 : 18;

  const glassInset = esHerrero ? 16 : 22;

  const hojaAncho = ancho / 3;

  const solape = esHerrero ? 8 : 10;

  const hoja1X = left + offset;

  const hoja2X = left + hojaAncho - solape + offset;

  const hoja3X = left + hojaAncho * 2 - solape * 2 + offset;

  const perfilAncho = 6;

  const tresGuias = tipoConstruccion === "3_hojas_3_guias";

  return (
    <>
      {/* HOJA IZQUIERDA */}

      <g className="transition-all duration-300 hover:opacity-90">
        <rect
          x={hoja1X}
          y={top + offset}
          width={hojaAncho - offset * 1.5}
          height={alto - offset * 2}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={strokeWidth}
          fill="rgba(255,255,255,0.01)"
          className="transition-all duration-300 hover:stroke-white"
        />

        {/* Perfil de encuentro */}

        <rect
          x={hoja1X + hojaAncho - offset * 1.5 - perfilAncho}
          y={top + offset}
          width={perfilAncho}
          height={alto - offset * 2}
          fill="url(#aluminumGradient)"
        />

        {/* Contravidrio */}

        <rect
          x={hoja1X + (glassInset - offset)}
          y={top + glassInset}
          width={hojaAncho - glassInset * 1.5}
          height={alto - glassInset * 2}
          stroke="rgba(0,0,0,0.18)"
          strokeWidth={1}
          fill="none"
        />
      </g>
      {/* HOJA CENTRAL */}

      <g className="transition-all duration-300 hover:opacity-90">
        <rect
          x={hoja2X}
          y={top + offset}
          width={hojaAncho - offset * 1.5}
          height={alto - offset * 2}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={strokeWidth}
          fill="rgba(255,255,255,0.01)"
          className="transition-all duration-300 hover:stroke-white"
        />

        {/* Perfil derecho */}

        <rect
          x={hoja2X + hojaAncho - offset * 1.5 - perfilAncho}
          y={top + offset}
          width={perfilAncho}
          height={alto - offset * 2}
          fill="url(#aluminumGradient)"
        />

        {/* Perfil izquierdo (solo en 3 guías) */}

        {tresGuias && (
          <rect
            x={hoja2X}
            y={top + offset}
            width={perfilAncho}
            height={alto - offset * 2}
            fill="url(#aluminumGradient)"
          />
        )}

        {/* Contravidrio */}

        <rect
          x={hoja2X + (glassInset - offset)}
          y={top + glassInset}
          width={hojaAncho - glassInset * 1.5}
          height={alto - glassInset * 2}
          stroke="rgba(0,0,0,0.18)"
          strokeWidth={1}
          fill="none"
        />
      </g>
      {/* HOJA DERECHA */}

      <g className="transition-all duration-300 hover:opacity-90">
        <rect
          x={hoja3X}
          y={top + offset}
          width={hojaAncho - offset * 1.5}
          height={alto - offset * 2}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={strokeWidth}
          fill="rgba(255,255,255,0.01)"
          className="transition-all duration-300 hover:stroke-white"
        />

        {/* Perfil izquierdo */}

        <rect
          x={hoja3X}
          y={top + offset}
          width={perfilAncho}
          height={alto - offset * 2}
          fill="url(#aluminumGradient)"
        />

        {/* Contravidrio */}

        <rect
          x={hoja3X + (glassInset - offset)}
          y={top + glassInset}
          width={hojaAncho - glassInset * 1.5}
          height={alto - glassInset * 2}
          stroke="rgba(0,0,0,0.18)"
          strokeWidth={1}
          fill="none"
        />
      </g>
    </>
  );
}
