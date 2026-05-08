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
    <aside className="w-40 border-r border-border bg-card/50 backdrop-blur">
      {/* HEADER */}

      <div className="border-b border-border p-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-1.5">
            <LayoutPanelLeft className="h-4 w-4 text-primary" />
          </div>

          <div>
            <h1 className="text-sm font-semibold">Sebamar</h1>

            <p className="text-xs text-muted-foreground">Cotizador técnico</p>
          </div>
        </div>
      </div>

      {/* MENU */}

      <div className="space-y-1 p-3">
        <Button
          className="
            h-9 w-full justify-start gap-2
            text-sm
          "
        >
          <PanelsTopLeft className="h-4 w-4" />
          Ventanas
        </Button>

        <Button
          variant="ghost"
          className="
            h-9 w-full justify-start gap-2
            text-sm
          "
        >
          <DoorOpen className="h-4 w-4" />
          Puertas
        </Button>

        <Button
          variant="ghost"
          className="
            h-9 w-full justify-start gap-2
            text-sm
          "
        >
          <Square className="h-4 w-4" />
          Rajas
        </Button>

        <Button
          variant="ghost"
          className="
            h-9 w-full justify-start gap-2
            text-sm
          "
        >
          <Warehouse className="h-4 w-4" />
          Portones
        </Button>
      </div>
    </aside>
  );
}
