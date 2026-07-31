import { create } from "zustand";

type SystemState = {
  mantenimiento: boolean;
  mensaje: string;

  setSystemStatus: (mantenimiento: boolean, mensaje: string) => void;

  clearSystemStatus: () => void;
};

export const useSystemStore = create<SystemState>((set) => ({
  mantenimiento: false,

  mensaje: "",

  setSystemStatus: (mantenimiento, mensaje) =>
    set({
      mantenimiento,
      mensaje,
    }),

  clearSystemStatus: () =>
    set({
      mantenimiento: false,
      mensaje: "",
    }),
}));
