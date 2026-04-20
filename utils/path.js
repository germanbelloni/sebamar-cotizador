const path = require("path");

// 🔥 ROOT REAL DEL PROYECTO (ajustá si hace falta)
const root = path.resolve(__dirname, "..");

module.exports = {
  root,
  fromRoot: (...paths) => path.join(root, ...paths),
};
