const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcular = require(fromRoot("wrappers/placas/calcularPuertaPlaca"));

const data = require(fromRoot("frontend/data/productos/puertas_placa.json"));

// 📦 RESULTADOS
let resultados = [];

// 📁 OUTPUT
const baseOutput =
  process.env.OUTPUT_DIR || path.join(process.cwd(), "backend/tests/output");

const folderName = path.basename(__filename).replace(".gen.js", "");
const outputDir = path.join(baseOutput, folderName);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// =========================
// 🔁 GENERADOR
// =========================
Object.keys(data).forEach((tipo) => {
  Object.keys(data[tipo]).forEach((modelo) => {
    Object.keys(data[tipo][modelo]).forEach((medida) => {
      Object.keys(data[tipo][modelo][medida]).forEach((marco) => {
        try {
          const [ancho, alto] = medida.split("x").map(Number);

          const input = {
            ancho,
            alto,
            tipo,
            modelo,
            marco,
          };

          const res = calcular(input);

          resultados.push({
            input,
            output: res,
          });

          console.log(`✔ ${tipo} ${modelo} ${medida} → ${res.precioVenta}`);
        } catch (e) {
          resultados.push({
            input: { tipo, modelo, medida, marco },
            error: e.message,
          });

          console.log(`❌ ${tipo} ${modelo} ${medida}`);
        }
      });
    });
  });
});

// =========================
// 💾 SAVE
// =========================
const nombreArchivo = `puertaPlaca_${Date.now()}.json`;

fs.writeFileSync(
  path.join(outputDir, nombreArchivo),
  JSON.stringify(resultados, null, 2),
);

console.log(`\n✅ JSON generado: ${nombreArchivo}`);
