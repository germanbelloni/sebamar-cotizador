import api from "@/lib/api";

export async function openPdf(id: string) {
  const { data } = await api.get(`/presupuestos/${id}/pdf`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(data);

  window.open(url, "_blank");
}
