const path = require("path");

const BACKEND_ROOT = path.resolve(__dirname, "..");
const ROOT = path.resolve(BACKEND_ROOT, "..");

const BACKEND_ALIASES = new Map([
  ["config", "backend/config"],
  ["excel", "backend/excel"],
  ["services", "backend/services"],
  ["tests", "backend/tests"],
  ["utils", "backend/utils"],
  ["wrappers", "wrappers"],
  ["frontend", "frontend"],
]);

function normalizeParts(parts) {
  return parts.flatMap((part) => String(part).split(/[\\/]/));
}

function fromRoot(...parts) {
  const cleanParts = normalizeParts(parts);

  if (cleanParts.length === 0) {
    throw new Error("fromRoot requires at least one path segment");
  }

  const [firstPart, ...rest] = cleanParts;

  const mappedFirstPart = BACKEND_ALIASES.get(firstPart) || firstPart;

  return path.join(ROOT, mappedFirstPart, ...rest);
}

function fromBackend(...parts) {
  const cleanParts = normalizeParts(parts);
  return path.join(BACKEND_ROOT, ...cleanParts);
}

module.exports = {
  BACKEND_ROOT,
  ROOT,
  fromBackend,
  fromRoot,
};
