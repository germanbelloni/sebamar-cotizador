type Props = {
  left: number;
  top: number;

  ancho: number;
  alto: number;

  tieneCortina: boolean;
};

export function Guide({ left, top, ancho, alto, tieneCortina }: Props) {
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
          className="transition-all duration-500"
        />
      )}

      {/* IZQUIERDA */}

      <rect
        x={left - 28}
        y={top - 18}
        width={12}
        height={alto + 36}
        rx={3}
        fill="rgba(113,113,122,0.22)"
        opacity={0.95}
        className="transition-all duration-500"
        stroke="rgba(255,255,255,0.05)"
      />

      {/* DERECHA */}

      <rect
        x={left + ancho + 16}
        y={top - 18}
        width={12}
        height={alto + 36}
        rx={3}
        fill="rgba(113,113,122,0.22)"
        opacity={0.95}
        className="transition-all duration-500"
        stroke="rgba(255,255,255,0.05)"
      />
    </>
  );
}
