const fs = require("fs");
const path = require("path");

// 🔧 PATH HELPER
const { fromRoot } = require("../../../utils/path");

// 🧠 SERVICE
const calcularPuerta = require(fromRoot("services/puertas/calcularPuerta.js"));

// 📦 DATA
const dataMap = {
  herrero: require(fromRoot("frontend/data/productos/puertas_herrero.json")),
  modena: require(fromRoot("frontend/data/productos/puertas_modena.json")),
  eco: require(fromRoot("frontend/data/productos/puertas_eco.json")),
};

// 🎯 CONFIG
const CONFIG = {
  colores: ["blanco", "negro", "bronce", "simil madera"],
  perfil: "amarilla",
  medidas: {
    simple: ["70x200", "80x200", "90x200"],
    doble: ["140x200", "160x200", "180x200"],
    porton: ["210x200", "240x200", "270x200"],
  },
  vidriosPorLinea: {
    herrero: ["3mm", "4mm", "5mm", "fantasia", "esmerilado", "3+3"],
    modena: ["4mm", "3+3", "dvh"],
    eco: ["3mm", "4mm", "fantasia"],
  },
};

// 📦 RESULTADOS
let resultados = [];

// 📁 OUTPUT
const baseOutput = process.env.OUTPUT_DIR || "scripts/tests/outputs";
const outputDir = fromRoot(`${baseOutput}/puertas`);

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

function getModelos(data) {
  if (!isObject(data?.modelos)) {
    throw new Error("JSON inválido: 'modelos' no existe");
  }

  return Object.keys(data.modelos).filter((m) => {
    return (
      !m.toLowerCase().includes("barral") &&
      !m.toLowerCase().includes("adicional")
    );
  });
}

// 🔁 GENERADOR
function generar() {
  const { colores, perfil, medidas, vidriosPorLinea } = CONFIG;

  Object.keys(dataMap).forEach((linea) => {
    const data = dataMap[linea];

    let modelos;
    try {
      modelos = getModelos(data);
    } catch (err) {
      console.log(`❌ ${linea}: ${err.message}`);
      return;
    }

    const vidrios = vidriosPorLinea[linea];

    if (!Array.isArray(vidrios)) {
      console.log(`❌ vidrios no definidos para linea: ${linea}`);
      return;
    }

    modelos.forEach((modelo) => {
      const producto = data.modelos[modelo];
      if (!producto) return;

      Object.keys(medidas).forEach((tipo) => {
        medidas[tipo].forEach((medida) => {
          if (!isValidMedida(medida)) return;

          colores.forEach((color) => {
            vidrios.forEach((tipoVidrio) => {
              // 🚫 regla sin vidrio
              if (producto.sinVidrio && tipoVidrio !== "3mm") return;

              const input = {
                tipo,
                linea,
                modelo,
                medida,
                color,
                tipoVidrio,
                perfil,
              };

              try {
                const result = calcularPuerta(input);

                resultados.push({ input, output: result });

                console.log(
                  `✔ ${linea} | ${tipo} | ${modelo} | ${medida} | ${color} | ${tipoVidrio} → ${result?.total ?? "sin_total"}`,
                );
              } catch (error) {
                resultados.push({ input, error: error.message });

                console.log(`❌ ERROR → ${linea} ${modelo} ${medida}`);
                console.log("   👉", error.message);
              }
            });
          });
        });
      });
    });
  });
}

// 🚀 RUN
generar();

// 💾 SAVE
const nombreArchivo = `output_puertas_${Date.now()}.json`;

fs.writeFileSync(
  path.join(outputDir, nombreArchivo),
  JSON.stringify(resultados, null, 2),
);

console.log(`\n✅ JSON generado: ${nombreArchivo}`);
