export function generateLamas(altoView: number) {
  const cantidad = Math.floor(altoView / 12);

  return Array.from({ length: cantidad });
}
