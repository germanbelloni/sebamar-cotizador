import api from "@/lib/api";

export async function openPdf(id: string) {
  const { data } = await api.get(`/presupuestos/${id}/pdf`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(data);

  window.open(url, "_blank");

  // Liberamos el Blob unos segundos después para no cerrarlo
  // antes de que el visor del navegador lo termine de cargar.
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 1000);
}
