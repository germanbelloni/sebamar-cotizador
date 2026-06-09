import { FileText, LogOut, Settings, User } from "lucide-react";

import { PiGarageBold, PiSquareHalfBottomBold } from "react-icons/pi";

import { MdOutlineDoorSliding } from "react-icons/md";

import { TbWindow, TbWindowMaximize, TbFrame, TbSquare } from "react-icons/tb";

import { GiWindow, GiDoor, GiGate } from "react-icons/gi";

import { FaMosquitoNet } from "react-icons/fa6";

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
      return <GiWindow className="h-4 w-4" />;

    case "puertas":
      return <GiDoor className="h-4 w-4" />;

    case "puertas-placa":
      return <MdOutlineDoorSliding className="h-4 w-4" />;

    case "rajas":
      return <TbWindow className="h-4 w-4" />;

    case "postigones":
      return <TbWindowMaximize className="h-4 w-4" />;

    case "patagonicas":
      return <GiGate className="h-4 w-4" />;

    case "mosquiteros":
      return <FaMosquitoNet className="h-4 w-4" />;

    case "portones":
      return <PiGarageBold className="h-4 w-4" />;

    case "pano-fijo":
      return <TbSquare className="h-4 w-4" />;

    case "marcos":
      return <TbFrame className="h-4 w-4" />;

    default:
      return <PiSquareHalfBottomBold className="h-4 w-4" />;
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

  const canManageUsers = user?.role === "superadmin" || user?.role === "admin";

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
              gap-3
              rounded-xl
              text-sm
            "
            onClick={() => onSelectFeature(feature.id)}
          >
            {getFeatureIcon(feature.id)}

            <span>{feature.label}</span>
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
        <Button
          variant="ghost"
          className="
    h-10
    w-full
    justify-start
    gap-2
    rounded-xl
  "
          onClick={() => onSelectFeature("presupuestos")}
        >
          <FileText className="h-4 w-4" />
          Presupuestos
        </Button>

        {canManageUsers && (
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

        {user?.role !== "user" && (
          <Button
            variant="ghost"
            className="
      h-10
      w-full
      justify-start
      gap-2
      rounded-xl
    "
            onClick={() => onSelectFeature("configuracion")}
          >
            <Settings className="h-4 w-4" />
            Configuración
          </Button>
        )}

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
