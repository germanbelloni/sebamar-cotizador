import apiClient from "@/lib/apiClient";

type Payload = {
  items: unknown[];

  total: number;
};

export async function guardarPresupuesto(payload: Payload) {
  const { data } = await apiClient.post("/presupuestos", payload);

  return data;
}
