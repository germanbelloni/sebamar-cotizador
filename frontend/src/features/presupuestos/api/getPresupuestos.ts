import apiClient from "@/lib/apiClient";

export async function getPresupuestos() {
  const { data } = await apiClient.get("/presupuestos");

  return data;
}
