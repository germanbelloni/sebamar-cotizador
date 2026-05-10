import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;

  onClick?: () => void;

  disabled?: boolean;

  loading?: boolean;

  className?: string;
};

export function PrimaryButton({
  children,

  onClick,

  disabled = false,

  loading = false,

  className = "",
}: Props) {
  return (
    <motion.button
      whileTap={{
        scale: 0.98,
      }}
      whileHover={{
        scale: disabled ? 1 : 1.015,
      }}
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`
        group

        relative

        w-full

        overflow-hidden

        rounded-[26px]

        border border-[#39FF14]/20

        bg-gradient-to-br
        from-[#39FF14]/20
        via-[#39FF14]/10
        to-[#39FF14]/5

        px-6
        py-5

        text-lg
        font-semibold
        text-white

        backdrop-blur-2xl

        transition-all
        duration-300

        shadow-[0_0_35px_rgba(57,255,20,0.20)]

        hover:shadow-[0_0_45px_rgba(57,255,20,0.32)]

        disabled:cursor-not-allowed
        disabled:opacity-40

        ${className}
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

          bg-gradient-to-r
          from-transparent
          via-white/10
          to-transparent
        "
      />

      {/* Shine */}

      <div
        className="
          absolute

          inset-y-0
          left-[-30%]

          w-[30%]

          skew-x-[-20deg]

          bg-white/10

          blur-xl

          transition-all
          duration-700

          group-hover:left-[120%]
        "
      />

      <span className="relative z-10">
        {loading ? "Cotizando..." : children}
      </span>
    </motion.button>
  );
}
