import { usePresupuestos } from "../hooks/usePresupuestos";

type Presupuesto = {
  id: string;

  numero: number;

  cliente: string;

  usuario: string;

  total: number;

  fecha: string;
};
type Props = {
  onOpenPresupuesto: (id: string) => void;
};

export function PresupuestosPage({ onOpenPresupuesto }: Props) {
  const { data, isLoading } = usePresupuestos();

  if (isLoading) {
    return (
      <div className="p-10">
        <p className="text-zinc-500">Cargando presupuestos...</p>
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Presupuestos</h1>

        <p className="mt-2 text-zinc-500">
          Historial de presupuestos guardados.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="divide-y divide-border">
          {data?.map((presupuesto: Presupuesto) => (
            <div
              key={presupuesto.id}
              onClick={() => onOpenPresupuesto(presupuesto.id)}
              className="
                flex
                cursor-pointer
                items-center
                justify-between

                px-6
                py-5

                transition-colors

                hover:bg-muted/40
              "
            >
              <div>
                <div className="text-lg font-semibold">
                  {presupuesto.cliente || "Sin cliente"}
                </div>

                <div className="mt-1 text-sm text-muted-foreground">
                  #{presupuesto.numero} · {presupuesto.usuario}
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold">
                  ${Number(presupuesto.total || 0).toLocaleString("es-AR")}
                </div>

                <div className="mt-1 text-sm text-muted-foreground">
                  {presupuesto.fecha || "-"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
