import { create } from "zustand";

type CotizacionState = {
  perfilTemporal: "amarilla" | "azul" | "verde" | "papu";

  setPerfilTemporal: (perfil: "amarilla" | "azul" | "verde" | "papu") => void;

  modo: "cotizar" | "costos";

  setModo: (modo: "cotizar" | "costos") => void;
};

export const useCotizacionStore = create<CotizacionState>((set) => ({
  perfilTemporal: "amarilla",

  setPerfilTemporal: (perfil) =>
    set({
      perfilTemporal: perfil,
    }),

  modo: "cotizar",

  setModo: (modo) =>
    set({
      modo,
    }),
}));
