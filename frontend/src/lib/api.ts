const API_URL = import.meta.env.VITE_API_URL + "/api";

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),

      ...options?.headers,
    },

    ...options,
  });

  if (!response.ok) {
    let errorMessage = "Error en request";

    try {
      const errorData = await response.json();

      errorMessage = errorData.error || errorMessage;
    } catch {
      // ignore
    }

    throw new Error(errorMessage);
  }

  return response.json();
}
