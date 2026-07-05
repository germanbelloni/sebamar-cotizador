import api from "@/lib/api";

type Payload = {
  empresa: unknown;
  cliente: unknown;
  items: unknown[];
};

export async function generarPdf(payload: Payload) {
  const { data } = await api.post("/pdf/preview", payload, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(data);

  window.open(url, "_blank");
}
