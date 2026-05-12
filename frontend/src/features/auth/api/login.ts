import { apiFetch } from "@/lib/api";

type LoginPayload = {
  nombre: string;
  password: string;
};

type LoginResponse = {
  token: string;

  user: {
    id: string;

    nombre: string;

    role: "superadmin" | "admin" | "user";

    perfil: string;

    margen: number;

    empresa: string;

    ownerId: string | null;
  };
};

export async function login(payload: LoginPayload) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",

    body: JSON.stringify(payload),
  });
}
