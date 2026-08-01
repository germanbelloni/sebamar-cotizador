const fs = require("fs");
const path = require("path");

const IGNORAR = new Set([
  "node_modules",
  ".git",
  ".github",
  ".vscode",
  ".idea",
  "dist",
  "build",
  ".next",
  ".vercel",
  "coverage",
  ".turbo",
  ".cache",
  ".vite",
  "logs",
  "output",
  "generated",
]);

const SALIDA = path.join(__dirname, "docs", "trees");

if (!fs.existsSync(SALIDA)) {
  fs.mkdirSync(SALIDA, { recursive: true });
}

/*
|--------------------------------------------------------------------------
| Profundidad máxima
|--------------------------------------------------------------------------
|
| 0 = sólo la carpeta raíz
| 1 = una carpeta hacia abajo
| 2 = dos niveles
| etc.
|
*/

const PROFUNDIDAD = {
  frontend: 6,
  backend: 6,
  listas: 6,
  wrappers: 8,
};

function generarTree(dir, prefijo = "", nivel = 0, maxNivel = 99) {
  if (!fs.existsSync(dir)) return "";

  if (nivel >= maxNivel) return "";

  const elementos = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => !IGNORAR.has(e.name))
    .sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

  let salida = "";

  elementos.forEach((e, index) => {
    const ultimo = index === elementos.length - 1;

    salida += `${prefijo}${ultimo ? "└── " : "├── "}${e.name}\n`;

    if (e.isDirectory()) {
      salida += generarTree(
        path.join(dir, e.name),
        prefijo + (ultimo ? "    " : "│   "),
        nivel + 1,
        maxNivel,
      );
    }
  });

  return salida;
}

function escribirTree(nombre, carpeta, profundidad) {
  const origen = path.join(__dirname, carpeta);

  const destino = path.join(SALIDA, `TREE_${nombre.toUpperCase()}.txt`);

  const contenido = `${nombre.toUpperCase()}

Profundidad máxima: ${profundidad}

${generarTree(origen, "", 0, profundidad)}`;

  fs.writeFileSync(destino, contenido, "utf8");

  console.log(`✔ TREE_${nombre.toUpperCase()}.txt generado`);
}

escribirTree("frontend", "frontend", PROFUNDIDAD.frontend);

escribirTree("backend", "backend", PROFUNDIDAD.backend);

escribirTree("listas", "listas", PROFUNDIDAD.listas);

escribirTree("wrappers", "wrappers", PROFUNDIDAD.wrappers);

console.log("\n✅ Trees generados correctamente.");
console.log(`📁 ${SALIDA}`);
