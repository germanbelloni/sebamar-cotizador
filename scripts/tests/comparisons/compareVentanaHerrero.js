const path = require("path");
const XLSX = require("xlsx");

const config = require("../config/configExcel");

// 🧠 SERVICE
const calcularVentana = require(
  path.join(process.cwd(), "services/ventanas/calcularventana.js"),
);

// 📊 EXCEL
const excelPath = path.join(process.cwd(), "excel/calculadora.xlsx");
const workbook = XLSX.readFile(excelPath);

// 🔧 comparación con tolerancia
function iguales(a, b, tolerancia = 3) {
  return Math.abs(a - b) <= tolerancia;
}

const cfg = config.ventanaHerrero;

console.log("📂 Excel cargado desde:");
console.log(excelPath);

// 📄 HOJA
const sheet = workbook.Sheets[cfg.hoja];

// 📦 TODAS LAS FILAS
const filas = XLSX.utils.sheet_to_json(sheet, {
  header: 1,
  defval: null,
});

// 🔍 DEBUG UNA VEZ (NO SE REPITE)
console.log("📄 HOJAS DEL EXCEL:", workbook.SheetNames);
console.log("📊 TOTAL FILAS EXCEL:", filas.length);

console.log("\n🧪 PRIMERAS FILAS CRUDAS:\n");
console.log(filas.slice(0, 10));

// 🔍 ENCONTRAR HEADER REAL
const filaHeaderIndex = filas.findIndex(
  (fila) =>
    fila[cfg.columnas.medida] === "medidas" &&
    fila[cfg.columnas.base] === "vidrio_entero",
);

if (filaHeaderIndex === -1) {
  console.log("❌ No se encontró el header");
  process.exit();
}

console.log("\n📍 HEADER EN FILA:", filaHeaderIndex);

// 🔹 DATOS REALES
const datos = filas.slice(filaHeaderIndex + 1);

// 🔍 DEBUG DE DATOS
console.log("\n🧪 DATOS DETECTADOS:\n");
console.log(
  datos.slice(0, 5).map((fila) => ({
    medida: fila[cfg.columnas.medida],
    base: fila[cfg.columnas.base],
    guia: fila[cfg.columnas.totalGuia],
    mosq: fila[cfg.columnas.mosquitero],
  })),
);

console.log("\n🔍 COMPARANDO VENTANA HERRERO (BLANCO)\n");

// 🔁 LOOP LIMPIO (SIN LOGS EXTRA)
datos.forEach((fila) => {
  const medida = fila[cfg.columnas.medida];

  if (!medida) return;

  const baseExcel = fila[cfg.columnas.base];
  const totalGuiaExcel = fila[cfg.columnas.totalGuia];
  const mosqExcel = fila[cfg.columnas.mosquitero];

  try {
    const base = Math.round(
      calcularVentana({
        medida,
        color: "blanco",
        incluirGuia: false,
        incluirMosquitero: false,
        linea: "herrero",
      }).total,
    );

    const totalConGuia = Math.round(
      calcularVentana({
        medida,
        color: "blanco",
        incluirGuia: true,
        incluirMosquitero: false,
        linea: "herrero",
      }).total,
    );

    const totalConMosq = Math.round(
      calcularVentana({
        medida,
        color: "blanco",
        incluirGuia: false,
        incluirMosquitero: true,
        linea: "herrero",
      }).total,
    );

    const mosq = totalConMosq - base;

    let error = false;

    if (!iguales(base, baseExcel)) {
      console.log(`❌ ${medida} BASE`);
      console.log(`   sistema:${base} excel:${baseExcel}`);
      error = true;
    }

    if (!iguales(totalConGuia, totalGuiaExcel)) {
      console.log(`❌ ${medida} GUIA TOTAL`);
      console.log(`   sistema:${totalConGuia} excel:${totalGuiaExcel}`);
      error = true;
    }

   /*/ if (!iguales(mosq, mosqExcel)) {
      console.log(`❌ ${medida} MOSQ`);
      console.log(`   sistema:${mosq} excel:${mosqExcel}`);
      error = true;
    }/*/

    if (!error) {
      console.log(`✔ OK ${medida}`);
    }
  } catch (err) {
    console.log(`❌ ERROR ${medida}`, err.message);
  }
});

console.log("\n✅ Comparación terminada");
