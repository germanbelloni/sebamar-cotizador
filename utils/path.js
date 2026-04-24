const path = require("path");

// 🔥 raíz real del proyecto (independiente de dónde ejecutes node)
const ROOT = path.resolve(__dirname, "..");

function fromRoot(p) {
  return path.join(ROOT, p);
}

module.exports = { fromRoot };
