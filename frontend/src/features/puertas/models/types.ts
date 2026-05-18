export type GlassArea = {
  x: number;

  y: number;

  width: number;

  height: number;
};

export type Travesano = {
  y: number;

  height: number;
};

export type PuertaModeloConfig = {
  label: string;

  glassAreas?: GlassArea[];

  travesanos?: Travesano[];

  verticalDivisions?: number[];

  bottomPanel?: boolean;
};
