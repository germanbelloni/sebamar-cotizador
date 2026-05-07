import {
  DoorOpen,
  LayoutPanelLeft,
  PanelsTopLeft,
  Square,
  Warehouse,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export function Sidebar() {
  return (
    <aside className="w-72 border-r border-border bg-card/50 backdrop-blur">
      <div className="border-b border-border p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2">
            <LayoutPanelLeft className="h-5 w-5 text-primary" />
          </div>

          <div>
            <h1 className="text-lg font-semibold">Sebamar</h1>

            <p className="text-sm text-muted-foreground">Cotizador técnico</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 p-4">
        <Button className="w-full justify-start gap-2">
          <PanelsTopLeft className="h-4 w-4" />
          Ventanas
        </Button>

        <Button variant="ghost" className="w-full justify-start gap-2">
          <DoorOpen className="h-4 w-4" />
          Puertas
        </Button>

        <Button variant="ghost" className="w-full justify-start gap-2">
          <Square className="h-4 w-4" />
          Rajas
        </Button>

        <Button variant="ghost" className="w-full justify-start gap-2">
          <Warehouse className="h-4 w-4" />
          Portones
        </Button>
      </div>
    </aside>
  );
}
    