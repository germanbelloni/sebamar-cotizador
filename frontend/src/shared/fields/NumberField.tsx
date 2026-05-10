type Props = {
  label: string;

  value: number;

  min?: number;

  max?: number;

  step?: number;

  onChange: (value: number) => void;
};

export function NumberField({
  label,

  value,

  min,

  max,

  step = 1,

  onChange,
}: Props) {
  return (
    <div className="space-y-3">
      <label
        className="
          block

          text-sm
          font-medium

          text-white/70
        "
      >
        {label}
      </label>

      <div
        className="
          group

          relative

          overflow-hidden

          rounded-2xl

          border border-white/10

          bg-white/[0.03]

          backdrop-blur-xl

          transition-all
          duration-300

          focus-within:border-[#39FF14]/30

          focus-within:shadow-[0_0_25px_rgba(57,255,20,0.18)]
        "
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
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
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
      </div>
    </div>
  );
}
