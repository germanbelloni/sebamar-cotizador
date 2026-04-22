const fs = require("fs");
const path = require("path");

// 🔧 PATH HELPER
const fromRoot = (...paths) => path.join(process.cwd(), ...paths);

// 🧠 SERVICE
const calcularPuertaPlaca = require(
  fromRoot("services", "placas", "calcularPuertaPlaca.js")
);

// 📦 DATA
const data = require(
  fromRoot("frontend", "data", "productos", "puertas_placa.json")
);

// 🎯 CONFIG
const CONFIG = {
  perfil: "amarilla",
};

// 📦 RESULTADOS
let resultados = [];

// 📁 OUTPUT
const baseOutput =
  process.env.OUTPUT_DIR || path.join(process.cwd(), "tests", "output");

const folderName = path.basename(__filename).replace(".gen.js", "");
const outputDir = path.join(baseOutput, folderName);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 🔍 VALIDADORES
function isObject(val) {
  return val && typeof val === "object" && !Array.isArray(val);
}

function isValidMedida(medida) {
  return typeof medida === "string" && medida.includes("x");
}

// 🔁 GENERADOR
function generar() {
  const { perfil } = CONFIG;

  if (!isObject(data)) {
    console.log("❌ JSON inválido: data no es objeto");
    return;
  }

  Object.keys(data).forEach((tipo) => {
    const modelos = data[tipo];
    if (!isObject(modelos)) return;

    Object.keys(modelos).forEach((modelo) => {
      const medidas = modelos[modelo];
      if (!isObject(medidas)) return;

      Object.keys(medidas).forEach((medida) => {
        if (!isValidMedida(medida)) return;

        const marcos = medidas[medida];
        if (!isObject(marcos)) return;

        Object.keys(marcos).forEach((marco) => {
          const input = {
            tipo,
            modelo,
            medida,
            marco,
            perfil,
          };

          try {
            const result = calcularPuertaPlaca(input);

            resultados.push({
              input,
              output: result,
            });

            console.log(
              `✔ ${tipo} - ${modelo} - ${medida} - ${marco} → ${
                result?.total ?? "sin_total"
              }`
            );
          } catch (error) {
            resultados.push({
              input,
              error: error.message,
            });

            console.log(`❌ ERROR → ${tipo} ${modelo} ${medida} ${marco}`);
            console.log("   👉", error.message);
          }
        });
      });
    });
  });
}

// 🚀 RUN
generar();

// 💾 SAVE
const nombreArchivo = `puertas_placa_${Date.now()}.json`;

fs.writeFileSync(
  path.join(outputDir, nombreArchivo),
  JSON.stringify(resultados, null, 2)
);

console.log(`\n✅ JSON generado: ${nombreArchivo}`);