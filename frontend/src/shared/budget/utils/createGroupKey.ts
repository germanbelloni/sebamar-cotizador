type Params = {
  modulo: string;

  descripcion?: string;

  metadata?: Record<string, unknown>;

  configuracion?: Record<string, unknown>;
};

function serializeValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "boolean") {
    return value ? "1" : "0";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value).trim().toLowerCase();
}

function serializeObject(obj?: Record<string, unknown>) {
  if (!obj) {
    return "";
  }

  return Object.entries(obj)
    .sort(([a], [b]) => a.localeCompare(b))
    .filter(([key]) => key !== "svg")
    .map(([key, value]) => {
      return `${key}:${serializeValue(value)}`;
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
