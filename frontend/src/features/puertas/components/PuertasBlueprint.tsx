import type { PuertasConfig } from "../types";
import { necesitaDobleTravesano } from "../utils/portonRules";

type Props = {
  config: PuertasConfig;
  onChange: React.Dispatch<React.SetStateAction<PuertasConfig>>;
};

export function PuertasBlueprint({ config, onChange }: Props) {
  function setMano(
    mano: "izquierda" | "derecha" | "medio-izquierda" | "medio-derecha",
  ) {
    onChange((prev) => ({
      ...prev,
      mano,
      hojaPrincipal:
        mano === "izquierda"
          ? 1
          : mano === "medio-izquierda"
            ? 2
            : mano === "medio-derecha"
              ? 3
              : 4,
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

  function renderPorton(
    side: "izquierda" | "derecha" | "medio-izquierda" | "medio-derecha",
  ) {
    const hojas = config.tipoConfiguracion === "porton" ? config.hojas || 3 : 1;

    const mostrarDobleTravesano = necesitaDobleTravesano(config);

    return (
      <div className="relative flex h-[220px] border-2 border-white/40 bg-black/40">
        {mostrarDobleTravesano && (
          <>
            <div className="absolute left-0 right-0 top-[34%] h-[2px] bg-zinc-400" />
            <div className="absolute left-0 right-0 top-[66%] h-[2px] bg-zinc-400" />
          </>
        )}
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
            // Portón con barra antipánico:
            // la puerta de escape siempre es la hoja central.
            if (config.extras.barraAntipanico === 1 && hojas === 3) {
              symbol = "";

              if (i === 1) {
                symbol = side === "izquierda" ? "↶" : "↷";
              }
            } else {
              if (hojas === 3) {
                switch (side) {
                  case "izquierda":
                    symbol = i === 0 ? "↶" : "";
                    break;

                  case "derecha":
                    symbol = i === 2 ? "↷" : "";
                    break;

                  case "medio-izquierda":
                    symbol = i === 1 ? "↶" : "";
                    break;

                  case "medio-derecha":
                    symbol = i === 1 ? "↷" : "";
                    break;
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
          }

          const mostrarBarra =
            config.tipoPorton === "abrir" &&
            config.hojas === 3 &&
            config.extras.barraAntipanico === 1 &&
            i === 1;

          return (
            <div
              key={i}
              className="relative flex flex-1 items-center justify-center border-r border-white/20 text-5xl last:border-r-0"
            >
              {mostrarBarra && (
                <div className="absolute top-[68%] left-1/2 h-[6px] w-[40px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              )}

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
        <div
          className={`text-xs uppercase tracking-[0.25em] ${
            config.extras.barraAntipanico
              ? "font-bold text-red-500"
              : "text-zinc-500"
          }`}
        >
          {config.extras.barraAntipanico
            ? "🔴 VISTA INTERIOR"
            : "VISTA EXTERIOR"}
        </div>

        <div className="text-xl font-semibold text-white">
          Elegí la apertura
        </div>
        {!!config.extras.barraAntipanico && (
          <div className="mx-auto max-w-xl rounded-2xl border border-red-500/40 bg-red-500/10 px-5 py-3 text-center text-sm text-red-300">
            <strong>IMPORTANTE:</strong> para configurar una barra antipánico la
            representación cambia automáticamente a la{" "}
            <strong>vista interior</strong>, ya que este herraje siempre se
            instala del lado interno de la puerta.
          </div>
        )}
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
                <div className="relative flex h-full w-full items-center justify-center">
                  {config.extras.barraAntipanico === 1 && (
                    <div
                      className={`
      absolute top-[68%] h-[6px] w-[54px] -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]
     ${config.extras.barraAntipanicoLado === "izquierda" ? "left-8" : "right-8"}
    `}
                    />
                  )}

                  <span className="text-7xl leading-none text-lime-400">↶</span>
                </div>
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
                <div className="relative flex h-full w-full items-center justify-center">
                  {config.extras.barraAntipanico === 1 && (
                    <div
                      className={`
      absolute top-[68%] h-[6px] w-[54px] -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]
     ${config.extras.barraAntipanicoLado === "izquierda" ? "left-8" : "right-8"}
    `}
                    />
                  )}

                  <span className="text-7xl leading-none text-lime-400">↷</span>
                </div>
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
                <div className="relative flex w-1/2 items-center justify-center border-r border-white/20 text-6xl text-lime-400">
                  {(config.extras.barraAntipanico === 1 ||
                    config.extras.barraAntipanico === 2) && (
                    <div className="absolute top-[68%] left-[32%] h-[6px] w-[54px] -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  )}
                  ↶
                </div>

                <div className="relative flex w-1/2 items-center justify-center text-6xl text-zinc-500">
                  {config.extras.barraAntipanico === 2 && (
                    <div className="absolute top-[68%] right-32%] h-[6px] w-[54px] -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  )}
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
                <div className="relative flex w-1/2 items-center justify-center border-r border-white/20 text-6xl text-zinc-500">
                  {config.extras.barraAntipanico === 2 && (
                    <div className="absolute top-[68%] left-[32%] h-[6px] w-[54px] -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  )}
                  ↶
                </div>

                <div className="relative flex w-1/2 items-center justify-center text-6xl text-lime-400">
                  {(config.extras.barraAntipanico === 1 ||
                    config.extras.barraAntipanico === 2) && (
                    <div className="absolute top-[68%] right-[32%] h-[6px] w-[54px] -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  )}
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
                <div className="relative flex w-[66%] items-center justify-center border-r border-white/20 text-6xl text-lime-400">
                  {config.extras.barraAntipanico === 1 && (
                    <div className="absolute top-[68%] left-[32%] h-[6px] w-[54px] -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  )}
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

                <div className="relative flex w-[66%] items-center justify-center text-6xl text-lime-400">
                  {config.extras.barraAntipanico === 1 && (
                    <div className="absolute top-[68%] right-[32%] h-[6px] w-[54px] -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  )}
                  ↷
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
      {/* PORTON */}
      {config.tipoConfiguracion === "porton" && (
        <>
          {config.tipoPorton === "abrir" &&
          config.extras.barraAntipanico &&
          config.hojas >= 4 ? (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-8 text-center">
              <div className="text-xl font-semibold text-red-400">
                Configuración especial
              </div>

              <p className="mt-3 text-zinc-300">
                Los portones de <strong>{config.hojas} hojas</strong> con barra
                antipánico requieren una configuración manual.
              </p>

              <div className="mt-5 rounded-xl border border-red-500/30 bg-black/20 p-4">
                <p className="text-lg font-bold uppercase tracking-wider text-red-300">
                  CONSULTAR
                </p>
              </div>
            </div>
          ) : config.hojas === 3 ? (
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

              <Card
                selected={config.mano === "medio-izquierda"}
                onClick={() => setMano("medio-izquierda")}
              >
                <div className="space-y-5">
                  <div className="text-center text-sm font-bold text-lime-400">
                    PUERTA AL MEDIO IZQUIERDA
                  </div>

                  {renderPorton("medio-izquierda")}
                </div>
              </Card>

              <Card
                selected={config.mano === "medio-derecha"}
                onClick={() => setMano("medio-derecha")}
              >
                <div className="space-y-5">
                  <div className="text-center text-sm font-bold text-lime-400">
                    PUERTA AL MEDIO DERECHA
                  </div>

                  {renderPorton("medio-derecha")}
                </div>
              </Card>
            </div>
          ) : (
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
        </>
      )}

      <TechnicalInfo />
    </div>
  );
}
