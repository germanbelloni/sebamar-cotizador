const fs = require("fs");
const path = require("path");
const colores = require("../../data/colores.json");

function getColorValor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );
  return c ? c.valor : 0;
}

function calcularVentana(dataInput) {
  const { linea, medida, color, incluirGuia, incluirMosquitero, tipoVidrio } =
    dataInput;

  let filePath;

  if (linea === "herrero") {
    filePath = "data/productos/ventanas_herrero.json";
  }

  if (linea === "modena") {
    filePath = "data/productos/ventanas_modena.json";
  }

  const data = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), filePath), "utf-8"),
  );

  const datos = data.medidas?.[medida];

  if (!datos) throw new Error("Medida no encontrada");

  const base = datos.base || 0;
  const guia = datos.guia || 0;
  const mosq = datos.mosquitero || 0;

  // 🎨 COLOR
  const colorValor = getColorValor(color);
  const baseColor = base * (1 + colorValor);
  const guiaColor = incluirGuia ? guia * (1 + colorValor) : 0;

  // 🪟 VIDRIO
  let vidrio = 0;

  if (linea === "modena") {
    if (tipoVidrio === "dvh") {
      const vidrio4 = datos.vidrios["4mm"] || 0;
      const camara = datos.camara || 0;
      vidrio = vidrio4 * 2 + camara;
    } else {
      vidrio = datos.vidrios?.[tipoVidrio] || 0;
    }
  } else {
    vidrio = datos.vidrio || 0;
  }

  // 💰 BASE FINAL
  let total = baseColor + vidrio;

  const descuento = linea === "modena" ? 0.07 : 0.1;
  const flete = 0.06;
  const ganancia = 0.3;

  total *= 1 - descuento;
  total *= 1 + flete;
  total *= 1 + ganancia;

  total = Math.round(total);

  // 🔹 GUÍA
  let precioGuia = null;

  if (incluirGuia) {
    let g = guiaColor;

    g *= 1 - descuento;
    g *= 1 + flete;
    g *= 1 + ganancia;

    precioGuia = Math.round(g);
  }

  // 🔹 MOSQUITERO
  let precioMosq = 0;

  if (incluirMosquitero) {
    let m = mosq * (1 + colorValor);

    m *= 1 - descuento;
    m *= 1 + flete;
    m *= 1 + ganancia;

    precioMosq = Math.round(m);
  }

  return {
    ventana: total,
    guia: precioGuia,
    mosquitero: incluirMosquitero ? precioMosq : null,
    total: total + (precioGuia || 0) + precioMosq,
  };
}

module.exports = calcularVentana;
