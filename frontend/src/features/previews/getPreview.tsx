import { VentanaPreview } from "@/features/ventanas/components/VentanaPreview";
import { RajasPreview } from "@/features/rajas/components/RajasPreview";
import { PostigonPreview } from "@/features/postigones/components/PostigonPreview";
import { PatagonicasPreview } from "@/features/patagonicas/components/PatagonicasPreview";
import { MosquiterosPreview } from "@/features/mosquiteros/components/MosquiterosPreview";
import { PuertasPreview } from "@/features/puertas/components/PuertasPreview";
import { PuertasPlacaPreview } from "@/features/puertas-placa/components/PuertasPlacaPreview";
import { PanoFijoPreview } from "@/features/pano-fijo/components/PanoFijoPreview";
import { MarcosPreview } from "@/features/marcos/components/MarcosPreview";

export function getPreview(
  activeFeature: string,
  configs: Record<string, unknown>,
) {
  switch (activeFeature) {
    case "ventanas":
      return <VentanaPreview config={configs.ventanas as never} />;

    case "rajas":
      return <RajasPreview config={configs.rajas as never} />;

    case "postigones":
      return <PostigonPreview config={configs.postigones as never} />;

    case "patagonicas":
      return <PatagonicasPreview config={configs.patagonicas as never} />;

    case "mosquiteros":
      return <MosquiterosPreview config={configs.mosquiteros as never} />;

    case "puertas":
      return <PuertasPreview config={configs.puertas as never} />;

    case "puertas-placa":
      return <PuertasPlacaPreview config={configs.puertasPlaca as never} />;

    case "pano-fijo":
      return <PanoFijoPreview config={configs.panoFijo as never} />;

    case "marcos":
      return <MarcosPreview config={configs.marcos as never} />;

    default:
      return null;
  }
}
