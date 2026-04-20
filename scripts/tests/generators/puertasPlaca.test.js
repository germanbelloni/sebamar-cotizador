const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../../utils/path");

// 🧠 SERVICE
const calcularPuertaPlaca = require(
  fromRoot("services/placas/calcularPuertaPlaca.js"),
);

// 📦 DATA
const data = require(fromRoot("frontend/data/productos/puertas_placas.json"));

// 🎯 CONFIG
const perfil = "amarilla";

// 📄 CSV
let filas = [];

Object.keys(data).forEach((tipo) => {
  filas.push(`TIPO: ${tipo.toUpperCase()}`);

  const modelos = data[tipo];

  Object.keys(modelos).forEach((modelo) => {
    filas.push(`MODELO: ${modelo}`);
    filas.push("medida;marco;total");

    const medidas = modelos[modelo];

    Object.keys(medidas).forEach((medida) => {
      const marcos = medidas[medida];

      Object.keys(marcos).forEach((marco) => {
        try {
          const resultado = calcularPuertaPlaca({
            tipo,
            modelo,
            medida,
            marco,
            perfil,
          }).total;

          filas.push(`${medida};${marco};${resultado}`);

          console.log(`✔ ${tipo} - ${modelo} - ${medida} - ${marco}`);
        } catch (error) {
          filas.push(`${medida};${marco};ERROR`);

          console.log(`❌ ERROR → ${tipo} ${modelo} ${medida} ${marco}`);
          console.log("   👉", error.message);
        }
      });
    });

    filas.push("");
  });

  filas.push("====================================");
  filas.push("");
});

// 💾 OUTPUT
const outputDir = fromRoot("scripts/tests/outputs/puertas_placa");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const nombreArchivo = `puertas_placa_${Date.now()}.csv`;

fs.writeFileSync(path.join(outputDir, nombreArchivo), filas.join("\n"));

console.log(`\n✅ CSV generado: ${nombreArchivo}`);
