export function getAnchoRajaVisual(ancho: number) {
  if (ancho <= 40) return 40;
  if (ancho <= 50) return 50;
  return 60;
}
