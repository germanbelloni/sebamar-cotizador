import { Button } from "@/components/ui/button";

export function BudgetPanel() {
  return (
    <aside className="w-80 border-l border-border bg-card/50 p-5 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Presupuesto</h3>

          <p className="text-sm text-muted-foreground">0 productos</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-background p-4">
        <p className="text-sm text-muted-foreground">
          No hay productos agregados.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-background p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total</span>

          <span className="text-xl font-bold">$ 0</span>
        </div>
      </div>

      <Button className="mt-6 w-full">Generar PDF</Button>
    </aside>
  );
}
