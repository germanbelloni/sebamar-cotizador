const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../../utils/path");

// 🧠 SERVICE
const calcularPostigon = require(
  fromRoot("services/postigones/calcularPostigon.js"),
);

// 📦 DATA
const data = require(fromRoot("frontend/data/productos/postigones.json"));

// 🎯 VARIABLES
const colores = ["blanco", "negro", "bronce", "simil madera"];
const perfil = "amarilla";
const linea = "herrero";

// 📄 CSV
let filas = [];

colores.forEach((color) => {
  console.log(`\n🎨 COLOR: ${color.toUpperCase()}\n`);

  filas.push(`COLOR: ${color.toUpperCase()}`);
  filas.push("medida;corredizo;de_abrir");

  Object.keys(data.medidas).forEach((medida) => {
    try {
      // 🔹 CORREDIZO
      const corredizo = calcularPostigon({
        medida,
        tipo: "corredizo",
        color,
        perfil,
        linea,
      }).total;

      // 🔹 DE ABRIR (con 5%)
      const abrir = calcularPostigon({
        medida,
        tipo: "abrir",
        marco: "ancho",
        color,
        perfil,
        linea,
      }).total;

      filas.push(`${medida};${corredizo};${abrir}`);

      console.log(`✔ ${medida} → OK`);
    } catch (error) {
      filas.push(`${medida};ERROR;ERROR`);

      console.log(`❌ ERROR → medida:${medida} color:${color}`);
      console.log("   👉", error.message);
    }
  });

  filas.push("");
  filas.push("");
});

// 💾 OUTPUT
const outputDir = fromRoot("scripts/tests/outputs/postigones");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const nombreArchivo = `postigones_${Date.now()}.csv`;

fs.writeFileSync(path.join(outputDir, nombreArchivo), filas.join("\n"));

console.log(`\n✅ CSV generado: ${nombreArchivo}`);
