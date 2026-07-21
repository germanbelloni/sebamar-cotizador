import { getPresupuestoPdf } from "../api/getPresupuestoPdf";
import { toast } from "sonner";

function formatFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-AR").replace(/\//g, "-");
}

function limpiarNombre(nombre: string) {
  return nombre.trim().toUpperCase().replace(/\s+/g, " ");
}

async function elegirArchivo(blob: Blob, nombreArchivo: string) {
  if (!("showSaveFilePicker" in window)) {
    return null;
  }

  const handle = await (
    window as Window & {
      showSaveFilePicker: (options: {
        suggestedName: string;
        types: {
          description: string;
          accept: Record<string, string[]>;
        }[];
      }) => Promise<FileSystemFileHandle>;
    }
  ).showSaveFilePicker({
    suggestedName: nombreArchivo,
    types: [
      {
        description: "Documento PDF",
        accept: {
          "application/pdf": [".pdf"],
        },
      },
    ],
  });

  const writable = await handle.createWritable();

  await writable.write(blob);

  await writable.close();

  return handle;
}

const fileHandles = new Map<string, FileSystemFileHandle>();

export function usePresupuestoPdf() {
  async function view(id: string) {
    const blob = await getPresupuestoPdf(id);

    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  async function save(id: string, cliente: string, fecha: string) {
    const blob = await getPresupuestoPdf(id);

    const nombreArchivo = `${limpiarNombre(cliente)} ${formatFecha(fecha)}.pdf`;

    const handle = fileHandles.get(id);

    if (handle) {
      try {
        const writable = await handle.createWritable();

        await writable.write(blob);

        await writable.close();

        toast.success("PDF guardado correctamente.");

        return;
      } catch {
        fileHandles.delete(id);
      }
    }

    try {
      const handle = await elegirArchivo(blob, nombreArchivo);

      if (handle) {
        fileHandles.set(id, handle);

        toast.success("PDF guardado correctamente.");

        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      console.warn("No se pudo usar Guardar como.", error);
    }

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = nombreArchivo;

    document.body.appendChild(a);

    a.click();
    toast.success("PDF guardado correctamente.");
    a.remove();

    URL.revokeObjectURL(url);
  }

  async function saveAs(id: string, cliente: string, fecha: string) {
    const blob = await getPresupuestoPdf(id);

    const nombreArchivo = `${limpiarNombre(cliente)} ${formatFecha(fecha)}.pdf`;

    try {
      const handle = await elegirArchivo(blob, nombreArchivo);

      if (handle) {
        fileHandles.set(id, handle);

        toast.success("PDF guardado correctamente.");

        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      console.warn("No se pudo usar Guardar como.", error);
    }

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = nombreArchivo;

    document.body.appendChild(a);

    a.click();

    toast.success("PDF guardado correctamente.");

    a.remove();

    URL.revokeObjectURL(url);
  }

  return {
    view,
    save,
    saveAs,
  };
}
