const fs = require("fs");
const path = require("path");

// 🔧 PATH HELPER
const { fromRoot } = require("../../../utils/path");

// 🧠 SERVICE
const calcularPuerta = require(fromRoot("services/puertas/calcularPuerta.js"));

// 📦 DATA
const dataHerrero = require(
  fromRoot("frontend/data/productos/puertas_herrero.json"),
);

const dataModena = require(
  fromRoot("frontend/data/productos/puertas_modena.json"),
);

const dataEco = require(fromRoot("frontend/data/productos/puertas_eco.json"));

// 🎯 CONFIG
const colores = ["blanco", "negro", "bronce", "simil madera"];
const perfil = "amarilla";

// 📏 MEDIDAS
const medidas = {
  simple: ["70x200", "80x200", "90x200"],
  doble: ["140x200", "160x200", "180x200"],
  porton: ["210x200", "240x200", "270x200"],
};

// 🪟 VIDRIOS POR LINEA
const vidriosPorLinea = {
  herrero: ["3mm", "4mm", "5mm", "fantasia", "esmerilado", "3+3"],
  modena: ["4mm", "3+3", "dvh"],
  eco: ["3mm", "4mm", "fantasia"],
};

// 📦 DATA MAP
const dataMap = {
  herrero: dataHerrero,
  modena: dataModena,
  eco: dataEco,
};

// 📦 RESULTADOS
let resultados = [];

// 📁 OUTPUT
const outputDir = fromRoot("scripts/tests/outputs/puertas");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 🔁 GENERADOR
Object.keys(dataMap).forEach((linea) => {
  const data = dataMap[linea];

  const modelos = Object.keys(data.modelos || {}).filter(
    (m) => !m.includes("barral") && !m.includes("adicionales"),
  );

  modelos.forEach((modelo) => {
    const producto = data.modelos[modelo];

    const vidrios = vidriosPorLinea[linea];

    Object.keys(medidas).forEach((tipo) => {
      medidas[tipo].forEach((medida) => {
        colores.forEach((color) => {
          vidrios.forEach((tipoVidrio) => {
            try {
              // 🚫 evitar vidrios inválidos
              if (producto.sinVidrio && tipoVidrio !== "3mm") {
                return;
              }

              const result = calcularPuerta({
                tipo,
                linea,
                modelo,
                medida,
                color,
                tipoVidrio,
                perfil,
              });

              resultados.push({
                input: {
                  tipo,
                  linea,
                  modelo,
                  medida,
                  color,
                  tipoVidrio,
                  perfil,
                },
                output: result,
              });

              console.log(
                `✔ ${linea} | ${tipo} | ${modelo} | ${medida} | ${color} | ${tipoVidrio} → ${result.total}`,
              );
            } catch (error) {
              resultados.push({
                input: {
                  tipo,
                  linea,
                  modelo,
                  medida,
                  color,
                  tipoVidrio,
                  perfil,
                },
                error: error.message,
              });

              console.log(`❌ ERROR → ${linea} ${modelo} ${medida}`);
              console.log("   👉", error.message);
            }
          });
        });
      });
    });
  });
});

// 💾 GUARDAR
const nombreArchivo = `output_puertas_${Date.now()}.json`;

fs.writeFileSync(
  path.join(outputDir, nombreArchivo),
  JSON.stringify(resultados, null, 2),
);

console.log(`\n✅ JSON generado: ${nombreArchivo}`);
