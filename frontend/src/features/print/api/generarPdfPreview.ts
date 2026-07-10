import api from "@/lib/api";

type Payload = {
  empresa: unknown;
  cliente: unknown;
  items: unknown[];
};

export async function generarPdfPreview(payload: Payload) {
  const response = await api.post("/pdf/preview", payload, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(response.data);

  const win = window.open();

  if (win) {
    win.location.href = url;
  }
}
