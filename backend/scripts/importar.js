"use strict";

const { execSync } = require("child_process");
const path = require("path");

const scriptsDir = __dirname;
const forcePublish = process.argv.includes("--publish");

function run(nombre, archivo, args = "") {
  console.log("");
  console.log("====================================");
  console.log(` ${nombre}`);
  console.log("====================================");
  console.log("");

  execSync(`node "${path.join(scriptsDir, archivo)}" ${args}`, {
    stdio: "inherit",
  });
}

try {
  // =========================
  // IMPORTAR DESDE EXCEL
  // =========================
  run("IMPORTANDO EXCEL", "runExcel.js");

  // =========================
  // VALIDACIÓN (NO BLOQUEANTE)
  // =========================
  if (!forcePublish) {
    try {
      run("VALIDANDO JSON", "compareGenerated.js");
    } catch {
      console.log("");
      console.log("====================================");
      console.log(" VALIDACIÓN CON DIFERENCIAS");
      console.log("====================================");
      console.log("");
      console.log("⚠️ Se detectaron diferencias respecto al JSON anterior.");
      console.log(
        "⚠️ Se continúa con la publicación porque catalogo.xlsx es la fuente de verdad.",
      );
      console.log("");
    }
  } else {
    console.log("");
    console.log("====================================");
    console.log(" VALIDACIÓN OMITIDA (--publish)");
    console.log("====================================");
    console.log("");
  }

  // =========================
  // PUBLICAR
  // =========================
  run("PUBLICANDO JSON", "publishGenerated.js");

  console.log("");
  console.log("====================================");
  console.log(" IMPORTACIÓN FINALIZADA");
  console.log("====================================");
  console.log("");
} catch (err) {
  console.log("");
  console.log("====================================");
  console.log(" ERROR EN LA IMPORTACIÓN");
  console.log("====================================");
  console.log("");

  console.error(err.message || err);

  process.exit(1);
}
