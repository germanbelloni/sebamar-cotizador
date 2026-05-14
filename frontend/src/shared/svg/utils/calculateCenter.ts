export function calculateCenter(
  anchoView: number,
  altoView: number,
  canvasSize = 500,
) {
  return {
    left: canvasSize / 2 - anchoView / 2,

    top: canvasSize / 2 - altoView / 2,
  };
}
