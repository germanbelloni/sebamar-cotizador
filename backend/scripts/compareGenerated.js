const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../utils/path");

const ORIGINAL = fromRoot("backend/data");
const GENERATED = fromRoot("backend/generated");

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

let totalErrores = 0;

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

  const a = JSON.parse(fs.readFileSync(original, "utf8"));
  const b = JSON.parse(fs.readFileSync(generado, "utf8"));

  const errores = compare(a, b);

  if (errores.length === 0) {
    console.log(`✅ ${rel}`);
  } else {
    console.log(`\n❌ ${rel}`);

    errores.forEach((e) => console.log("   ", e));

    totalErrores += errores.length;
  }
}

console.log("");

if (totalErrores === 0) {
  console.log("🎉 TODOS LOS JSON SON IDÉNTICOS");
} else {
  console.log(`⚠️ Se encontraron ${totalErrores} diferencias`);
}
