type Props = {
  title: string;

  children: React.ReactNode;
};

export function ConfigSection({
  title,

  children,
}: Props) {
  return (
    <section
      className="
        relative

        overflow-hidden

        rounded-[30px]

        border border-white/10

        bg-white/[0.03]

        p-6

        backdrop-blur-2xl

        shadow-[0_10px_40px_rgba(0,0,0,0.35)]
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
        <h2
          className="
            mb-6

            text-xl
            font-semibold

            tracking-wide

            text-white
          "
        >
          {title}
        </h2>

        {children}
      </div>
    </section>
  );
}
