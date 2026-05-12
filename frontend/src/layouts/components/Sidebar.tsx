import {
  DoorOpen,
  LogOut,
  PanelsTopLeft,
  Settings,
  Square,
  User,
  Warehouse,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { useAuthStore } from "@/store/authStore";

import { useUIStore } from "@/store/uiStore";

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
  const user = useAuthStore((state) => state.user);

  const logout = useAuthStore((state) => state.logout);

  const openUsersPanel = useUIStore((state) => state.openUsersPanel);

  const isSuperAdmin = user?.role === "superadmin";

  return (
    <aside
      className="
        flex
        w-60
        flex-col
        border-r
        border-border
        bg-card/50
        backdrop-blur
      "
    >
      {/* 🏢 HEADER */}

      <div
        className="
          border-b
          border-border
          p-4
        "
      >
        <div className="flex items-center gap-3">
          {/* 🎨 LOGO */}
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-lime-400/10
              text-sm
              font-bold
              text-lime-400
            "
          >
            S
          </div>

          <div className="min-w-0">
            <h1
              className="
                truncate
                text-sm
                font-bold
                uppercase
                tracking-wide
              "
            >
              {user?.empresa || "SEBAMAR"}
            </h1>

            <p
              className="
                text-xs
                text-muted-foreground
              "
            >
              {user?.nombre}
            </p>
          </div>
        </div>
      </div>

      {/* 📦 FEATURES */}

      <div className="flex-1 space-y-1 p-3">
        {features.map((feature) => (
          <Button
            key={feature.id}
            variant={activeFeature === feature.id ? "default" : "ghost"}
            className="
              h-10
              w-full
              justify-start
              gap-2
              rounded-xl
              text-sm
            "
            onClick={() => onSelectFeature(feature.id)}
          >
            {getFeatureIcon(feature.id)}

            {feature.label}
          </Button>
        ))}
      </div>

      {/* ⚙️ FOOTER */}

      <div
        className="
          space-y-2
          border-t
          border-border
          p-3
        "
      >
        {/* 👑 USERS */}
        {isSuperAdmin && (
          <Button
            variant="ghost"
            className="
      h-10
      w-full
      justify-start
      gap-2
      rounded-xl
    "
            onClick={openUsersPanel}
          >
            <User className="h-4 w-4" />
            Usuarios
          </Button>
        )}

        {/* ⚙️ SETTINGS */}
        <Button
          variant="ghost"
          className="
            h-10
            w-full
            justify-start
            gap-2
            rounded-xl
          "
        >
          <Settings className="h-4 w-4" />
          Configuración
        </Button>

        {/* 🚪 LOGOUT */}
        <Button
          variant="ghost"
          className="
            h-10
            w-full
            justify-start
            gap-2
            rounded-xl
            text-red-400
            hover:text-red-400
          "
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}
