type Props = {
  selected?: boolean;

  disabled?: boolean;

  onClick?: () => void;

  children: React.ReactNode;

  className?: string;
};

export function GlassCard({
  selected = false,

  disabled = false,

  onClick,

  children,

  className = "",
}: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`
        relative overflow-hidden

        rounded-2xl

        border

        px-4 py-3

        text-left

        transition-all duration-300

        backdrop-blur-xl

        ${
          selected
            ? `
              border-[#39FF14]

              bg-[#39FF14]/15

              shadow-[0_0_40px_rgba(57,255,20,0.45)]

              scale-[1.03]
            `
            : `
              border-border

              bg-white/[0.03]

              hover:border-[#39FF14]/30

              hover:bg-[#39FF14]/5
            `
        }

        ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}

        ${className}
      `}
    >
      <div
        className="
          pointer-events-none

          absolute inset-0

          bg-gradient-to-br
          from-white/10
          via-transparent
          to-transparent
        "
      />

      <div className="relative z-10">{children}</div>
    </button>
  );
}
