import { motion } from "framer-motion";
type Props = {
  selected?: boolean;

  disabled?: boolean;

  onClick?: () => void;

  children: React.ReactNode;

  className?: string;

  variant?: "default" | "color";
};

export function SelectableCard({
  selected = false,

  disabled = false,

  variant = "default",

  onClick,

  children,

  className = "",
}: Props) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      whileHover={{
        scale: 1.03,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 18,
      }}
      className={`
  relative
  overflow-hidden

  rounded-2xl
  border

  border-white/10

  bg-white/[0.03]
  backdrop-blur-xl

  p-3
  text-left

  transition-all
  duration-300

  ${
    selected
      ? variant === "color"
        ? `
        border-white/20
        bg-white/[0.06]
        shadow-[0_0_18px_rgba(255,255,255,0.08)]
      `
        : `
        border-white/10

        bg-[#39FF14]/[0.10]

        shadow-[0_0_35px_rgba(57,255,20,0.28)]
      `
      : `
        hover:border-[#39FF14]/20
        hover:bg-white/[0.05]
      `
  }

  ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}

  ${className}
`}
    >
      {children}
    </motion.button>
  );
}
