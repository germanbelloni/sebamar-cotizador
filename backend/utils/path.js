const path = require("path");

const BACKEND_ROOT = path.resolve(__dirname, "..");
const ROOT = path.resolve(BACKEND_ROOT, "..");

const BACKEND_ALIASES = new Map([
  ["config", "backend/config"],
  ["excel", "backend/excel"],
  ["services", "backend/services"],
  ["tests", "backend/tests"],
  ["utils", "backend/utils"],
]);

function fromRoot(...parts) {
  const cleanParts = parts.flatMap((part) => String(part).split(/[\\/]/));
  const [firstPart, ...rest] = cleanParts;
  const mappedFirstPart = BACKEND_ALIASES.get(firstPart) || firstPart;

  return path.join(ROOT, mappedFirstPart, ...rest);
}

function fromBackend(...parts) {
  return path.join(BACKEND_ROOT, ...parts);
}

module.exports = { BACKEND_ROOT, ROOT, fromBackend, fromRoot };
