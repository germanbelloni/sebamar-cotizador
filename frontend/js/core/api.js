import { CONFIG } from "../../config/config.js";

function getToken() {
  return localStorage.getItem("token");
}

async function request(endpoint, options = {}) {
  const url = `${CONFIG.API_URL}/${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
    ...options.headers,
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: data?.error || "Error desconocido",
      };
    }

    return {
      ok: true,
      data,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: "No se pudo conectar con el servidor",
    };
  }
}

export const Api = {
  get(endpoint) {
    return request(endpoint, {
      method: "GET",
    });
  },

  post(endpoint, body) {
    return request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put(endpoint, body) {
    return request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  delete(endpoint) {
    return request(endpoint, {
      method: "DELETE",
    });
  },
};
