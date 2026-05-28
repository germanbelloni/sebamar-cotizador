import api from "@/lib/api";

export async function getPresupuestos() {
  const { data } = await api.get("/presupuestos");

  return data;
}
