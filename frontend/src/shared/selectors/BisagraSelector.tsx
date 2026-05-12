import type { RajaBisagra } from "@/features/rajas/types";

type Props = {
  value?: RajaBisagra;

  onChange: (value: RajaBisagra) => void;
};

export function BisagraSelector({ value = "izquierda", onChange }: Props) {
  const ladoIzquierdo = value === "izquierda";

  const handleToggle = () => {
    onChange(ladoIzquierdo ? "derecha" : "izquierda");
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="
        flex items-center justify-between

        w-[340px]

        rounded-3xl

        border border-white/10

        bg-white/[0.03]

        px-6 py-5

        transition-all duration-300

        hover:border-white/20
        hover:bg-white/[0.05]
      "
    >
      <div className="flex flex-col items-start">
        <span className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
          Bisagra
        </span>

        <span className="mt-2 text-xl font-semibold text-white">
          {ladoIzquierdo ? "Izquierda" : "Derecha"}
        </span>
      </div>

      {/* SWITCH */}

      <div
        className={`
          relative

          h-10 w-24

          rounded-full

          transition-all duration-300

          ${ladoIzquierdo ? "bg-emerald-500/80" : "bg-red-500/80"}
        `}
      >
        <div
          className={`
            absolute top-1

            h-8 w-8

            rounded-full

            bg-white

            shadow-xl

            transition-all duration-300

            ${ladoIzquierdo ? "left-1" : "left-[60px]"}
          `}
        />
      </div>
    </button>
  );
}
