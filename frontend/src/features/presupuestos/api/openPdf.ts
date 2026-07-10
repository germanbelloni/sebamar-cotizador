import api from "@/lib/api";

function formatFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-AR").replace(/\//g, "-");
}

function limpiarNombre(nombre: string) {
  return nombre.trim().toUpperCase().replace(/\s+/g, " ");
}

export async function openPdf(id: string, cliente: string, fecha: string) {
  const { data } = await api.get(`/presupuestos/${id}/pdf`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(data);

  const a = document.createElement("a");

  a.href = url;
  a.download = `${limpiarNombre(cliente)} ${formatFecha(fecha)}.pdf`;

  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
}
