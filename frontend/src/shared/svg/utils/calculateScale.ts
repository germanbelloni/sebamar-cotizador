export function calculateScale(ancho: number, alto: number, maxSize = 250) {
  return maxSize / Math.max(ancho, alto);
}
