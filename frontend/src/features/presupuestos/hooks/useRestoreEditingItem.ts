import { useEffect, useRef } from "react";

import type { PuertasConfig } from "@/features/puertas/types";
import type { VentanaConfig } from "@/features/ventanas/types";
import type { RajasConfig } from "@/features/rajas/types";
import type { PostigonesConfig } from "@/features/postigones/types";
import type { PatagonicasConfig } from "@/features/patagonicas/types";
import type { MosquiterosConfig } from "@/features/mosquiteros/types";
import type { MarcosConfig } from "@/features/marcos/types";
import type { PanoFijoConfig } from "@/features/pano-fijo/types";
import type { PuertasPlacaConfig } from "@/features/puertas-placa/types";
import type { VentanasAbrirConfig } from "@/features/ventanasAbrir/types";
import type { PortonesConfig } from "@/features/portones/types";
import type { CortinaConfig } from "@/features/cortinas/types";

type EditingItem = {
  modulo: string;
  configuracion: unknown;
};

type Props = {
  editingItem: EditingItem | null;

  setActiveFeature: (feature: string) => void;

  setPuertasConfig: React.Dispatch<React.SetStateAction<PuertasConfig>>;
  setVentanasConfig: React.Dispatch<React.SetStateAction<VentanaConfig>>;
  setRajasConfig: React.Dispatch<React.SetStateAction<RajasConfig>>;
  setPostigonesConfig: React.Dispatch<React.SetStateAction<PostigonesConfig>>;
  setPatagonicasConfig: React.Dispatch<React.SetStateAction<PatagonicasConfig>>;
  setMosquiterosConfig: React.Dispatch<React.SetStateAction<MosquiterosConfig>>;
  setMarcosConfig: React.Dispatch<React.SetStateAction<MarcosConfig>>;
  setPanoFijoConfig: React.Dispatch<React.SetStateAction<PanoFijoConfig>>;
  setPuertasPlacaConfig: React.Dispatch<
    React.SetStateAction<PuertasPlacaConfig>
  >;
  setVentanasAbrirConfig: React.Dispatch<
    React.SetStateAction<VentanasAbrirConfig>
  >;
  setPortonesConfig: React.Dispatch<React.SetStateAction<PortonesConfig>>;
  setCortinaConfig: React.Dispatch<React.SetStateAction<CortinaConfig>>;
};

export function useRestoreEditingItem({
  editingItem,
  setActiveFeature,
  setPuertasConfig,
  setVentanasConfig,
  setRajasConfig,
  setPostigonesConfig,
  setPatagonicasConfig,
  setMosquiterosConfig,
  setMarcosConfig,
  setPanoFijoConfig,
  setPuertasPlacaConfig,
  setVentanasAbrirConfig,
  setPortonesConfig,
  setCortinaConfig,
}: Props) {
  const restoredRef = useRef(false);

  useEffect(() => {
    if (!editingItem) {
      restoredRef.current = false;
      return;
    }

    if (restoredRef.current) return;

    restoredRef.current = true;

    switch (editingItem.modulo) {
      case "puertas":
        setActiveFeature("puertas");
        setPuertasConfig(editingItem.configuracion as PuertasConfig);
        break;

      case "ventanas":
        setActiveFeature("ventanas");
        setVentanasConfig(editingItem.configuracion as VentanaConfig);
        break;

      case "rajas":
        setActiveFeature("rajas");
        setRajasConfig(editingItem.configuracion as RajasConfig);
        break;

      case "postigones":
        setActiveFeature("postigones");
        setPostigonesConfig(editingItem.configuracion as PostigonesConfig);
        break;

      case "patagonicas":
        setActiveFeature("patagonicas");
        setPatagonicasConfig(editingItem.configuracion as PatagonicasConfig);
        break;

      case "mosquiteros":
        setActiveFeature("mosquiteros");
        setMosquiterosConfig(editingItem.configuracion as MosquiterosConfig);
        break;

      case "marcos":
        setActiveFeature("marcos");
        setMarcosConfig(editingItem.configuracion as MarcosConfig);
        break;

      case "pano-fijo":
        setActiveFeature("pano-fijo");
        setPanoFijoConfig(editingItem.configuracion as PanoFijoConfig);
        break;

      case "puertas-placa":
        setActiveFeature("puertas-placa");
        setPuertasPlacaConfig(editingItem.configuracion as PuertasPlacaConfig);
        break;

      case "ventanas-abrir":
        setActiveFeature("ventanas-abrir");
        setVentanasAbrirConfig(
          editingItem.configuracion as VentanasAbrirConfig,
        );
        break;

      case "portones":
        setActiveFeature("portones");
        setPortonesConfig(editingItem.configuracion as PortonesConfig);
        break;

      case "cortinas":
        setActiveFeature("cortinas");
        setCortinaConfig(editingItem.configuracion as CortinaConfig);
        break;

      default:
        break;
    }
  }, [
    editingItem,
    setActiveFeature,
    setPuertasConfig,
    setVentanasConfig,
    setRajasConfig,
    setPostigonesConfig,
    setPatagonicasConfig,
    setMosquiterosConfig,
    setMarcosConfig,
    setPanoFijoConfig,
    setPuertasPlacaConfig,
    setVentanasAbrirConfig,
    setPortonesConfig,
    setCortinaConfig,
  ]);
}
