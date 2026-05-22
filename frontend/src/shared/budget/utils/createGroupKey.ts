type Params = {
  modulo: string;
  descripcion: string;
  metadata?: unknown;
  configuracion?: unknown;
};

export function createGroupKey({
  modulo,
  descripcion,
  metadata,
  configuracion,
}: Params) {
  return JSON.stringify({
    modulo,
    descripcion,
    metadata,
    configuracion,
  });
}
