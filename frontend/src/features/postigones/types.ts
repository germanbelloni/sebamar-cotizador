export type CantidadHojasPostigon = 2 | 3 | 4;

export type HojaCierrePostigon =
  | "izquierda"
  | "derecha"
  | "centro-izquierda"
  | "centro-derecha";

export type TipoPostigon = "abrir" | "corredizo";

export type ColorPostigon =
  | "blanco"
  | "negro"
  | "bronce colonial"
  | "simil madera";

// =========================
// 🎨 CONFIG FRONTEND
// =========================

export type PostigonesConfig = {
  ancho: number;

  alto: number;

  tipo: TipoPostigon;

  color: ColorPostigon;

  cantidadHojas: CantidadHojasPostigon;

  hojaCierre: HojaCierrePostigon;

  microperforado: boolean;

  herrajeBlanco: boolean;

  // FUTURO
  marco?: "ancho" | "fino";
};

// =========================
// 🚀 PAYLOAD BACKEND
// =========================

export type PostigonesPayload = {
  ancho: number;

  alto: number;

  tipo: TipoPostigon;

  hojas: CantidadHojasPostigon;

  apertura: HojaCierrePostigon;

  color: ColorPostigon;

  extras: {
    microperforado: boolean;

    herrajeBlanco: boolean;
  };

  // FUTURO
  marco?: "ancho" | "fino";
};

// =========================
// 💰 RESPONSE BACKEND
// =========================

export type PostigonesResponse = {
  descripcion: string;

  precioFinal: number;

  configuracion?: unknown;

  precioVenta?: number;
};

// =========================
// 🧾 ITEM PRESUPUESTO
// =========================

export type PostigonesItem = {
  tipo: "postigones";

  cantidad: number;

  tipoPostigon: TipoPostigon;

  medidas: {
    ancho: number;

    alto: number;
  };

  description: string;

  color: ColorPostigon;

  extras: {
    cantidadHojas: CantidadHojasPostigon;

    hojaCierre: HojaCierrePostigon;

    microperforado: boolean;

    herrajeBlanco: boolean;
  };

  subtotal: number;
};
