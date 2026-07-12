export type TipoCortina = "cortina" | "cajon_block";

export type MaterialCortina = "pvc" | "aluminio";

export type ConstruccionCortina = "completa" | "pano_solo";

export type CalidadPVC = "liviana" | "reforzada" | "super_reforzada";

export type ColorAluminio = "blanco" | "simil_madera";

export interface CortinaConfig {
  tipo: TipoCortina;

  material: MaterialCortina;

  construccion: ConstruccionCortina;

  calidad: CalidadPVC;

  color: ColorAluminio;

  ancho: number;
  alto: number;
}

export interface CortinaResponse {
  descripcion: string;

  precioVenta?: number;

  precioFinal?: number;

  subtotal?: number;

  costoBase?: number;

  costo?: number;

  precioProveedor?: number;

  precioLista?: number;

  margenAplicado?: number;

  perfilAplicado?: string;

  items?: {
    descripcion: string;
    cantidad: number;
    precio: number;
  }[];

  configuracion?: {
    tipo: TipoCortina;
    material: MaterialCortina;

    construccion?: ConstruccionCortina;
    calidad?: CalidadPVC;
    color?: string;

    ancho: number;
    alto: number;

    anchoFinal?: number | null;
    altoFinal?: number | null;

    svg?: string | null;
  };
}
