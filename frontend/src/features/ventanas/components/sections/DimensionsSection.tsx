import { motion } from "framer-motion";
type Props = {
  anchoInput: string;

  altoInput: string;

  anchoValido: boolean;

  altoValido: boolean;

  anchoMin: number;

  anchoMax: number;

  altoMin: number;

  altoMax: number;

  onAnchoChange: (value: string) => void;

  onAltoChange: (value: string) => void;
};

export function DimensionsSection({
  anchoInput,
  altoInput,

  anchoValido,
  altoValido,

  anchoMin,
  anchoMax,

  altoMin,
  altoMax,

  onAnchoChange,
  onAltoChange,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* ANCHO */}

      <div>
        <label
          className="
            mb-2 block text-sm
            text-muted-foreground
          "
        >
          Ancho
        </label>

        <motion.input
          type="text"
          inputMode="numeric"
          value={anchoInput}
          whileFocus={{
            scale: 1.02,
          }}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");

            onAnchoChange(value);
          }}
          className={`
            w-full rounded-xl
            border
            px-4 py-2
            transition-all
            focus:outline-none
focus:ring-2
focus:ring-[#39FF14]/40
focus:shadow-[0_0_20px_rgba(57,255,20,0.25)]

            ${
              anchoValido
                ? "border-white/10 bg-zinc-900 focus:border-white/20"
                : "border-red-500/60 bg-red-500/5 text-red-200"
            }
          `}
        />

        {!anchoValido && (
          <p className="mt-2 text-xs text-red-300">
            El ancho debe estar entre {anchoMin} y {anchoMax} cm
          </p>
        )}
      </div>

      {/* ALTO */}

      <div>
        <label
          className="
            mb-2 block text-sm
            text-muted-foreground
          "
        >
          Alto
        </label>

        <motion.input
          type="text"
          inputMode="numeric"
          value={altoInput}
          whileFocus={{
            scale: 1.02,
          }}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");

            onAltoChange(value);
          }}
          className={`
            w-full rounded-xl
            border
            px-4 py-2
            transition-all
            focus:outline-none
focus:ring-2
focus:ring-[#39FF14]/40
focus:shadow-[0_0_20px_rgba(57,255,20,0.25)]

            ${
              altoValido
                ? "border-white/10 bg-zinc-900 focus:border-white/20"
                : "border-red-500/60 bg-red-500/5 text-red-200"
            }
          `}
        />

        {!altoValido && (
          <p className="mt-2 text-xs text-red-300">
            El alto debe estar entre {altoMin} y {altoMax} cm
          </p>
        )}
      </div>
    </div>
  );
}
