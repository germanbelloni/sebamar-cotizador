const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../utils/path");

const GENERATED = fromRoot("backend/generated");
const DATA = fromRoot("backend/data");

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;

  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    for (const file of fs.readdirSync(src)) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }

    return;
  }

  fs.copyFileSync(src, dest);
  console.log("📄", path.relative(GENERATED, src).replace(/\\/g, "/"));
}

copyRecursive(GENERATED, DATA);

console.log("");
console.log("✅ JSON publicados correctamente");
