import api from "@/lib/api";

const ultimoRegistro: Record<string, number> = {};

const COOLDOWN_MS = 4000;

export async function registrarUso(
  accion: "generarPresupuesto" | "copiarCarrito" | "copiarPresupuesto",
) {
  const ahora = Date.now();

  if (ultimoRegistro[accion] && ahora - ultimoRegistro[accion] < COOLDOWN_MS) {
    return;
  }

  ultimoRegistro[accion] = ahora;

  try {
    await api.post("/estadisticas/uso", {
      accion,
    });
  } catch (error) {
    console.error("Error registrando uso:", error);
  }
}
