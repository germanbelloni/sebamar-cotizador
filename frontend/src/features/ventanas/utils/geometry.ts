export function buildGeometry(ancho: number, alto: number) {
  const centerX = 250;
  const centerY = 250;

  return {
    centerX,
    centerY,

    left: centerX - ancho / 2,
    right: centerX + ancho / 2,

    top: centerY - alto / 2,
    bottom: centerY + alto / 2,
  };
}
