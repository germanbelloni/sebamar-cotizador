import { motion } from "framer-motion";

type Option = {
  label: string;
  value: string;
};

type Props = {
  value: string;

  options: Option[];

  onChange: (value: string) => void;
};

export function SegmentedControl({ value, options, onChange }: Props) {
  return (
    <div
      className="
        relative

        flex
        w-fit

        rounded-3xl

        border border-white/10

        bg-white/[0.04]
        p-1

        backdrop-blur-xl
      "
    >
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className="
              relative
              z-10

              min-w-[180px]

              px-8
              py-5

              text-lg
              font-semibold

              transition-colors
            "
          >
            {active && (
              <motion.div
                layoutId="segmented-pill"
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 24,
                }}
                className="
                  absolute inset-0

                  rounded-[22px]

                  border border-[#39FF14]/20

                  bg-gradient-to-br
                  from-[#39FF14]/20
                  to-[#39FF14]/5

                  shadow-[0_0_35px_rgba(57,255,20,0.22)]
                "
              />
            )}

            <span
              className={`
                relative z-10

                ${active ? "text-white" : "text-white/60"}
              `}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
