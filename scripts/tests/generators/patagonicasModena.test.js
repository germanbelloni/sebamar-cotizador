const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../../utils/path");

// 🧠 SERVICE
const calcularPatagonicaModena = require(
  fromRoot("services/patagonicas/calcularPatagonicaModena.js"),
);

// 📦 DATA
const data = require(
  fromRoot("frontend/data/productos/patagonicas_modena.json"),
);

// 🎯 VARIABLES
const colores = ["blanco", "negro", "bronce", "simil madera"];
const perfil = "amarilla";

const tipos = ["1_raja", "2_rajas"];
const vidrios = ["4mm", "dvh", "3+3"];

// 📄 CSV
let filas = [];

tipos.forEach((tipo) => {
  filas.push(`TIPO: ${tipo.toUpperCase()}`);

  colores.forEach((color) => {
    console.log(`\n🪟 ${tipo} - COLOR: ${color.toUpperCase()}`);

    filas.push(`COLOR: ${color.toUpperCase()}`);
    filas.push("medida;4mm;dvh;3+3");

    const medidas = data.tipos?.[tipo]?.medidas || {};

    Object.keys(medidas).forEach((medida) => {
      try {
        const val4 = calcularPatagonicaModena({
          tipo,
          medida,
          color,
          tipoVidrio: "4mm",
          perfil,
        }).total;

        const dvh = calcularPatagonicaModena({
          tipo,
          medida,
          color,
          tipoVidrio: "dvh",
          perfil,
        }).total;

        const v33 = calcularPatagonicaModena({
          tipo,
          medida,
          color,
          tipoVidrio: "3+3",
          perfil,
        }).total;

        filas.push(`${medida};${val4};${dvh};${v33}`);

        console.log(`✔ ${medida}`);
      } catch (error) {
        filas.push(`${medida};ERROR;ERROR;ERROR`);

        console.log(`❌ ERROR → ${medida}`);
        console.log("   👉", error.message);
      }
    });

    filas.push("");
    filas.push("");
  });

  filas.push("");
  filas.push("====================================");
  filas.push("");
});

// 💾 OUTPUT
const outputDir = fromRoot("scripts/tests/outputs/patagonicas_modena");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const nombreArchivo = `patagonicas_modena_${Date.now()}.csv`;

fs.writeFileSync(path.join(outputDir, nombreArchivo), filas.join("\n"));

console.log(`\n✅ CSV generado: ${nombreArchivo}`);
