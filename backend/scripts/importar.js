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
  run("IMPORTANDO EXCEL", "runExcel.js");

  if (!forcePublish) {
    run("VALIDANDO JSON", "compareGenerated.js");
  } else {
    console.log("");
    console.log("====================================");
    console.log(" VALIDACIÓN OMITIDA (--publish)");
    console.log("====================================");
    console.log("");
  }

  run("PUBLICANDO JSON", "publishGenerated.js");

  console.log("");
  console.log("====================================");
  console.log(" IMPORTACIÓN FINALIZADA");
  console.log("====================================");
  console.log("");
} catch (err) {
  console.log("");
  console.log("====================================");
  console.log(" IMPORTACIÓN CANCELADA");
  console.log("====================================");
  console.log("");
  process.exit(1);
}
