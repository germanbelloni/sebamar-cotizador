type LimitsMap = Record<
  string,
  {
    anchoMin: number;

    anchoMax: number;

    altoMin: number;

    altoMax: number;
  }
>;

type BaseConfig = {
  linea: string;

  ancho: number;

  alto: number;
};

type Params<T extends BaseConfig> = {
  setConfig: React.Dispatch<React.SetStateAction<T>>;

  limits: LimitsMap;
};

export function useLineaSwitcher<T extends BaseConfig>({
  setConfig,

  limits,
}: Params<T>) {
  const switchLinea = (linea: string) => {
    setConfig((prev) => {
      const nuevosLimites = limits[linea];

      return {
        ...prev,

        linea,

        ancho: Math.min(prev.ancho, nuevosLimites.anchoMax),

        alto: Math.min(prev.alto, nuevosLimites.altoMax),
      };
    });
  };

  return {
    switchLinea,
  };
}
