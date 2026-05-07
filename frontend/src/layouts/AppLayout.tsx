type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="flex h-screen">
        <aside className="w-72 border-r border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-xl font-bold">Sebamar</h2>

          <div className="mt-8 space-y-2">
            <button className="w-full rounded-lg bg-zinc-800 px-4 py-2 text-left hover:bg-zinc-700">
              Ventanas
            </button>

            <button className="w-full rounded-lg bg-zinc-800 px-4 py-2 text-left hover:bg-zinc-700">
              Puertas
            </button>

            <button className="w-full rounded-lg bg-zinc-800 px-4 py-2 text-left hover:bg-zinc-700">
              Rajas
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-auto p-6">{children}</main>

        <aside className="w-80 border-l border-zinc-800 bg-zinc-900 p-4">
          <h3 className="text-lg font-semibold">Presupuesto</h3>

          <div className="mt-4 rounded-lg bg-zinc-800 p-4">Sin productos</div>
        </aside>
      </div>
    </div>
  );
}
