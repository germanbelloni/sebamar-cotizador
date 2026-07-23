import { SelectableCard } from "@/components/ui/selectable-card";
type Props = {
  barralRecto?: number;
  barralCurvo?: number;

  picaporte?: boolean;
  mediaManija?: boolean;

  barraAntipanico?: number;

  tipoConfiguracion?: "simple" | "doble" | "puerta_y_media" | "porton";
  tipoPorton?: "abrir" | "corredizo" | "plegadizo";

  premarco?: boolean;
  contramarco?: boolean;
  linea?: string;

  onToggleBarralRecto: () => void;
  onToggleBarralCurvo: () => void;
  onTogglePicaporte: () => void;
  onToggleMediaManija: () => void;

  onSelectBarraAntipanico: (
    cantidad: 0 | 1 | 2,
    lado: "izquierda" | "derecha" | "ambas",
  ) => void;

  onTogglePremarco: () => void;
  onToggleContramarco: () => void;
};

export function PuertasExtrasSection({
  barralRecto,
  barralCurvo,
  picaporte,
  mediaManija,

  barraAntipanico,
  tipoConfiguracion,
  tipoPorton,

  premarco,
  contramarco,
  linea,

  onToggleBarralRecto,
  onToggleBarralCurvo,
  onTogglePicaporte,
  onToggleMediaManija,

  onSelectBarraAntipanico,

  onTogglePremarco,
  onToggleContramarco,
}: Props) {
  const tieneBarral = !!barralRecto || !!barralCurvo;

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* BARRAL RECTO */}
      <SelectableCard selected={!!barralRecto} onClick={onToggleBarralRecto}>
        <div className="space-y-2">
          <div
            className="
              flex
              h-16
              items-center
              justify-center
              rounded-xl
              border border-white/5
              bg-black/20
            "
          >
            <div
              className="
                h-10
                w-[6px]
                rounded-full
                bg-white/80
              "
            />
          </div>

          <div className="text-sm font-medium">Barral recto</div>
        </div>
      </SelectableCard>

      {/* BARRAL CURVO */}
      <SelectableCard selected={!!barralCurvo} onClick={onToggleBarralCurvo}>
        <div className="space-y-2">
          <div
            className="
              flex
              h-16
              items-center
              justify-center
              rounded-xl
              border border-white/5
              bg-black/20
            "
          >
            <svg width="42" height="42">
              <path
                d="M 28 6 Q 6 20 28 36"
                fill="none"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="text-sm font-medium">Barral curvo</div>
        </div>
      </SelectableCard>

      {/* MEDIA MANIJA */}
      <SelectableCard
        disabled={!tieneBarral}
        selected={!!mediaManija}
        onClick={onToggleMediaManija}
      >
        <div className="space-y-2">
          <div
            className="
              flex
              h-16
              items-center
              justify-center
              rounded-xl
              border border-white/5
              bg-black/20
            "
          >
            <div
              className="
                h-6
                w-[5px]
                rounded-full
                bg-white/80
              "
            />
          </div>

          <div className="text-sm font-medium">Media manija</div>
        </div>
      </SelectableCard>

      {/* PICAPORTE */}
      <SelectableCard
        disabled={tieneBarral}
        selected={!!picaporte}
        onClick={onTogglePicaporte}
      >
        <div className="space-y-2">
          <div
            className="
              flex
              h-16
              items-center
              justify-center
              rounded-xl
              border border-white/5
              bg-black/20
            "
          >
            <svg width="52" height="28">
              <rect
                x="10"
                y="12"
                width="24"
                height="4"
                rx="999"
                fill="rgba(255,255,255,0.8)"
              />
              <circle cx="38" cy="14" r="4" fill="rgba(255,255,255,0.8)" />
            </svg>
          </div>

          <div className="text-sm font-medium">Picaporte</div>
        </div>
      </SelectableCard>

      {/* BARRA ANTIPÁNICO */}
      {(tipoConfiguracion !== "porton" || tipoPorton === "abrir") && (
        <>
          <SelectableCard
            selected={!!barraAntipanico}
            onClick={() => {
              if (barraAntipanico) {
                onSelectBarraAntipanico(0, "izquierda");
              } else {
                onSelectBarraAntipanico(1, "izquierda");
              }
            }}
          >
            <div className="space-y-2">
              <div
                className="
            flex
            h-16
            items-center
            justify-center
            rounded-xl
            border border-white/5
            bg-black/20
          "
              >
                <svg width="60" height="28">
                  <line
                    x1="10"
                    y1="14"
                    x2="50"
                    y2="14"
                    stroke="rgba(255,255,255,0.85)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <circle cx="10" cy="14" r="3" fill="rgba(255,255,255,0.85)" />
                  <circle cx="50" cy="14" r="3" fill="rgba(255,255,255,0.85)" />
                </svg>
              </div>

              <div className="text-sm font-medium">Barra antipánico</div>
            </div>
          </SelectableCard>

          {/* Celda vacía para mantener alineados Premarco y Contramarco */}
          {linea === "modena" && <div />}
        </>
      )}

      {barraAntipanico ? (
        <div className="col-span-2 rounded-2xl border border-lime-400/20 bg-lime-400/5 p-4 space-y-4">
          <div className="text-sm font-semibold text-lime-400">
            Configuración barra antipánico
          </div>

          {tipoConfiguracion === "doble" && (
            <div className="grid grid-cols-2 gap-3">
              <SelectableCard
                selected={barraAntipanico === 1}
                onClick={() => onSelectBarraAntipanico(1, "izquierda")}
              >
                <div className="text-center font-medium">Hoja principal</div>
              </SelectableCard>

              <SelectableCard
                selected={barraAntipanico === 2}
                onClick={() => onSelectBarraAntipanico(2, "ambas")}
              >
                <div className="text-center font-medium">Ambas hojas</div>
              </SelectableCard>
            </div>
          )}

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
            ⚠ La apertura y la barra antipánico se representan desde la
            <strong> vista interior</strong>.
          </div>
        </div>
      ) : null}
      {linea === "modena" && (
        <>
          <SelectableCard selected={!!premarco} onClick={onTogglePremarco}>
            <div className="flex h-full items-center justify-center text-sm font-medium">
              Premarco
            </div>
          </SelectableCard>

          <SelectableCard
            selected={!!contramarco}
            onClick={onToggleContramarco}
          >
            <div className="flex h-full items-center justify-center text-sm font-medium">
              Contramarco
            </div>
          </SelectableCard>
        </>
      )}
    </div>
  );
}
