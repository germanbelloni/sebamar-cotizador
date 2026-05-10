type Limits = {
  anchoMax: number;

  altoMax: number;
};

type Params<T> = {
  setConfig: React.Dispatch<React.SetStateAction<T>>;

  limits: Record<string, Limits>;
};

export function useLineaSwitcher<
  T extends {
    linea: string;

    ancho: number;

    alto: number;
  },
>({
  setConfig,

  limits,
}: Params<T>) {
  function switchLinea(linea: string) {
    setConfig((prev) => ({
      ...prev,

      linea,

      ancho: Math.min(prev.ancho, limits[linea].anchoMax),

      alto: Math.min(prev.alto, limits[linea].altoMax),
    }));
  }

  return {
    switchLinea,
  };
}
