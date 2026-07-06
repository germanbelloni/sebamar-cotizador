const XLSX = require("xlsx");
const fs = require("fs");

const { fromRoot } = require("../utils/path");

// 📂 Excel
const workbook = XLSX.readFile(fromRoot("backend/excel/catalogo.xlsx"));

// 📄 Hoja
const sheet = workbook.Sheets["PUERTAS_PLACA"];

if (!sheet) {
  throw new Error("Hoja PUERTAS_PLACA no encontrada");
}

// 📊 Leer datos
const rows = XLSX.utils.sheet_to_json(sheet, {
  defval: null,
});

// Resultado
const resultado = {
  placa: {},
  embutir: {},
};

rows.forEach((row) => {
  if (!row.TIPO || !row.MODELO || !row.MEDIDA) return;

  const tipo = row.TIPO.toString().trim().toLowerCase();
  const modelo = row.MODELO.toString().trim().toLowerCase();
  const medida = row.MEDIDA.toString().trim();

  if (!resultado[tipo]) return;

  if (!resultado[tipo][modelo]) {
    resultado[tipo][modelo] = {};
  }

  resultado[tipo][modelo][medida] = {};

  if (row.ALUMINIO !== null && row.ALUMINIO !== "") {
    resultado[tipo][modelo][medida].aluminio = Math.round(
      Number(row.ALUMINIO) || 0,
    );
  } else {
    resultado[tipo][modelo][medida].marco_10 = Math.round(
      Number(row.MARCO_10) || 0,
    );

    resultado[tipo][modelo][medida].marco_15 = Math.round(
      Number(row.MARCO_15) || 0,
    );
  }
});

// 💾 Guardar
fs.writeFileSync(
  fromRoot("backend/generated/productos/puertas_placa.json"),
  JSON.stringify(resultado, null, 2),
);

console.log("✅ puertas_placa.json generado correctamente");
console.log("📊 Modelos placa:", Object.keys(resultado.placa).length);
console.log("📊 Modelos embutir:", Object.keys(resultado.embutir).length);
