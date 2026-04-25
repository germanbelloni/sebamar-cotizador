const fs = require("fs");
const path = require("path");

// 🔧 PATH HELPER
const { fromRoot } = require("../../utils/path");

// 🧠 SERVICE
const calcularPatagonicaModena = require(
  fromRoot("services", "patagonicas", "calcularPatagonicaModena.js"),
);

// 📦 DATA
const data = require(
  fromRoot("frontend", "data", "productos", "patagonicas_modena.json"),
);

// 🎯 VARIABLES
const colores = ["blanco", "negro", "bronce", "simil madera"];
const perfil = "amarilla";

const tipos = ["1_raja", "2_rajas"];
const vidrios = ["4mm", "dvh", "3+3"];

// 📦 RESULTADO FINAL
let resultados = [];

// 📁 OUTPUT
const baseOutput =
  process.env.OUTPUT_DIR || path.join(process.cwd(), "tests", "output");

const folderName = path.basename(__filename).replace(".gen.js", "");
const outputDir = path.join(baseOutput, folderName);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 🔁 GENERACIÓN
tipos.forEach((tipo) => {
  const medidas = data.tipos?.[tipo]?.medidas || {};

  Object.keys(medidas).forEach((medida) => {
    colores.forEach((color) => {
      vidrios.forEach((tipoVidrio) => {
        try {
          const result = calcularPatagonicaModena({
            tipo,
            medida,
            color,
            tipoVidrio,
            perfil,
          });

          resultados.push({
            input: {
              tipo,
              medida,
              color,
              tipoVidrio,
              perfil,
            },
            output: result,
          });

          console.log(
            `✔ ${tipo} ${medida} (${color}) vidrio:${tipoVidrio} → ${result.total}`,
          );
        } catch (error) {
          resultados.push({
            input: {
              tipo,
              medida,
              color,
              tipoVidrio,
              perfil,
            },
            error: error.message,
          });

          console.log(
            `❌ ERROR → ${tipo} ${medida} (${color}) vidrio:${tipoVidrio}`,
          );
          console.log("   👉", error.message);
        }
      });
    });
  });
});

// 💾 GUARDAR JSON
const nombreArchivo = `patagonicaModena_${Date.now()}.json`;

fs.writeFileSync(
  path.join(outputDir, nombreArchivo),
  JSON.stringify(resultados, null, 2),
);

console.log(`\n✅ JSON generado: ${nombreArchivo}`);



