type Props = {
  left: number;
  top: number;

  ancho: number;
  alto: number;

  tieneCortina: boolean;

  tipoConstruccion?: "2_hojas" | "3_hojas_2_guias" | "3_hojas_3_guias";
};

export function Guide({
  left,
  top,
  ancho,
  alto,
  tieneCortina,
  tipoConstruccion = "2_hojas",
}: Props) {
  const cantidadGuias = tipoConstruccion === "3_hojas_3_guias" ? 3 : 2;

  return (
    <>
      {/* SUPERIOR */}

      {tieneCortina && (
        <rect
          x={left - 8}
          y={top - 34}
          width={ancho + 16}
          height={14}
          rx={3}
          fill="rgba(113,113,122,0.28)"
          opacity={0.95}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={1}
        />
      )}

      {/* GUÍAS LATERALES */}

      {[0, 1, ...(cantidadGuias === 3 ? [2] : [])].map((i) => (
        <rect
          key={i}
          x={
            i === 0
              ? left - 28
              : i === 1
                ? left + ancho + 16
                : left + ancho + 32
          }
          y={top - 18}
          width={12}
          height={alto + 36}
          rx={3}
          fill="rgba(113,113,122,0.22)"
          opacity={0.95}
          stroke="rgba(255,255,255,0.05)"
          className="transition-all duration-500"
        />
      ))}
    </>
  );
}
