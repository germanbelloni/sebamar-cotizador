const path = require("path");

const root = process.cwd();

module.exports = {
  root,
  fromRoot: (...paths) => path.join(root, ...paths),
};
