const { execSync } = require("child_process");
const path = require("path");

const scriptsDir = __dirname;

function run(nombre, archivo) {
  console.log("");
  console.log("====================================");
  console.log(` ${nombre}`);
  console.log("====================================");
  console.log("");

  execSync(`node "${path.join(scriptsDir, archivo)}"`, {
    stdio: "inherit",
  });
}

try {
  run("IMPORTANDO EXCEL", "runExcel.js");

  run("VALIDANDO JSON", "compareGenerated.js");

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
