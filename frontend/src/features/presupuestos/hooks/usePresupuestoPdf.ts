import { getPresupuestoPdf } from "../api/getPresupuestoPdf";

function formatFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-AR").replace(/\//g, "-");
}

function limpiarNombre(nombre: string) {
  return nombre.trim().toUpperCase().replace(/\s+/g, " ");
}

export function usePresupuestoPdf() {
  async function download(id: string, cliente: string, fecha: string) {
    const blob = await getPresupuestoPdf(id);

    const url = URL.createObjectURL(blob);

    const nombreArchivo = `${limpiarNombre(cliente)} ${formatFecha(fecha)}.pdf`;

    const a = document.createElement("a");

    a.href = url;
    a.download = nombreArchivo;

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }

  return {
    download,
  };
}
