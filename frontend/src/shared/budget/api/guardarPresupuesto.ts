import api from "@/lib/api";

type Payload = {
  cliente?: string;
  telefono?: string;
  items: unknown[];
  total: number;
};

export async function guardarPresupuesto(payload: Payload) {
  const { data } = await api.post("/presupuestos", payload);

  return data;
}
