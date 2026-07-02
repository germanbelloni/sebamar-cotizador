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
        min-h-[340px]
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

  const TechnicalInfo = () => (
    <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
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

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          Vista exterior
        </div>

        <div className="mt-2 text-lg font-semibold text-white">
          Elegí la apertura
        </div>
      </div>

      {/* SIMPLE */}
      {config.tipoConfiguracion === "simple" && (
        <div className="grid grid-cols-2 gap-4">
          <Card
            selected={config.mano === "izquierda"}
            onClick={() => setMano("izquierda")}
          >
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <div className="rounded-full bg-lime-400 px-3 py-1 text-xs font-bold text-black">
                IZQUIERDA
              </div>

              <div className="flex h-[200px] w-[120px] items-center justify-center rounded-xl border-2 border-white/40">
                <span className="text-6xl text-lime-400">↶</span>
              </div>
            </div>
          </Card>

          <Card
            selected={config.mano === "derecha"}
            onClick={() => setMano("derecha")}
          >
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <div className="rounded-full bg-lime-400 px-3 py-1 text-xs font-bold text-black">
                DERECHA
              </div>

              <div className="flex h-[200px] w-[120px] items-center justify-center rounded-xl border-2 border-white/40">
                <span className="text-6xl text-lime-400">↷</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* DOBLE */}
      {config.tipoConfiguracion === "doble" && (
        <div className="grid grid-cols-2 gap-4">
          <Card
            selected={config.mano === "izquierda"}
            onClick={() => setMano("izquierda")}
          >
            <div className="space-y-4">
              <div className="text-center font-semibold">
                Principal izquierda
              </div>

              <div className="flex h-[220px] border-2 border-white/40">
                <div className="flex w-1/2 items-center justify-center border-r border-white/20 text-5xl text-lime-400">
                  ↶
                </div>
                <div className="flex w-1/2 items-center justify-center text-5xl text-lime-400">
                  ↷
                </div>
              </div>
            </div>
          </Card>

          <Card
            selected={config.mano === "derecha"}
            onClick={() => setMano("derecha")}
          >
            <div className="space-y-4">
              <div className="text-center font-semibold">Principal derecha</div>

              <div className="flex h-[220px] border-2 border-white/40">
                <div className="flex w-1/2 items-center justify-center border-r border-white/20 text-5xl text-lime-400">
                  ↶
                </div>
                <div className="flex w-1/2 items-center justify-center text-5xl text-lime-400">
                  ↷
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* PUERTA Y MEDIA */}
      {config.tipoConfiguracion === "puerta_y_media" && (
        <div className="grid grid-cols-2 gap-4">
          <Card
            selected={config.mano === "izquierda"}
            onClick={() => setMano("izquierda")}
          >
            <div className="space-y-4">
              <div className="text-center font-semibold">
                Principal izquierda
              </div>

              <div className="flex h-[220px] border-2 border-white/40">
                <div className="flex w-[66%] items-center justify-center border-r border-white/20 text-5xl text-lime-400">
                  ↶
                </div>

                <div className="flex w-[34%] items-center justify-center text-4xl text-lime-400">
                  ↷
                </div>
              </div>
            </div>
          </Card>

          <Card
            selected={config.mano === "derecha"}
            onClick={() => setMano("derecha")}
          >
            <div className="space-y-4">
              <div className="text-center font-semibold">Principal derecha</div>

              <div className="flex h-[220px] border-2 border-white/40">
                <div className="flex w-[34%] items-center justify-center border-r border-white/20 text-4xl text-lime-400">
                  ↶
                </div>

                <div className="flex w-[66%] items-center justify-center text-5xl text-lime-400">
                  ↷
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      <TechnicalInfo />
    </div>
  );
}
