console.clear();

console.log("");
console.log("===============================================");
console.log("      SEBAMAR - AUDITOR GENERAL");
console.log("===============================================");
console.log("");

const modulos = [
  "./tests/testVentanas",
  "./tests/testVentanasAbrir",
  "./tests/testPuertas",
  "./tests/testRajas",
  "./tests/testPostigones",
  "./tests/testPatagonicas",
  "./tests/testPortones",
  "./tests/testMosquiteros",
  "./tests/testPuertasPlaca",
  "./tests/testSuperficies",
];

let errores = [];

for (const modulo of modulos) {
  try {
    require(modulo);
  } catch (err) {
    errores.push({
      modulo,
      error: err.message,
    });

    console.log(`❌ ${modulo}`);
    console.log(err.message);
    console.log("");
  }
}

console.log("");
console.log("===============================================");

if (errores.length === 0) {
  console.log("✅ Auditor ejecutado correctamente");
} else {
  console.log(`❌ ${errores.length} módulo(s) fallaron`);
}

console.log("===============================================");
console.log("");
