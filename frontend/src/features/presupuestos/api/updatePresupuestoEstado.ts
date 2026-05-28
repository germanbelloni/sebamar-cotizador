import api from "../../../lib/api";

export async function updatePresupuestoEstado(id: string, estado: string) {
  const { data } = await api.patch(`/presupuestos/${id}/estado`, {
    estado,
  });

  return data;
}
