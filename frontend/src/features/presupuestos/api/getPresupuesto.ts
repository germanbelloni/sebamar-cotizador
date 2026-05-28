import api from "@/lib/api";

export async function getPresupuesto(id: string) {
  const { data } = await api.get(`/presupuestos/${id}`);

  return data;
}
