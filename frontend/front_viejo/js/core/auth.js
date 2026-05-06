import { Api } from "./api.js";

// 🔐 Guardar token
function setToken(token) {
  localStorage.setItem("token", token);
}

// 🔓 Obtener token
function getToken() {
  return localStorage.getItem("token");
}

// ❌ Eliminar token (logout)
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/pages/login.html";
}

// 🔍 Verificar si hay sesión
function isAuthenticated() {
  return !!getToken();
}

// 🔒 Proteger páginas
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = "./login.html";
  }
}

// 🔑 LOGIN REAL
async function login(nombre, password) {
  const res = await Api.post("auth/login", {
    nombre,
    password,
  });

  if (!res.ok) {
    return res;
  }

  const token = res.data.token;

  setToken(token);

  return { ok: true };
}

// 👤 REGISTER (por si lo usás después)
async function register(nombre, password) {
  return Api.post("auth/register", {
    nombre,
    password,
  });
}

export const Auth = {
  login,
  logout,
  register,
  isAuthenticated,
  requireAuth,
  getToken,
};
