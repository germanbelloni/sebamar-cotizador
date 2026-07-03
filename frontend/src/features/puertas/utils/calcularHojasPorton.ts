export function calcularHojasPorton(ancho: number) {
  const hojas = Math.ceil(ancho / 90);

  return Math.max(3, Math.min(6, hojas));
}
