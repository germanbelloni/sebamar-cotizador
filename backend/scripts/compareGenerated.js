const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../utils/path");

const ORIGINAL = fromRoot("backend/data");
const GENERATED = fromRoot("backend/generated");

let totalErrores = 0;

let archivosOk = 0;
let archivosConErrores = 0;

let totalArchivos = 0;
let totalNodos = 0;

function walk(dir) {
  let files = [];

  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);

    if (fs.statSync(full).isDirectory()) {
      files = files.concat(walk(full));
    } else if (item.endsWith(".json")) {
      files.push(full);
    }
  }

  return files;
}

function relative(file, base) {
  return path.relative(base, file).replace(/\\/g, "/");
}

function compare(a, b, pathActual = "") {
  totalNodos++;
  const errores = [];

  if (typeof a !== typeof b) {
    errores.push(`${pathActual} -> tipo distinto (${typeof a} vs ${typeof b})`);
    return errores;
  }

  if (Array.isArray(a)) {
    if (a.length !== b.length) {
      errores.push(
        `${pathActual} -> largo distinto (${a.length} vs ${b.length})`,
      );
    }

    const len = Math.max(a.length, b.length);

    for (let i = 0; i < len; i++) {
      errores.push(...compare(a[i], b[i], `${pathActual}[${i}]`));
    }

    return errores;
  }

  if (a && typeof a === "object") {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);

    for (const key of keys) {
      if (!(key in a)) {
        errores.push(`${pathActual}.${key} -> falta en ORIGINAL`);
        continue;
      }

      if (!(key in b)) {
        errores.push(`${pathActual}.${key} -> falta en GENERATED`);
        continue;
      }

      errores.push(
        ...compare(a[key], b[key], pathActual ? `${pathActual}.${key}` : key),
      );
    }

    return errores;
  }

  if (a !== b) {
    errores.push(`${pathActual} -> ${a} != ${b}`);
  }

  return errores;
}

const originales = walk(ORIGINAL);

// superficies.json no se valida
totalArchivos = originales.filter(
  (f) => relative(f, ORIGINAL) !== "productos/superficies.json",
).length;

for (const original of originales) {
  const rel = relative(original, ORIGINAL);

  // superficies.json se mantiene manualmente
  if (rel === "productos/superficies.json") {
    continue;
  }

  const generado = path.join(GENERATED, rel);

  if (!fs.existsSync(generado)) {
    console.log(`❌ No existe ${rel}`);
    totalErrores++;
    continue;
  }

  let a;
  let b;

  try {
    a = JSON.parse(fs.readFileSync(original, "utf8"));
  } catch (err) {
    console.log(`\n❌ ${rel}`);
    console.log("   ORIGINAL contiene un JSON inválido.");

    archivosConErrores++;
    totalErrores++;

    continue;
  }

  try {
    b = JSON.parse(fs.readFileSync(generado, "utf8"));
  } catch (err) {
    console.log(`\n❌ ${rel}`);
    console.log("   GENERATED contiene un JSON inválido.");

    archivosConErrores++;
    totalErrores++;

    continue;
  }

  const errores = compare(a, b);

  if (errores.length === 0) {
    archivosOk++;
    console.log(`✅ ${rel}`);
  } else {
    archivosConErrores++;

    console.log(`\n❌ ${rel}`);

    const faltantes = [];
    const tipos = [];
    const distintos = [];

    for (const error of errores) {
      if (error.includes("falta en")) {
        faltantes.push(error);
      } else if (error.includes("tipo distinto")) {
        tipos.push(error);
      } else {
        distintos.push(error);
      }
    }

    if (faltantes.length) {
      console.log(`   📁 Estructura: ${faltantes.length} diferencia(s)`);

      faltantes.slice(0, 10).forEach((e) => console.log("      •", e));

      if (faltantes.length > 10) {
        console.log(`      ... ${faltantes.length - 10} más`);
      }
    }

    if (tipos.length) {
      console.log(`   🔤 Tipos: ${tipos.length} diferencia(s)`);

      tipos.slice(0, 10).forEach((e) => console.log("      •", e));

      if (tipos.length > 10) {
        console.log(`      ... ${tipos.length - 10} más`);
      }
    }

    if (distintos.length) {
      console.log(`   🔢 Valores: ${distintos.length} diferencia(s)`);

      distintos.slice(0, 10).forEach((e) => console.log("      •", e));

      if (distintos.length > 10) {
        console.log(`      ... ${distintos.length - 10} más`);
      }
    }

    totalErrores += errores.length;
  }
}

console.log("");
console.log("====================================");
console.log(" VALIDACIÓN DE JSON");
console.log("====================================");
console.log("");

console.log(`Archivos:           ${totalArchivos}`);
console.log(`Archivos OK:        ${archivosOk}`);
console.log(`Archivos con error: ${archivosConErrores}`);
console.log(`Nodos comparados:   ${totalNodos}`);
console.log(`Errores:            ${totalErrores}`);

console.log("");

if (totalErrores === 0) {
  console.log("🎉 TODOS LOS JSON SON IDÉNTICOS");
  process.exit(0);
} else {
  console.log(`⚠️ Se encontraron ${totalErrores} diferencias`);
  process.exit(1);
}
