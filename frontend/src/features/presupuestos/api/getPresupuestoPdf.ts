import api from "@/lib/api";

export async function getPresupuestoPdf(id: string) {
  const response = await api.get(`/presupuestos/${id}/pdf`, {
    responseType: "blob",
  });

  return response.data;
}
