import api from "@/lib/api";

export async function openPdf(id: string) {
  const { data } = await api.get(`/presupuestos/${id}/pdf`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(data);

  const a = document.createElement("a");
  a.href = url;
  a.download = `presupuesto-${id}.pdf`;

  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
}
