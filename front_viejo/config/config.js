export const CONFIG = {
  API_URL:
    window.location.port === "5173"
      ? "http://import.meta.env.VITE_API_URL"
      : window.location.origin,
};
