const fs = require("fs");
const path = require("path");

// 🧠 SERVICE
const calcularVentana = require(
  path.join(process.cwd(), "services/ventanas/calcularventana.js"),
);

// 📦 DATA
const data = require(
  path.join(process.cwd(), "frontend/data/productos/ventanas_modena.json"),
);

const medidas = Object.keys(data.medidas);

// 📄 CSV
let filas = [];

// encabezado
filas.push("medida;3mm;4mm;5mm;3+3;guia;mosq;dvh");

medidas.forEach((medida) => {
  try {
    // 🔹 VIDRIOS
    const v3 = calcularVentana({
      medida,
      color: "blanco",
      tipoVidrio: "3mm",
      incluirGuia: false,
      incluirMosquitero: false,
      linea: "modena",
    }).total;

    const v4 = calcularVentana({
      medida,
      color: "blanco",
      tipoVidrio: "4mm",
      incluirGuia: false,
      incluirMosquitero: false,
      linea: "modena",
    }).total;

    const v5 = calcularVentana({
      medida,
      color: "blanco",
      tipoVidrio: "5mm",
      incluirGuia: false,
      incluirMosquitero: false,
      linea: "modena",
    }).total;

    const v33 = calcularVentana({
      medida,
      color: "blanco",
      tipoVidrio: "3+3",
      incluirGuia: false,
      incluirMosquitero: false,
      linea: "modena",
    }).total;

    // 🔹 BASE PARA RESTAR
    const base = v3;

    // 🔹 GUIA (solo valor)
    const totalConGuia = calcularVentana({
      medida,
      color: "blanco",
      tipoVidrio: "3mm",
      incluirGuia: true,
      incluirMosquitero: false,
      linea: "modena",
    }).total;

    const guia = totalConGuia - base;

    // 🔹 MOSQUITER0 (solo valor)
    const totalConMosq = calcularVentana({
      medida,
      color: "blanco",
      tipoVidrio: "3mm",
      incluirGuia: false,
      incluirMosquitero: true,
      linea: "modena",
    }).total;

    const mosq = totalConMosq - base;

    // 🔹 DVH
    const dvh = calcularVentana({
      medida,
      color: "blanco",
      tipoVidrio: "dvh",
      incluirGuia: false,
      incluirMosquitero: false,
      linea: "modena",
    }).total;

    filas.push(`${medida};${v3};${v4};${v5};${v33};${guia};${mosq};${dvh}`);

    console.log(`✔ ${medida}`);
  } catch (err) {
    filas.push(`${medida};ERROR;ERROR;ERROR;ERROR;ERROR;ERROR;ERROR`);
    console.log(`❌ ERROR ${medida}`);
  }
});

// 💾 GUARDAR
const nombreArchivo = `output_modena_${Date.now()}.csv`;

fs.writeFileSync(
  path.join(
    process.cwd(),
    "scripts/tests/outputs/ventana_modena",
    nombreArchivo,
  ),
  filas.join("\n"),
);

console.log(`\n✅ CSV generado: ${nombreArchivo}`);
