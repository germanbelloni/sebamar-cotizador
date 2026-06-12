export function formatLinea(linea?: string) {
  if (!linea) return "-";

  if (linea === "herrero") return "Herrero";
  if (linea === "modena") return "Módena";

  return linea;
}

export function formatColor(color?: string) {
  if (!color) return "-";

  if (color === "blanco") return "Blanco";
  if (color === "negro") return "Negro";
  if (color === "simil madera") return "Simil madera";
  if (color === "bronce colonial") return "Bronce colonial";

  return color;
}

export function formatVidrio(vidrio?: string) {
  if (!vidrio) return "-";

  const map: Record<string, string> = {
    fantasia: "Fantasía",
    esmerilado: "Esmerilado",
    dvh_4_9_4: "DVH 4+9+4",
    dvh_5_9_5: "DVH 5+9+5",
  };

  return map[vidrio] || vidrio;
}
