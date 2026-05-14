type Props = {
  left: number;

  top: number;

  anchoView: number;

  altoView: number;
};

export function GuideRails({ left, top, anchoView, altoView }: Props) {
  return (
    <>
      {/* IZQUIERDA */}

      <rect x={left - 12} y={top} width="8" height={altoView} fill="#52525B" />

      {/* DERECHA */}

      <rect
        x={left + anchoView + 4}
        y={top}
        width="8"
        height={altoView}
        fill="#52525B"
      />
    </>
  );
}
