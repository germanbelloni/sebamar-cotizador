import api from "@/lib/api";

type Payload = {
  id: string;
  cliente: string;
  telefono: string;
  items: unknown[];
  total: number;
};

export async function updatePresupuestoCompleto({ id, ...payload }: Payload) {
  const { data } = await api.put(`/presupuestos/${id}/items`, payload);

  return data;
}
