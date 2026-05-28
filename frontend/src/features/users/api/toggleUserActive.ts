import api from "../../../lib/api";

export async function toggleUserActive(id: string) {
  const { data } = await api.patch(`/auth/users/${id}/toggle`);

  return data;
}
