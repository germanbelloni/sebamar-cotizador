const fs = require("fs");
const { fromRoot } = require("../../utils/path");

const colores = require(fromRoot("frontend/data/colores.json"));

// 🎨 COLOR
function getColorValor(color) {
  const c = colores.find(
    (x) => x.nombre.toLowerCase().trim() === (color || "").toLowerCase().trim(),
  );
  return c ? c.valor : 0;
}

function calcularRaja(dataInput) {
  const { medida, tipoVidrio, color, linea = "herrero" } = dataInput;

  const filePath = fromRoot(`frontend/data/productos/rajas_${linea}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  let datos = null;

  if (data.tipos) {
    for (const tipo in data.tipos) {
      const medidas = data.tipos[tipo].medidas;
      if (medidas?.[medida]) {
        datos = medidas[medida];
        break;
      }
    }
  }

  if (!datos && data.medidas) {
    datos = data.medidas[medida];
  }

  if (!datos) {
    throw new Error(`Medida no encontrada: ${medida}`);
  }

  const base = datos.base || 0;
  const vidrio = datos.vidrios?.[tipoVidrio] || 0;

  const colorValor = getColorValor(color);

  const costoBase = (base + vidrio) * (1 + colorValor);

  return {
    costoBase,
  };
}

module.exports = calcularRaja;
