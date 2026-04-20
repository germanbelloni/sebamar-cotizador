const fs = require("fs");
const path = require("path");

// 📦 DATA
const { fromRoot } = require("../../../utils/path");

const data = require(fromRoot("frontend/data/productos/rajas_herrero.json"));

// 🧠 SERVICE
const calcularRaja = require(
  path.join(process.cwd(), "services/rajas/calcularRaja.js"),
);

// 🎯 VARIABLES
const colores = ["blanco", "negro", "bronce", "simil madera"];
const vidrios = ["3mm", "4mm", "5mm", "esmerilado", "fantasia", "3+3"];
const perfil = "amarilla";

// 📄 CSV
let filas = [];

colores.forEach((color) => {
  console.log(`\n🎨 COLOR: ${color.toUpperCase()}\n`);

  // 🔹 TITULO
  filas.push(`COLOR: ${color.toUpperCase()}`);
  filas.push("medida;3mm;4mm;5mm;esmerilado;fantasia;3+3");

  Object.keys(data.medidas).forEach((medida) => {
    try {
      let resultados = [];

      vidrios.forEach((vidrio) => {
        const r = calcularRaja({
          medida,
          tipoVidrio: vidrio,
          color,
          perfil,
        });

        resultados.push(r.total);
      });

      filas.push(`${medida};${resultados.join(";")}`);

      console.log(`✔ ${medida} → OK`);
    } catch (error) {
      filas.push(`${medida};ERROR;ERROR;ERROR;ERROR;ERROR;ERROR`);

      console.log(`❌ ERROR → medida:${medida} color:${color}`);
      console.log("   👉", error.message);
    }
  });

  // 🔹 ESPACIO ENTRE BLOQUES
  filas.push("");
  filas.push("");
});

// 💾 OUTPUT
const nombreArchivo = `rajas_herrero_${Date.now()}.csv`;

const outputDir = path.join(
  process.cwd(),
  "scripts/tests/outputs/rajas_herrero",
);

// crear carpeta si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, nombreArchivo), filas.join("\n"));

console.log(`\n✅ CSV generado: ${nombreArchivo}`);
