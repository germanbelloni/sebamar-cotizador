export type MedidaRapida = {
  label: string;

  ancho: number;

  alto: number;

  especial?: boolean;
};

export const MEDIDAS_RAPIDAS = {
  simple: [
    {
      label: "70x200",
      ancho: 70,
      alto: 200,
    },

    {
      label: "80x200",
      ancho: 80,
      alto: 200,
    },

    {
      label: "90x200",
      ancho: 90,
      alto: 200,
    },

    {
      label: "Especial",
      ancho: 80,
      alto: 200,
      especial: true,
    },
  ],

  doble: [
    {
      label: "140x200",
      ancho: 140,
      alto: 200,
    },

    {
      label: "160x200",
      ancho: 160,
      alto: 200,
    },

    {
      label: "180x200",
      ancho: 180,
      alto: 200,
    },

    {
      label: "Especial",
      ancho: 160,
      alto: 200,
      especial: true,
    },
  ],

  puerta_y_media: [
    {
      label: "110x200",
      ancho: 110,
      alto: 200,
    },

    {
      label: "120x200",
      ancho: 120,
      alto: 200,
    },

    {
      label: "130x200",
      ancho: 130,
      alto: 200,
    },

    {
      label: "Especial",
      ancho: 120,
      alto: 200,
      especial: true,
    },
  ],

  porton: [
    {
      label: "210x200",
      ancho: 210,
      alto: 200,
    },

    {
      label: "240x200",
      ancho: 240,
      alto: 200,
    },

    {
      label: "270x200",
      ancho: 270,
      alto: 200,
    },

    {
      label: "Especial",
      ancho: 240,
      alto: 200,
      especial: true,
    },
  ],
} as const;
