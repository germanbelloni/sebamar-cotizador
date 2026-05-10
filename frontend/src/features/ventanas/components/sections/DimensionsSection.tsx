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
    <div className="grid grid-cols-2 gap-5">
      {/* ANCHO */}

      <div className="space-y-3">
        <label
          className="
            block

            text-sm
            font-medium

            text-white/65
          "
        >
          Ancho
        </label>

        <motion.div
          whileFocus={{
            scale: 1.015,
          }}
          className={`
            group

            relative

            overflow-hidden

            rounded-2xl

            border

            backdrop-blur-xl

            transition-all
            duration-300

            ${
              anchoValido
                ? `
                  border-border

                  bg-white/[0.03]

                  focus-within:border-[#39FF14]/35

                  focus-within:shadow-[0_0_25px_rgba(57,255,20,0.18)]
                `
                : `
                  border-red-500/40

                  bg-red-500/[0.05]
                `
            }
          `}
        >
          {/* Glow */}

          <div
            className="
              pointer-events-none

              absolute inset-0

              opacity-0

              transition-opacity
              duration-300

              group-focus-within:opacity-100

              bg-gradient-to-br
              from-[#39FF14]/10
              to-transparent
            "
          />

          <input
            type="text"
            inputMode="numeric"
            value={anchoInput}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");

              onAnchoChange(value);
            }}
            className="
              relative z-10

              w-full

              bg-transparent

              px-5
              py-4

              text-xl
              font-semibold

              text-white

              outline-none

              placeholder:text-white/20
            "
          />
        </motion.div>

        {!anchoValido && (
          <p className="text-xs text-red-300">
            El ancho debe estar entre {anchoMin} y {anchoMax} cm
          </p>
        )}
      </div>

      {/* ALTO */}

      <div className="space-y-3">
        <label
          className="
            block

            text-sm
            font-medium

            text-white/65
          "
        >
          Alto
        </label>

        <motion.div
          whileFocus={{
            scale: 1.015,
          }}
          className={`
            group

            relative

            overflow-hidden

            rounded-2xl

            border

            backdrop-blur-xl

            transition-all
            duration-300

            ${
              altoValido
                ? `
                  border-border

                  bg-white/[0.03]

                  focus-within:border-[#39FF14]/35

                  focus-within:shadow-[0_0_25px_rgba(57,255,20,0.18)]
                `
                : `
                  border-red-500/40

                  bg-red-500/[0.05]
                `
            }
          `}
        >
          {/* Glow */}

          <div
            className="
              pointer-events-none

              absolute inset-0

              opacity-0

              transition-opacity
              duration-300

              group-focus-within:opacity-100

              bg-gradient-to-br
              from-[#39FF14]/10
              to-transparent
            "
          />

          <input
            type="text"
            inputMode="numeric"
            value={altoInput}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");

              onAltoChange(value);
            }}
            className="
              relative z-10

              w-full

              bg-transparent

              px-5
              py-4

              text-xl
              font-semibold

              text-white

              outline-none

              placeholder:text-white/20
            "
          />
        </motion.div>

        {!altoValido && (
          <p className="text-xs text-red-300">
            El alto debe estar entre {altoMin} y {altoMax} cm
          </p>
        )}
      </div>
    </div>
  );
}
