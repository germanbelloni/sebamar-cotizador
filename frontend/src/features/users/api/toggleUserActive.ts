import { apiFetch } from "@/lib/api";

export async function toggleUserActive(userId: string) {
  return apiFetch(`/api/auth/users/${userId}/toggle`, {
    method: "PATCH",
  });
}
