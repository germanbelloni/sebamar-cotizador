type Primitive = string | number | boolean | null | undefined;

type Params = {
  modulo: string;

  descripcion?: string;

  metadata?: Record<string, unknown>;

  configuracion?: Record<string, unknown>;
};

function normalizeValue(value: Primitive) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "boolean") {
    return value ? "1" : "0";
  }

  return String(value).trim().toLowerCase();
}

function serializeObject(obj?: Record<string, unknown>) {
  if (!obj) {
    return "";
  }

  return Object.entries(obj)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => {
      return `${key}:${normalizeValue(value as Primitive)}`;
    })
    .join("|");
}

export function createGroupKey({
  modulo,
  descripcion,
  metadata,
  configuracion,
}: Params) {
  return [
    modulo.toLowerCase(),

    descripcion?.trim().toLowerCase() || "",

    serializeObject(metadata),

    serializeObject(configuracion),
  ].join("::");
}
