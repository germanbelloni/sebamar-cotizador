const { fromRoot } = require("../../utils/path");

const calcularMosquitero = require(
  fromRoot("services/mosquiteros/calcularMosquitero"),
);

const mosquiterosData = require(
  fromRoot("frontend/data/productos/mosquiteros.json"),
);

// 📐 obtener medidas disponibles
function getMedidasDisponibles() {
  return Object.keys(mosquiterosData.medidas).map((key) => {
    const [ancho, alto] = key.split("x").map(Number);
    return { ancho, alto, key };
  });
}

// 📐 lookup hacia arriba
function buscarMedidaValida(anchoInput, altoInput) {
  const medidas = getMedidasDisponibles();

  // validaciones
  if (anchoInput < 60 || anchoInput > 200) {
    throw new Error("Ancho fuera de rango (60 - 200)");
  }

  if (altoInput < 50 || altoInput > 205) {
    throw new Error("Alto fuera de rango (50 - 205)");
  }

  // candidatas válidas
  const candidatas = medidas.filter(
    (m) => m.ancho >= anchoInput && m.alto >= altoInput,
  );

  if (candidatas.length === 0) {
    throw new Error("No hay medida disponible para esa combinación");
  }

  // elegir la más cercana (menor área)
  candidatas.sort((a, b) => a.ancho * a.alto - b.ancho * b.alto);

  return candidatas[0];
}

// 🧠 FUNCIÓN PRINCIPAL
function calcularMosquiteroVentana({ ancho, alto, color }) {
  // 1. normalizar
  const medidaValida = buscarMedidaValida(ancho, alto);

  // 2. delegar al service (IMPORTANTE)
  const resultado = calcularMosquitero({
    medida: medidaValida.key,
    color,
  });

  // 3. descripción prolija
  const colorTexto = color ? ` ${color}` : "";

  const descripcion = `Mosquitero fijo aluminio${colorTexto} para ventana de ${medidaValida.key}`;

  return {
    total: resultado.total,
    medida: medidaValida.key,
    descripcion,
  };
}

module.exports = calcularMosquiteroVentana;
