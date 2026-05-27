import apiClient from "@/lib/apiClient";

type Payload = {
  cliente?: string;

  telefono?: string;

  items: unknown[];

  total: number;
};

export async function guardarPresupuesto(payload: Payload) {
  const { data } = await apiClient.post("/api/presupuestos", payload);

  return data;
}
