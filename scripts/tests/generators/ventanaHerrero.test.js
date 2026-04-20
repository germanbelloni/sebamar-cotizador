const fs = require("fs");
const path = require("path");

// 📦 DATA
const data = require(
  path.join(process.cwd(), "frontend/data/productos/ventanas_herrero.json"),
);

// 🧠 SERVICE
const calcularVentana = require(
  path.join(process.cwd(), "services/ventanas/calcularventana.js"),
);

// 🎯 VARIABLES
const colores = ["blanco", "negro", "bronce", "simil madera"];
const guias = [false, true];

// 📄 CSV
let filas = [];

colores.forEach((color) => {
  console.log(`\n🎨 COLOR: ${color.toUpperCase()}\n`);

  // 🔹 TÍTULO DE BLOQUE
  filas.push(`COLOR: ${color.toUpperCase()}`);
  filas.push("medida;vidrio_entero;guia;mosquitero");

  Object.keys(data.medidas).forEach((medida) => {
    try {
      const base = calcularVentana({
        medida,
        color,
        incluirGuia: false,
        incluirMosquitero: false,
      }).total;

      const totalConGuia = calcularVentana({
        medida,
        color,
        incluirGuia: true,
        incluirMosquitero: false,
      }).total;

      const totalConMosq = calcularVentana({
        medida,
        color,
        incluirGuia: false,
        incluirMosquitero: true,
      }).total;

      // 🔥 VALORES PUROS
      const guia = totalConGuia - base;
      const mosq = totalConMosq - base;

      filas.push(`${medida};${base};${guia};${mosq}`);

      console.log(`✔ ${medida} → base:${base} guia:${guia} mosq:${mosq}`);
    } catch (error) {
      filas.push(`${medida};ERROR;ERROR;ERROR`);

      console.log(`❌ ERROR → medida:${medida} color:${color}`);

      console.log("   👉", error.message);
    }
  });

  // 🔹 ESPACIO ENTRE COLORES
  filas.push("");
  filas.push("");
});

// 💾 GUARDAR CSV
const nombreArchivo = `output_ventana_herrero_${Date.now()}.csv`;

fs.writeFileSync(
  path.join(
    process.cwd(),
    "scripts/tests/outputs/ventana_herrero",
    nombreArchivo,
  ),
  filas.join("\n"),
);

console.log(`\n✅ CSV generado: ${nombreArchivo}`);
