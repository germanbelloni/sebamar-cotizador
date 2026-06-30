import type { PortonMano, PortonHojaPrincipal } from "../types";

type Props = {
  hojas: 3 | 4 | 5 | 6;
  mano: PortonMano;
  hojaPrincipal: PortonHojaPrincipal;
  onChange: (data: {
    mano: PortonMano;
    hojaPrincipal: PortonHojaPrincipal;
  }) => void;
};

export function PortonBlueprintSelector({
  hojas,
  mano,
  hojaPrincipal,
  onChange,
}: Props) {
  const hojasArray = Array.from({ length: hojas }, (_, i) => i + 1);

  function hojaHabilitada(hoja: number) {
    if (hojas === 3) {
      if (mano === "izquierda") {
        return hoja === 1 || hoja === 2;
      }

      if (mano === "derecha") {
        return hoja === 2 || hoja === 3;
      }
    }

    if (hojas === 4) {
      if (mano === "izquierda") {
        if (true) {
          return hoja === 1 || hoja === 2;
        }
      }

      if (mano === "derecha") {
        return hoja === 3 || hoja === 4;
      }
    }

    return true;
  }

  function handleChangeMano(nuevaMano: PortonMano) {
    let nuevaHoja = hojaPrincipal;

    if (hojas === 3) {
      if (nuevaMano === "izquierda" && hojaPrincipal === 3) {
        nuevaHoja = 2;
      }

      if (nuevaMano === "derecha" && hojaPrincipal === 1) {
        nuevaHoja = 2;
      }
    }

    onChange({
      mano: nuevaMano,
      hojaPrincipal: nuevaHoja,
    });
  }

  return (
    <div className="space-y-5">
      {/* MANO */}
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => handleChangeMano("izquierda")}
          className={`
            rounded-xl border px-4 py-2 text-sm font-semibold transition-all
            ${
              mano === "izquierda"
                ? "border-lime-400 bg-lime-400/10 text-lime-300"
                : "border-border bg-card"
            }
          `}
        >
          ← Apertura izquierda
        </button>

        <button
          type="button"
          onClick={() => handleChangeMano("derecha")}
          className={`
            rounded-xl border px-4 py-2 text-sm font-semibold transition-all
            ${
              mano === "derecha"
                ? "border-lime-400 bg-lime-400/10 text-lime-300"
                : "border-border bg-card"
            }
          `}
        >
          Apertura derecha →
        </button>
      </div>

      {/* BLUEPRINT */}
      <div className="rounded-2xl border border-border bg-black/20 p-5">
        <div className="flex h-40 gap-2">
          {hojasArray.map((hoja) => {
            const selected = hoja === hojaPrincipal;
            const enabled = hojaHabilitada(hoja);

            return (
              <button
                key={hoja}
                type="button"
                disabled={!enabled}
                onClick={() => {
                  if (!enabled) return;

                  onChange({
                    mano,
                    hojaPrincipal: hoja as PortonHojaPrincipal,
                  });
                }}
                className={`
                  relative flex-1 rounded-lg border transition-all
                  ${
                    !enabled
                      ? "cursor-not-allowed border-zinc-800 bg-zinc-900/20 opacity-30"
                      : selected
                        ? "border-lime-400 bg-lime-400/15"
                        : "border-zinc-700 bg-zinc-900/60 hover:border-zinc-500"
                  }
                `}
              >
                {/* Marco */}
                <div className="absolute inset-2 rounded border border-white/20" />

                {/* Tirador */}
                <div
                  className={`
                    absolute top-1/2 h-10 w-[4px] -translate-y-1/2 rounded-full bg-white/70
                    ${mano === "izquierda" ? "right-3" : "left-3"}
                  `}
                />

                {/* Numero */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-zinc-400">
                  Hoja {hoja}
                </div>

                {selected && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full bg-lime-400 px-2 py-1 text-[10px] font-bold text-black">
                    PRINCIPAL
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-center text-xs text-zinc-500">
        Elegí la apertura y tocá la hoja principal
      </p>
    </div>
  );
}
