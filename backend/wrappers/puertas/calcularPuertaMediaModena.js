const { fromRoot } = require("../../../utils/path");

const calcularBase = require(
  fromRoot("services/puertas/calcularPuertaMediaModena"), // ✔ BIEN
);

const superficies = require(
  fromRoot("frontend/data/productos/superficies.json"),
);

const perfiles = require(fromRoot("config/perfiles"));

// 🔹 MAIN
function calcularPuertaModenaWrapper(dataInput) {
  const {
    perfil = "amarilla",
    barral, // "curvo" | "recto"
    picaporte, // true | false
    fueraMedida, // true | false
    anchoTotal, // 110 | 120 | 130
    manoPrincipal, // "izquierda" | "derecha"
  } = dataInput;

  // 🔹 1. BASE
  const resultadoBase = calcularBase(dataInput);

  let total = resultadoBase.base;

  const items = [];

  // 🔹 2. EXTRAS

  // PICAPORTE
  if (picaporte) {
    const precio = superficies.extras?.bipunto || 0;

    if (precio) {
      total += precio;
      items.push({
        tipo: "picaporte",
        precio,
      });
    }
  }

  // BARRAL (solo hoja 80)
  if (barral) {
    const key = `barral_${barral}`;
    const precio = superficies.extras?.[key] || 0;

    if (precio) {
      total += precio;
      items.push({
        tipo: key,
        precio,
      });
    }
  }

  // FUERA DE MEDIDA
  if (fueraMedida) {
    const recargo = total * 0.1;
    total += recargo;

    items.push({
      tipo: "fuera_medida",
      precio: Math.round(recargo),
    });
  }

  // 🔹 3. PERFIL FINAL
  const perfilData = perfiles[perfil]?.modena || perfiles["amarilla"].modena;

  total *= 1 - perfilData.descuento;
  total *= 1 + perfilData.flete;
  total *= 1 + perfilData.ganancia;

  return {
    total: Math.round(total),
    anchoTotal,
    manoPrincipal,
    items,
  };
}

module.exports = calcularPuertaModenaWrapper;
