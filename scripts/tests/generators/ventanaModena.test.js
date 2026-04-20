const fs = require("fs");

// 🔧 PATH HELPER
const { fromRoot } = require("../../../utils/path");

// 🧠 SERVICE
const calcularVentana = require(
  fromRoot("services/ventanas/calcularventana.js"),
);

// 📦 DATA
const data = require(fromRoot("frontend/data/productos/ventanas_modena.json"));

const medidas = Object.keys(data.medidas);

// 📦 RESULTADO FINAL
let resultados = [];

medidas.forEach((medida) => {
  try {
    const color = "blanco"; // fijamos para consistencia

    // 🔹 VIDRIOS (BASES)
    const v3 = calcularVentana({
      medida,
      color,
      tipoVidrio: "3mm",
      incluirGuia: false,
      incluirMosquitero: false,
      linea: "modena",
    }).total;

    const v4 = calcularVentana({
      medida,
      color,
      tipoVidrio: "4mm",
      incluirGuia: false,
      incluirMosquitero: false,
      linea: "modena",
    }).total;

    const v5 = calcularVentana({
      medida,
      color,
      tipoVidrio: "5mm",
      incluirGuia: false,
      incluirMosquitero: false,
      linea: "modena",
    }).total;

    const v33 = calcularVentana({
      medida,
      color,
      tipoVidrio: "3+3",
      incluirGuia: false,
      incluirMosquitero: false,
      linea: "modena",
    }).total;

    // 🔹 BASE REFERENCIA (IMPORTANTE)
    const base = v3;

    // 🔹 GUIA (aislada correctamente)
    const totalConGuia = calcularVentana({
      medida,
      color,
      tipoVidrio: "3mm",
      incluirGuia: true,
      incluirMosquitero: false,
      linea: "modena",
    }).total;

    const guia = totalConGuia - base;

    // 🔹 MOSQUITER0 (aislado correctamente)
    const totalConMosq = calcularVentana({
      medida,
      color,
      tipoVidrio: "3mm",
      incluirGuia: false,
      incluirMosquitero: true,
      linea: "modena",
    }).total;

    const mosq = totalConMosq - base;

    // 🔹 DVH
    const dvh = calcularVentana({
      medida,
      color,
      tipoVidrio: "dvh",
      incluirGuia: false,
      incluirMosquitero: false,
      linea: "modena",
    }).total;

    resultados.push({
      input: {
        medida,
        color,
        linea: "modena",
      },
      output: {
        vidrios: {
          "3mm": v3,
          "4mm": v4,
          "5mm": v5,
          "3+3": v33,
          dvh,
        },
        adicionales: {
          guia,
          mosquitero: mosq,
        },
      },
    });

    console.log(`✔ ${medida} → 3mm:${v3} guia:${guia} mosq:${mosq} dvh:${dvh}`);
  } catch (err) {
    resultados.push({
      input: {
        medida,
        color: "blanco",
        linea: "modena",
      },
      error: err.message,
    });

    console.log(`❌ ERROR ${medida}`);
    console.log("   👉", err.message);
  }
});

// 💾 GUARDAR JSON
const nombreArchivo = `output_modena_${Date.now()}.json`;

fs.writeFileSync(
  fromRoot("scripts/tests/outputs/ventana_modena", nombreArchivo),
  JSON.stringify(resultados, null, 2),
);

console.log(`\n✅ JSON generado: ${nombreArchivo}`);
