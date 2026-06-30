type Mano = "izquierda" | "derecha";

type Props = {
  value?: Mano;
  onChange: (value: Mano) => void;
};

export function ManoSelector({ value = "izquierda", onChange }: Props) {
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
      "
    >
      <div className="flex flex-col items-start">
        <span className="text-xl font-semibold text-white">
          {ladoIzquierdo ? "Izquierda" : "Derecha"}
        </span>
      </div>

      <div
        className={`
          flex
          h-11
          w-24
          items-center
          rounded-full
          px-1.5
          border border-[#39FF14]/30
          bg-[#39FF14]/15
          shadow-[0_0_18px_rgba(57,255,20,0.18)]
          ${ladoIzquierdo ? "justify-start" : "justify-end"}
        `}
      >
        <div
          className="
            h-8
            w-8
            rounded-full
            bg-white
            shadow-lg
          "
        />
      </div>
    </button>
  );
}
