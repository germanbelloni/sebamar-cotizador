import { create } from "zustand";

type User = {
  id: string;
  nombre: string;
  role: "superadmin" | "admin" | "user";
  perfil: string;
  margen: number;
  empresa: string;
  ownerId: string | null;
};

type AuthState = {
  token: string | null;

  user: User | null;

  isAuthenticated: boolean;

  login: (data: { token: string; user: User }) => void;

  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),

  user: (() => {
    const stored = localStorage.getItem("user");

    return stored ? JSON.parse(stored) : null;
  })(),

  isAuthenticated: !!localStorage.getItem("token"),

  login: ({ token, user }) => {
    localStorage.setItem("token", token);

    localStorage.setItem("user", JSON.stringify(user));

    set({
      token,
      user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));
