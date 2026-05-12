import type { RajaBisagra } from "@/features/rajas/types";

export function isLeft(side?: RajaBisagra) {
  return side === "izquierda";
}

export function isRight(side?: RajaBisagra) {
  return side === "derecha";
}
