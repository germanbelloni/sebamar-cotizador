type Limits = {
  anchoMin: number;

  anchoMax: number;

  altoMin: number;

  altoMax: number;
};

type Params = {
  ancho: number;

  alto: number;

  limits: Limits;
};

export function validateDimensions({
  ancho,

  alto,

  limits,
}: Params) {
  const anchoValido = ancho >= limits.anchoMin && ancho <= limits.anchoMax;

  const altoValido = alto >= limits.altoMin && alto <= limits.altoMax;

  return {
    anchoValido,

    altoValido,

    medidasValidas: anchoValido && altoValido,
  };
}
