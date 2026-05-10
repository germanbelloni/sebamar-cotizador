type Props = {
  title: string;

  children: React.ReactNode;
};

export function ProductFormLayout({
  title,

  children,
}: Props) {
  return (
    <div
      className="
        relative

        overflow-hidden

        rounded-[34px]

        border border-border

        bg-white/[0.03]

        p-7

        backdrop-blur-2xl

        shadow-[0_20px_60px_rgba(0,0,0,0.35)]
      "
    >
      {/* Glow */}

      <div
        className="
          pointer-events-none

          absolute inset-0

          bg-gradient-to-br
          from-white/[0.04]
          via-transparent
          to-transparent
        "
      />

      <div className="relative z-10">
        {/* HEADER */}

        <div className="mb-8">
          <h2
            className="
              text-2xl
              font-semibold

              tracking-wide

              text-white
            "
          >
            {title}
          </h2>

          <div
            className="
              mt-3

              h-px
              w-full

              bg-gradient-to-r
              from-[#39FF14]/30
              via-white/10
              to-transparent
            "
          />
        </div>

        {/* CONTENT */}

        <div className="space-y-7">{children}</div>
      </div>
    </div>
  );
}
