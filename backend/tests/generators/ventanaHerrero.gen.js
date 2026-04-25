const fs = require("fs");
const path = require("path");

// 🔧 PATH HELPER
const { fromRoot } = require("../../utils/path");

// 📦 DATA
const data = require(
  fromRoot("frontend", "data", "productos", "ventanas_herrero.json"),
);

// 🧠 SERVICE
const calcularVentana = require(
  fromRoot("services", "ventanas", "calcularVentana.js"),
);

// 🎯 CONFIG
const CONFIG = {
  colores: ["blanco", "negro", "bronce", "simil madera"],
  linea: "herrero",
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

function getMedidas() {
  if (!isObject(data?.medidas)) {
    throw new Error("JSON inválido: 'medidas' no existe");
  }

  return Object.keys(data.medidas);
}

// 🔁 GENERADOR
function generar() {
  const { colores, linea } = CONFIG;

  let medidas;

  try {
    medidas = getMedidas();
  } catch (err) {
    console.log(`❌ ${err.message}`);
    return;
  }

  colores.forEach((color) => {
    medidas.forEach((medida) => {
      if (!isValidMedida(medida)) return;

      const inputBase = {
        medida,
        color,
        linea,
      };

      let base = null;
      let totalConGuia = null;
      let totalConMosq = null;

      try {
        const r = calcularVentana({
          ...inputBase,
          incluirGuia: false,
          incluirMosquitero: false,
        });
        base = r?.total ?? null;
      } catch (err) {
        console.log(`❌ base error → ${medida} ${color}`);
      }

      try {
        const r = calcularVentana({
          ...inputBase,
          incluirGuia: true,
          incluirMosquitero: false,
        });
        totalConGuia = r?.total ?? null;
      } catch (err) {
        console.log(`❌ guia error → ${medida} ${color}`);
      }

      try {
        const r = calcularVentana({
          ...inputBase,
          incluirGuia: false,
          incluirMosquitero: true,
        });
        totalConMosq = r?.total ?? null;
      } catch (err) {
        console.log(`❌ mosq error → ${medida} ${color}`);
      }

      const guia =
        base !== null && totalConGuia !== null ? totalConGuia - base : null;

      const mosq =
        base !== null && totalConMosq !== null ? totalConMosq - base : null;

      resultados.push({
        input: inputBase,
        output: {
          base,
          guia,
          mosquitero: mosq,
          totalConGuia,
          totalConMosq,
        },
      });

      console.log(
        `✔ ${medida} (${color}) → base:${base ?? "-"} guia:${guia ?? "-"} mosq:${mosq ?? "-"}`,
      );
    });
  });
}

// 🚀 RUN
generar();

// 💾 SAVE
const nombreArchivo = `ventana_herrero_${Date.now()}.json`;

fs.writeFileSync(
  path.join(outputDir, nombreArchivo),
  JSON.stringify(resultados, null, 2),
);

console.log(`\n✅ JSON generado: ${nombreArchivo}`);



