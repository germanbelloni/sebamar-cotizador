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
              border-lime-400/40

              bg-lime-400/10

              shadow-[0_0_25px_rgba(163,230,53,0.25)]

              scale-[1.02]
            `
            : `
              border-border

              bg-white/[0.03]

              hover:bg-white/[0.05]
            `
        }

        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}

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
