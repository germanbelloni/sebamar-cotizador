const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../../utils/path");

const calcularPatagonicaHerrero = require(
  fromRoot("services/patagonicas/calcularPatagonicaHerrero.js"),
);

const perfil = "amarilla";

// 🎯 ESCENARIOS
const medidas = ["120x100", "150x100", "200x100"];
const tipos = ["1_raja", "2_rajas"];
const rajas = [
  { ancho: 40, tipoVidrio: "4mm" },
  { ancho: 50, tipoVidrio: "4mm" },
];
const colores = ["blanco", "negro"];

// 📄 CSV
let filas = [];

tipos.forEach((tipo) => {
  filas.push(`TIPO: ${tipo}`);

  medidas.forEach((medidaTotal) => {
    colores.forEach((color) => {
      rajas.forEach((raja) => {
        try {
          const resultado = calcularPatagonicaHerrero({
            medidaTotal,
            tipo,
            raja,
            color,
            perfil,
          }).total;

          filas.push(
            `${medidaTotal};${tipo};${raja.ancho};${raja.tipoVidrio};${color};${resultado}`,
          );

          console.log(`✔ ${medidaTotal} ${tipo} raja:${raja.ancho} ${color}`);
        } catch (error) {
          filas.push(
            `${medidaTotal};${tipo};${raja.ancho};${raja.tipoVidrio};${color};ERROR`,
          );

          console.log("❌", error.message);
        }
      });
    });
  });

  filas.push("");
});

// 💾 OUTPUT
const outputDir = fromRoot("scripts/tests/outputs/patagonicas_herrero");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const nombreArchivo = `patagonica_herrero_${Date.now()}.csv`;

fs.writeFileSync(path.join(outputDir, nombreArchivo), filas.join("\n"));

console.log(`\n✅ CSV generado: ${nombreArchivo}`);
