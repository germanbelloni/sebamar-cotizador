import api from "@/lib/api";

import type { Presupuesto } from "../types/presupuesto.types";

export async function getPresupuesto(id: string): Promise<Presupuesto> {
  const { data } = await api.get(`/presupuestos/${id}`);

  return data;
}
