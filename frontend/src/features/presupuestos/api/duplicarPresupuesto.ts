import api from "@/lib/api";

export async function duplicarPresupuesto(id: string) {
  const { data } = await api.post(`/presupuestos/${id}/duplicar`);

  return data;
}
