import {
  DoorOpen,
  LayoutPanelLeft,
  PanelsTopLeft,
  Square,
  Warehouse,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type Feature = {
  id: string;

  label: string;
};

type Props = {
  features: readonly Feature[];

  activeFeature: string;

  onSelectFeature: (featureId: string) => void;
};

function getFeatureIcon(featureId: string) {
  switch (featureId) {
    case "ventanas":
      return <PanelsTopLeft className="h-4 w-4" />;

    case "puertas":
      return <DoorOpen className="h-4 w-4" />;

    case "rajas":
      return <Square className="h-4 w-4" />;

    case "portones":
      return <Warehouse className="h-4 w-4" />;

    default:
      return <Square className="h-4 w-4" />;
  }
}

export function Sidebar({
  features,

  activeFeature,

  onSelectFeature,
}: Props) {
  return (
    <aside className="w-56 border-r border-border bg-card/50 backdrop-blur">
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
        {features.map((feature) => (
          <Button
            key={feature.id}
            variant={activeFeature === feature.id ? "default" : "ghost"}
            className="
                h-9 w-full justify-start gap-2
                text-sm
              "
            onClick={() => onSelectFeature(feature.id)}
          >
            {getFeatureIcon(feature.id)}

            {feature.label}
          </Button>
        ))}
      </div>
    </aside>
  );
}
