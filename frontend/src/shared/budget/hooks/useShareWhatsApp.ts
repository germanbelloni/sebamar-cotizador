import { useBudgetStore } from "../store/useBudgetStore";

import { budgetToWhatsApp } from "../serializers/budgetToWhatsApp";
import { toast } from "sonner";

type Params = {
  empresa: string;

  cliente?: string;

  telefono?: string;
};

export function useShareWhatsApp({ empresa, cliente, telefono }: Params) {
  const items = useBudgetStore((state) => state.items);

  const total = useBudgetStore((state) => state.total);

  function normalizePhone(phone?: string) {
    if (!phone) return "";

    let cleaned = phone.replace(/\D/g, "");

    // sacar 15
    cleaned = cleaned.replace(/^15/, "");

    cleaned = cleaned.replace(/^(....?)15/, "$1");

    // sacar 0 inicial
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.slice(1);
    }

    // agregar codigo argentina
    return `549${cleaned}`;
  }

  function share() {
    if (!telefono?.trim()) {
      toast.error("Debe ingresar un teléfono.");

      return;
    }
    const text = budgetToWhatsApp({
      empresa,
      cliente,
      items,
      total: total(),
    });

    const encoded = encodeURIComponent(text);

    const cleanPhone = normalizePhone(telefono);

    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    window.open(url, "_blank");
  }

  return {
    share,
  };
}
