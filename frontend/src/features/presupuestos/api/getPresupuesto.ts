import apiClient from "@/lib/apiClient";

export async function getPresupuesto(id: string) {
  const { data } = await apiClient.get(`/presupuestos/${id}`);

  return data;
}
