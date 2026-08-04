type Props = {
  left: number;
  top: number;

  ancho: number;
  alto: number;

  color: string;

  tipoConstruccion?: "2_hojas" | "3_hojas_2_guias" | "3_hojas_3_guias";
};

export function RielInferior({
  left,
  top,
  ancho,
  alto,
  color,
  tipoConstruccion = "2_hojas",
}: Props) {
  const canales = tipoConstruccion === "3_hojas_3_guias" ? 3 : 2;

  const canalAncho = canales === 2 ? ancho / 2 - 18 : ancho / 3 - 14;

  return (
    <>
      {/* BASE */}

      <rect
        x={left - 2}
        y={top + alto - 6}
        width={ancho + 4}
        height={12}
        rx={2}
        fill={color}
      />

      {/* CANALES */}

      {[...Array(canales)].map((_, i) => (
        <rect
          key={i}
          x={
            canales === 2
              ? left + (i === 0 ? 10 : ancho / 2 + 8)
              : left + 8 + i * (ancho / 3)
          }
          y={top + alto - 2}
          width={canalAncho}
          height={2}
          fill="rgba(0,0,0,0.30)"
        />
      ))}

      {/* BRILLO */}

      <rect
        x={left}
        y={top + alto - 5}
        width={ancho}
        height={1}
        fill="rgba(255,255,255,0.12)"
      />
    </>
  );
}
