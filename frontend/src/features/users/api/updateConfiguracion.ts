import api from "../../../lib/api";

export async function updateConfiguracion(margen: number) {
  const { data } = await api.patch("/auth/configuracion", {
    margen,
  });

  return data;
}
