import type { PortonesConfig } from "../types";
import { MODEL_DESCRIPTIONS } from "@/features/puertas/models/utils/descriptions";

export function buildPortonesDescription(config: PortonesConfig) {
  const parts: string[] = [];

  // PRODUCTO
  parts.push("Porton");

  // MEDIDAS
  parts.push(`${config.ancho}x${config.alto}`);

  // MATERIAL
  parts.push("aluminio");

  // COLOR
  parts.push(config.color);

  // LINEA
  parts.push(config.linea);

  // HOJAS
  parts.push(`${config.hojas} hojas`);

  // SISTEMA
  parts.push(`de ${config.sistema}`);

  // MODELO
  const lineaKey = config.linea === "Herrero" ? "herrero" : "modena";

  const modeloKey = config.modelo.replaceAll(" ", "_");

  const modelo =
    MODEL_DESCRIPTIONS[lineaKey][
      modeloKey as keyof (typeof MODEL_DESCRIPTIONS)[typeof lineaKey]
    ] ?? config.modelo;

  parts.push(modelo);
  // VIDRIO
  const descripcionVidrio =
    !config.tipoVidrio || config.tipoVidrio === "3mm"
      ? ""
      : `vidrio ${config.tipoVidrio}`;

  if (descripcionVidrio) {
    parts.push(descripcionVidrio);
  }

  // EXTRAS
  if (config.extras.barralRecto) {
    parts.push("barral recto");
  }

  if (config.extras.barralCurvo) {
    parts.push("barral curvo");
  }

  if (config.extras.mediaManija) {
    parts.push("media manija");
  }

  if (config.extras.picaporte) {
    parts.push("picaporte");
  }

  if (config.extras.cartelprohibido) {
    parts.push("cartel prohibido");
  }

  if (config.extras.dobleTravesano) {
    parts.push("doble travesaño");
  }

  return parts.join(" ");
}
