import { toast } from "sonner";

import { serializePresupuestoMessage } from "../serializers/serializePresupuestoMessage";

type PresupuestoItem = {
  cantidad: number;
  descripcion: string;
  precioUnitario: number;
  subtotal: number;
};

type Presupuesto = {
  cliente?: string;
  telefono?: string;
  items: PresupuestoItem[];
  total: number;
};

export function useSharePresupuesto() {
  function buildMessage(presupuesto: Presupuesto) {
    return serializePresupuestoMessage(presupuesto);
  }

  async function copy(presupuesto: Presupuesto) {
    try {
      const text = buildMessage(presupuesto);

      await navigator.clipboard.writeText(text);

      toast.success("Presupuesto copiado al portapapeles.");
    } catch (error) {
      console.error(error);

      toast.error("No se pudo copiar el presupuesto.");
    }
  }

  function openWhatsApp(presupuesto: Presupuesto) {
    const text = encodeURIComponent(buildMessage(presupuesto));

    const telefono = (presupuesto.telefono || "").replace(/\D/g, "");

    const url = telefono
      ? `https://web.whatsapp.com/send?phone=549${telefono}&text=${text}`
      : `https://web.whatsapp.com/send?text=${text}`;

    window.open(url, "_blank");
  }

  return {
    copy,
    openWhatsApp,
  };
}
