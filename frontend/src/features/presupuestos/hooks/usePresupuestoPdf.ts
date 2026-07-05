import { getPresupuestoPdf } from "../api/getPresupuestoPdf";

export function usePresupuestoPdf() {
  async function download(id: string) {
    const blob = await getPresupuestoPdf(id);

    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
  }

  return {
    download,
  };
}
