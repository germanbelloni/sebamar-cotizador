import type { DoorModelKey } from "../types";

const MODEL_ALIASES: Record<string, DoorModelKey> = {
  /* M1 */

  m1: "m1",

  "modelo 1": "m1",

  modelo_1: "m1",

  /* M1 VR */

  m1vr: "m1vr",

  "modelo 1 vr": "m1vr",

  modelo_1_vr: "m1vr",

  /* M2 */

  m2: "m2",

  "modelo 2": "m2",

  modelo_2: "m2",
};

export function normalizeDoorModel(model?: string): DoorModelKey {
  if (!model) {
    return "m1";
  }

  const normalized = model.toLowerCase().trim().replace(/\s+/g, " ");

  return MODEL_ALIASES[normalized] || "m1";
}
