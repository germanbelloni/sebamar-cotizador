export function MaintenanceScreen({ mensaje }: { mensaje: string }) {
  return (
    <div
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-background
        text-foreground
      "
    >
      <div
        className="
          rounded-3xl
          border
          border-border
          bg-card
          p-10
          text-center
          shadow-xl
        "
      >
        <div className="mb-6 text-5xl">🛠️</div>

        <h1 className="text-3xl font-bold">App en mantenimiento</h1>

        <p className="mt-4 text-muted-foreground">{mensaje}</p>
      </div>
    </div>
  );
}
