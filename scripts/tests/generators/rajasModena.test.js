const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../../utils/path");

// 📦 DATA
const data = require(fromRoot("frontend/data/productos/rajas_modena.json"));

// 🧠 SERVICE
const calcularRaja = require(fromRoot("services/rajas/calcularRaja.js"));

// 🎯 VARIABLES
const colores = ["blanco", "negro", "bronce", "simil madera"];
const vidrios = ["3mm", "4mm", "5mm", "esmerilado", "fantasia", "3+3"];
const perfil = "amarilla";

// 📄 CSV
let filas = [];

colores.forEach((color) => {
  console.log(`\n🎨 COLOR: ${color.toUpperCase()}\n`);

  // 🔹 ENCABEZADO
  filas.push(`COLOR: ${color.toUpperCase()}`);
  filas.push("medida;3mm;4mm;5mm;esmerilado;fantasia;3+3;dvh");

  Object.keys(data.medidas).forEach((medida) => {
    try {
      let resultados = [];

      // 🔹 VIDRIOS NORMALES
      vidrios.forEach((vidrio) => {
        const r = calcularRaja({
          medida,
          tipoVidrio: vidrio,
          color,
          perfil,
          linea: "modena",
        });

        resultados.push(r.total);
      });

      // 🔵 DVH (caso especial)
      const datos = data.medidas[medida];

      const vidrio4 = datos.vidrios["4mm"] || 0;
      const camara = datos.camara || 0;

      const rDvh = calcularRaja({
        medida,
        tipoVidrio: "4mm",
        color,
        perfil,
        linea: "modena",
        extraVidrio: vidrio4 + camara, // 🔥 clave
      });

      resultados.push(rDvh.total);

      filas.push(`${medida};${resultados.join(";")}`);

      console.log(`✔ ${medida} → OK`);
    } catch (error) {
      filas.push(`${medida};ERROR;ERROR;ERROR;ERROR;ERROR;ERROR;ERROR`);

      console.log(`❌ ERROR → medida:${medida} color:${color}`);
      console.log("   👉", error.message);
    }
  });

  filas.push("");
  filas.push("");
});

// 💾 OUTPUT
const nombreArchivo = `rajas_modena_${Date.now()}.csv`;

const outputDir = fromRoot("scripts/tests/outputs/rajas_modena");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, nombreArchivo), filas.join("\n"));

console.log(`\n✅ CSV generado: ${nombreArchivo}`);
