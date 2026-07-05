import api from "@/lib/api";

export async function deletePresupuesto(id: string) {
  const { data } = await api.delete(`/presupuestos/${id}`);

  return data;
}
