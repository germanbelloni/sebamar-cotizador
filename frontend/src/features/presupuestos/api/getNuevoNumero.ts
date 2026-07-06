import api from "@/lib/api";

export async function getNuevoNumero() {
  const { data } = await api.post("/presupuestos/nuevo");

  return data.numero;
}
