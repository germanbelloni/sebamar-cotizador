export const CONFIG = {
  API_URL:
    window.location.port === "5173"
      ? "http://localhost:3000"
      : window.location.origin,
};
