import type { PuertasConfig } from "../types";

type Props = {
  config: PuertasConfig;
  onChange: React.Dispatch<React.SetStateAction<PuertasConfig>>;
};

export function PuertasBlueprint({ config, onChange }: Props) {
  function setMano(mano: "izquierda" | "derecha") {
    onChange((prev) => ({
      ...prev,
      mano,
    }));
  }

  const Card = ({
    selected,
    children,
    onClick,
  }: {
    selected: boolean;
    children: React.ReactNode;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-3xl border p-5 transition-all duration-300
        min-h-[430px] w-full
        ${
          selected
            ? `
              border-[#39FF14]
              bg-[#39FF14]/[0.08]
              shadow-[0_0_40px_rgba(57,255,20,0.20)]
            `
            : `
              border-white/10
              bg-zinc-900
              hover:border-[#39FF14]/30
              hover:bg-zinc-800
            `
        }
      `}
    >
      {children}
    </button>
  );

  const DoorFrame = ({
    children,
    width = "w-[120px]",
  }: {
    children: React.ReactNode;
    width?: string;
  }) => (
    <div
      className={`
        relative ${width} h-[220px]
        rounded-xl border-2 border-white/40
        bg-black/40
      `}
    >
      <div className="absolute inset-2 rounded border border-white/10" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-zinc-500">
        {config.ancho} × {config.alto}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );

  const TechnicalInfo = () => (
    <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-zinc-500">Línea:</span>{" "}
          <span className="font-semibold capitalize">{config.linea}</span>
        </div>

        <div>
          <span className="text-zinc-500">Vidrio:</span>{" "}
          <span className="font-semibold">{config.vidrio || "-"}</span>
        </div>

        <div>
          <span className="text-zinc-500">Color:</span>{" "}
          <span className="font-semibold capitalize">{config.color}</span>
        </div>

        <div>
          <span className="text-zinc-500">Medidas:</span>{" "}
          <span className="font-semibold">
            {config.ancho} × {config.alto}
          </span>
        </div>
      </div>
    </div>
  );

  function renderPorton(side: "izquierda" | "derecha") {
    const hojas = config.tipoConfiguracion === "porton" ? config.hojas || 3 : 1;

    return (
      <div className="flex h-[220px] border-2 border-white/40 bg-black/40">
        {Array.from({ length: hojas }).map((_, i) => {
          let symbol = "";
          const isFirst = i === 0;
          const isLast = i === hojas - 1;

          if (config.tipoPorton === "plegadizo") {
            if (side === "izquierda") {
              symbol = isFirst ? "↶" : "→";
            } else {
              symbol = isLast ? "↷" : "←";
            }
          }

          if (config.tipoPorton === "corredizo") {
            if (side === "izquierda") {
              // Corre hacia izquierda
              symbol = isFirst ? "↷" : "←";
            } else {
              // Corre hacia derecha
              symbol = isLast ? "↶" : "→";
            }
          }

          if (config.tipoPorton === "abrir") {
            if (hojas === 3) {
              if (side === "izquierda") {
                symbol = i === 0 ? "↶" : "";
              } else {
                symbol = i === 2 ? "↷" : "";
              }
            }

            if (hojas === 4) {
              if (side === "izquierda") {
                if (i === 0 || i === 1) {
                  symbol = "↶";
                }
              } else {
                if (i === 2 || i === 3) {
                  symbol = "↷";
                }
              }
            }
          }

          return (
            <div
              key={i}
              className="flex flex-1 items-center justify-center border-r border-white/20 text-5xl last:border-r-0"
            >
              <span
                className={
                  symbol.includes("↶") || symbol.includes("↷")
                    ? "text-lime-400"
                    : "text-zinc-500"
                }
              >
                {symbol}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3 text-center">
        <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          Vista exterior
        </div>

        <div className="text-xl font-semibold text-white">
          Elegí la apertura
        </div>

        {config.tipoConfiguracion === "porton" && (
          <div className="mx-auto inline-flex items-center gap-3 rounded-2xl border border-lime-400/20 bg-lime-400/10 px-4 py-2">
            <span className="text-xs uppercase tracking-wider text-zinc-400">
              Sistema
            </span>

            <span className="font-bold text-lime-400 uppercase">
              {config.tipoPorton}
            </span>

            <span className="text-zinc-600">•</span>

            <span className="font-semibold text-white">
              {config.hojas} hojas
            </span>
          </div>
        )}
      </div>

      {/* SIMPLE */}
      {config.tipoConfiguracion === "simple" && (
        <div className="grid grid-cols-2 gap-5">
          <Card
            selected={config.mano === "izquierda"}
            onClick={() => setMano("izquierda")}
          >
            <div className="flex h-full flex-col items-center justify-center gap-5">
              <div className="rounded-full bg-lime-400 px-4 py-1 text-xs font-bold text-black">
                APERTURA IZQUIERDA
              </div>

              <DoorFrame>
                <span className="text-7xl text-lime-400">↶</span>
              </DoorFrame>
            </div>
          </Card>

          <Card
            selected={config.mano === "derecha"}
            onClick={() => setMano("derecha")}
          >
            <div className="flex h-full flex-col items-center justify-center gap-5">
              <div className="rounded-full bg-lime-400 px-4 py-1 text-xs font-bold text-black">
                APERTURA DERECHA
              </div>

              <DoorFrame>
                <span className="text-7xl text-lime-400">↷</span>
              </DoorFrame>
            </div>
          </Card>
        </div>
      )}

      {/* DOBLE */}
      {config.tipoConfiguracion === "doble" && (
        <div className="grid grid-cols-2 gap-5">
          <Card
            selected={config.mano === "izquierda"}
            onClick={() => setMano("izquierda")}
          >
            <div className="space-y-5">
              <div className="text-center text-sm font-bold text-lime-400">
                PRINCIPAL IZQUIERDA
              </div>

              <div className="flex h-[220px] border-2 border-white/40 bg-black/40">
                <div className="flex w-1/2 items-center justify-center border-r border-white/20 text-6xl text-lime-400">
                  ↶
                </div>
                <div className="flex w-1/2 items-center justify-center text-6xl text-zinc-500">
                  ↷
                </div>
              </div>
            </div>
          </Card>

          <Card
            selected={config.mano === "derecha"}
            onClick={() => setMano("derecha")}
          >
            <div className="space-y-5">
              <div className="text-center text-sm font-bold text-lime-400">
                PRINCIPAL DERECHA
              </div>

              <div className="flex h-[220px] border-2 border-white/40 bg-black/40">
                <div className="flex w-1/2 items-center justify-center border-r border-white/20 text-6xl text-zinc-500">
                  ↶
                </div>
                <div className="flex w-1/2 items-center justify-center text-6xl text-lime-400">
                  ↷
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* PUERTA Y MEDIA */}
      {config.tipoConfiguracion === "puerta_y_media" && (
        <div className="grid grid-cols-2 gap-5">
          <Card
            selected={config.mano === "izquierda"}
            onClick={() => setMano("izquierda")}
          >
            <div className="space-y-5">
              <div className="text-center text-sm font-bold text-lime-400">
                PRINCIPAL IZQUIERDA
              </div>

              <div className="flex h-[220px] border-2 border-white/40 bg-black/40">
                <div className="flex w-[66%] items-center justify-center border-r border-white/20 text-6xl text-lime-400">
                  ↶
                </div>
                <div className="flex w-[34%] items-center justify-center text-4xl text-zinc-500">
                  ↷
                </div>
              </div>
            </div>
          </Card>

          <Card
            selected={config.mano === "derecha"}
            onClick={() => setMano("derecha")}
          >
            <div className="space-y-5">
              <div className="text-center text-sm font-bold text-lime-400">
                PRINCIPAL DERECHA
              </div>

              <div className="flex h-[220px] border-2 border-white/40 bg-black/40">
                <div className="flex w-[34%] items-center justify-center border-r border-white/20 text-4xl text-zinc-500">
                  ↶
                </div>
                <div className="flex w-[66%] items-center justify-center text-6xl text-lime-400">
                  ↷
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* PORTON */}
      {config.tipoConfiguracion === "porton" && (
        <div className="grid grid-cols-2 gap-5">
          <Card
            selected={config.mano === "izquierda"}
            onClick={() => setMano("izquierda")}
          >
            <div className="space-y-5">
              <div className="text-center text-sm font-bold text-lime-400">
                APERTURA IZQUIERDA
              </div>

              {renderPorton("izquierda")}
            </div>
          </Card>

          <Card
            selected={config.mano === "derecha"}
            onClick={() => setMano("derecha")}
          >
            <div className="space-y-5">
              <div className="text-center text-sm font-bold text-lime-400">
                APERTURA DERECHA
              </div>

              {renderPorton("derecha")}
            </div>
          </Card>
        </div>
      )}

      <TechnicalInfo />
    </div>
  );
}
