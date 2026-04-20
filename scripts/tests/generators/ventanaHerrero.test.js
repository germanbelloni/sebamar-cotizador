const fs = require("fs");

// 🔧 PATH HELPER
const { fromRoot } = require("../../../utils/path");

// 📦 DATA
const data = require(fromRoot("frontend/data/productos/ventanas_herrero.json"));

// 🧠 SERVICE
const calcularVentana = require(
  fromRoot("services/ventanas/calcularventana.js"),
);

// 🎯 VARIABLES
const colores = ["blanco", "negro", "bronce", "simil madera"];

// 📦 RESULTADO FINAL
let resultados = [];

colores.forEach((color) => {
  Object.keys(data.medidas).forEach((medida) => {
    try {
      const baseResult = calcularVentana({
        medida,
        color,
        incluirGuia: false,
        incluirMosquitero: false,
        linea: "herrero",
      });

      const guiaResult = calcularVentana({
        medida,
        color,
        incluirGuia: true,
        incluirMosquitero: false,
        linea: "herrero",
      });

      const mosqResult = calcularVentana({
        medida,
        color,
        incluirGuia: false,
        incluirMosquitero: true,
        linea: "herrero",
      });

      const base = baseResult.total;
      const totalConGuia = guiaResult.total;
      const totalConMosq = mosqResult.total;

      const guia = totalConGuia - base;
      const mosq = totalConMosq - base;

      resultados.push({
        input: {
          medida,
          color,
          linea: "herrero",
        },
        output: {
          base,
          guia,
          mosquitero: mosq,
          totalConGuia,
          totalConMosq,
        },
      });

      console.log(
        `✔ ${medida} (${color}) → base:${base} guia:${guia} mosq:${mosq}`,
      );
    } catch (error) {
      resultados.push({
        input: {
          medida,
          color,
          linea: "herrero",
        },
        error: error.message,
      });

      console.log(`❌ ERROR → medida:${medida} color:${color}`);
      console.log("   👉", error.message);
    }
  });
});

// 💾 GUARDAR JSON
const nombreArchivo = `output_ventana_herrero_${Date.now()}.json`;

fs.writeFileSync(
  fromRoot("scripts/tests/outputs/ventana_herrero", nombreArchivo),
  JSON.stringify(resultados, null, 2),
);

console.log(`\n✅ JSON generado: ${nombreArchivo}`);
