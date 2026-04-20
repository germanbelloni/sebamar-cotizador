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

function iguales(a, b, tolerancia = 5) {
  return Math.abs(a - b) <= tolerancia;
}

const cfg = config.ventanaModena;

console.log("\n🔍 COMPARANDO MODENA\n");

const sheet = workbook.Sheets[cfg.hoja];

const filas = XLSX.utils.sheet_to_json(sheet, {
  header: 1,
  defval: null,
});

// 🔍 encontrar header
const filaHeaderIndex = filas.findIndex(
  (fila) =>
    fila[cfg.columnas.medida] === "medidas" &&
    fila[cfg.columnas.base] === "3mm",
);

if (filaHeaderIndex === -1) {
  console.log("❌ No se encontró header");
  process.exit();
}

const datos = filas.slice(filaHeaderIndex + 1);

datos.forEach((fila) => {
  const medida = fila[cfg.columnas.medida];
  if (!medida) return;

  const excel3 = fila[cfg.columnas.base];
  const excel4 = fila[cfg.columnas.vidrio4];
  const excel5 = fila[cfg.columnas.vidrio5];
  const excel33 = fila[cfg.columnas.vidrio33];
  const excelGuia = fila[cfg.columnas.totalGuia];
  const excelMosq = fila[cfg.columnas.mosquitero];
  const excelDVH = fila[cfg.columnas.dvh];

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

    // 🔹 GUIA (TOTAL, NO RESTAR)
    const totalConGuia = calcularVentana({
      medida,
      color: "blanco",
      tipoVidrio: "3mm",
      incluirGuia: true,
      incluirMosquitero: false,
      linea: "modena",
    }).total;

    // 🔹 MOSQ (TOTAL, NO RESTAR)
    const totalMosq = calcularVentana({
      medida,
      color: "blanco",
      tipoVidrio: "3mm",
      incluirGuia: false,
      incluirMosquitero: true,
      linea: "modena",
    }).total;

    // 🔹 DVH
    const dvh = calcularVentana({
      medida,
      color: "blanco",
      tipoVidrio: "dvh",
      incluirGuia: false,
      incluirMosquitero: false,
      linea: "modena",
    }).total;

    let error = false;

    if (!iguales(v3, excel3)) {
      console.log(`❌ ${medida} 3mm`);
      error = true;
    }

    if (!iguales(v4, excel4)) {
      console.log(`❌ ${medida} 4mm`);
      error = true;
    }

    if (!iguales(v5, excel5)) {
      console.log(`❌ ${medida} 5mm`);
      error = true;
    }

    if (!iguales(v33, excel33)) {
      console.log(`❌ ${medida} 3+3`);
      error = true;
    }

    if (!iguales(totalConGuia, excelGuia)) {
      console.log(`❌ ${medida} GUIA`);
      error = true;
    }

    if (!iguales(totalMosq, excelMosq)) {
      console.log(`❌ ${medida} MOSQ`);
      error = true;
    }

    if (!iguales(dvh, excelDVH)) {
      console.log(`❌ ${medida} DVH`);
      error = true;
    }

    if (!error) {
      console.log(`✔ OK ${medida}`);
    }
  } catch (err) {
    console.log(`❌ ERROR ${medida}`, err.message);
  }
});

console.log("\n✅ Comparación terminada");
