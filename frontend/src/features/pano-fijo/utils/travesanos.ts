export function requiereTravesanoVertical(ancho: number, tipoVidrio: string) {
  const vidriosLaminados = ["3+3", "4+4"];

  return ancho > 150 && !vidriosLaminados.includes(tipoVidrio);
}

export function requiereTravesanoHorizontal(alto: number) {
  return alto > 200;
}
