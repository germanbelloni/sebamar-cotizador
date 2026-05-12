type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-auto">
  <div
    className="
      origin-top-left

      scale-[0.82]

      xl:scale-[0.88]

      2xl:scale-[0.92]
    "
  >
      <div className="flex h-screen overflow-hidden">
        {/* SIDEBAR */}

        <aside
          className="
            w-60
            border-r border-zinc-800
            bg-zinc-900/95

            px-4 py-5

            backdrop-blur
          "
        >
          <h2 className="text-lg font-bold tracking-tight">Sebamar</h2>

          <div className="mt-8 space-y-2">
            <button
              className="
                w-full

                rounded-xl

                bg-zinc-800/70

                px-4 py-2.5

                text-left
                text-sm

                transition-all duration-200

                hover:bg-zinc-700
              "
            >
              Ventanas
            </button>

            <button
              className="
                w-full

                rounded-xl

                bg-zinc-800/70

                px-4 py-2.5

                text-left
                text-sm

                transition-all duration-200

                hover:bg-zinc-700
              "
            >
              Puertas
            </button>

            <button
              className="
                w-full

                rounded-xl

                bg-zinc-800/70

                px-4 py-2.5

                text-left
                text-sm

                transition-all duration-200

                hover:bg-zinc-700
              "
            >
              Rajas
            </button>
          </div>
        </aside>

        {/* CONTENT */}

        <main
          className="
            flex-1
            overflow-auto

            bg-zinc-950

            px-8 py-6
          "
        >
          <div className="mx-auto max-w-[1500px]">{children}</div>
        </main>

        {/* BUDGET PANEL */}

        <aside
          className="
            w-[340px]

            border-l border-zinc-800

            bg-zinc-900/95

            px-5 py-5

            backdrop-blur
          "
        >
          <h3 className="text-base font-semibold">Presupuesto</h3>

          <div
            className="
              mt-4

              rounded-2xl

              border border-zinc-800

              bg-zinc-800/40

              p-4

              text-sm text-zinc-400
            "
          >
            Sin productos
          </div>
        </aside>
      </div>
    </div>
  );
}
