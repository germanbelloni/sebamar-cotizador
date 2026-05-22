import apiClient from "@/shared/api/apiClient";

type Payload = {
  items: unknown[];

  total: number;
};

export async function guardarPresupuesto(payload: Payload) {
  const { data } = await apiClient.post("/api/presupuestos", payload);

  return data;
}
