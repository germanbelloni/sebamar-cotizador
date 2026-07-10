import api from "@/lib/api";

export type Payload = {
  cliente?: string;
  telefono?: string;
  direccion?: string;
  observaciones?: string;
  validez?: string;
};

export async function updatePresupuesto(id: string, payload: Payload) {
  const { data } = await api.put(`/presupuestos/${id}`, payload);

  return data;
}
