import { motion } from "framer-motion";

type Props = {
  active: boolean;

  label: string;

  onClick: () => void;
};

export function ToggleCard({
  active,

  label,

  onClick,
}: Props) {
  return (
    <motion.button
      whileTap={{
        scale: 0.98,
      }}
      whileHover={{
        scale: 1.02,
      }}
      type="button"
      onClick={onClick}
      className={`
        group

        relative

        overflow-hidden

        rounded-2xl

        border

        px-5
        py-4

        transition-all
        duration-300

        backdrop-blur-xl

        ${
          active
            ? `
              border-[#39FF14]/30

              bg-[#39FF14]/10

              shadow-[0_0_25px_rgba(57,255,20,0.18)]
            `
            : `
              border-border

              bg-white/[0.03]

              hover:bg-white/[0.05]
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

          group-hover:opacity-100

          bg-gradient-to-br
          from-white/[0.04]
          to-transparent
        "
      />

      <div
        className="
          relative z-10

          flex
          items-center
          justify-between
          gap-4
        "
      >
        <span
          className={`
            text-sm
            font-semibold

            transition-colors

            ${active ? "text-white" : "text-white/65"}
          `}
        >
          {label}
        </span>

        {/* Switch */}

        <div
          className={`
            relative

            h-7
            w-12

            rounded-full

            transition-all
            duration-300

            ${active ? "bg-[#39FF14]/30" : "bg-white/10"}
          `}
        >
          <motion.div
            animate={{
              x: active ? 22 : 2,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="
              absolute top-1

              h-5
              w-5

              rounded-full

              bg-white

              shadow-lg
            "
          />
        </div>
      </div>
    </motion.button>
  );
}
