const fs = require("fs");
const XLSX = require("xlsx");

// 🔧 PATH HELPER
const { fromRoot } = require("../utils/path");

// 📄 EXCEL
const excelPath = fromRoot("excel/calculadora.xlsx");

// 📖 LEER ARCHIVO
const workbook = XLSX.readFile(excelPath);

// 🧠 HOJA
const sheet = workbook.Sheets["recargos"];
if (!sheet) {
  throw new Error("❌ No existe la hoja 'recargos'");
}

// 📊 FILAS
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// 📦 RESULTADO FINAL
const result = {
  recargos: {},
  superficies: {
    pano_fijo: {},
  },
  extras: {},
  vidrios: {},
};

// 🧠 ESTADO
let modo = null;

// 🔁 RECORRIDO
rows.forEach((row) => {
  const texto = (row[0] || "").toString().trim().toLowerCase();
  const valor = Number(row[2]);

  if (!texto) return;

  // =========================
  // 🔴 DETECTAR SECCIONES
  // =========================
  if (texto.includes("recargo")) modo = "recargos";
  if (texto === "premarco") modo = "superficies";
  if (texto.includes("paño fijo")) modo = "superficies";
  if (texto.includes("camara de dvh")) modo = "vidrios";

  // =========================
  // 🔴 RECARGOS (AHORA MULTIPLICADOR)
  // =========================
  if (modo === "recargos" && texto.includes("recargo")) {
    if (!valor && valor !== 0) return;

    const mult = valor > 1 ? 1 + valor / 100 : 1 + valor;

    if (texto.includes("negro")) {
      result.recargos.negro = mult;
    }

    if (texto.includes("bronce")) {
      result.recargos.bronce = mult;
    }

    if (texto.includes("natural")) {
      result.recargos.natural = mult;
    }

    if (texto.includes("3 hojas")) {
      result.recargos.tres_hojas = mult;
    }

    if (texto.includes("4 hojas")) {
      result.recargos.cuatro_hojas = mult;
    }
  }

  // =========================
  // 🟢 SUPERFICIES
  // =========================
  if (modo === "superficies") {
    if (!valor && valor !== 0) return;

    // PAÑO FIJO
    if (texto === "paño fijo") {
      result.superficies.pano_fijo.herrero = valor;
    }

    if (texto.includes("paño fijo modena")) {
      result.superficies.pano_fijo.modena = valor;
    }

    // TRAVESAÑO
    if (texto === "travesaño paño fijo") {
      result.superficies.travesano = result.superficies.travesano || {};
      result.superficies.travesano.herrero = valor;
    }

    if (texto.includes("travesaño paño fijo modena")) {
      result.superficies.travesano = result.superficies.travesano || {};
      result.superficies.travesano.modena = valor;
    }

    // PERFIL ACOPLE
    if (texto.includes("perfil de acople")) {
      result.superficies.perfil_acople = valor;
    }

    // PREMARCO
    if (texto === "premarco") {
      result.superficies.premarco = valor;
    }

    // CONTRAMARCO
    if (texto.includes("tapajunta")) {
      result.superficies.contramarco = valor;
    }

    // =========================
    // 🟡 EXTRAS
    // =========================
    if (texto.includes("bipunto")) {
      result.extras.bipunto = valor;
    }

    if (texto.includes("oscilobatiente")) {
      result.extras.oscilobatiente = valor;
    }
  }

  // =========================
  // 🔵 VIDRIOS
  // =========================
  if (modo === "vidrios") {
    if (!valor && valor !== 0) return;

    if (texto.includes("3mm")) {
      result.vidrios["3mm"] = valor;
    }

    if (texto.includes("4mm")) {
      result.vidrios["4mm"] = valor;
    }

    if (texto.includes("5mm")) {
      result.vidrios["5mm"] = valor;
    }

    if (texto.includes("6mm")) {
      result.vidrios["6mm"] = valor;
    }

    if (texto.includes("3+3")) {
      result.vidrios["3+3"] = valor;
    }

    if (texto.includes("4+4")) {
      result.vidrios["4+4"] = valor;
    }

    if (texto.includes("5+5")) {
      result.vidrios["5+5"] = valor;
    }

    if (texto.includes("dvh")) {
      result.vidrios["dvh"] = valor;
    }

    if (texto.includes("fantasia")) {
      result.vidrios["fantasia"] = valor;
    }

    if (texto.includes("esmerilado")) {
      result.vidrios["esmerilado"] = valor;
    }
  }
});

// 📁 OUTPUT
const outputPath = fromRoot("frontend/data/productos/superficies.json");

fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

console.log("\n✅ superficies.json generado correctamente\n");
