import type { VidrioType } from "@/shared/types/vidrios";
import type { VentanasAbrirBisagra } from "../types";

type Props = {
  left: number;
  top: number;
  ancho: number;
  alto: number;
  color: string;
  esHerrero: boolean;
  tipoVidrio?: VidrioType;
  bisagra?: VentanasAbrirBisagra;
};

export function VentanaAbrir({
  left,
  top,
  ancho,
  alto,
  color,
  esHerrero,
  bisagra,
}: Props) {
  void bisagra;

  const grosorMarco = esHerrero ? 12 : 8;

  const hojaPadding = esHerrero ? 16 : 14;

  const vidrioPadding = esHerrero ? 10 : 8;

  const colorHerraje = "#18181B";

  const anchoHoja = ancho / 2;

  function dibujarHoja(
    x: number,
    bisagraIzquierda: boolean,
    abreHaciaCentro: boolean,
  ) {
    const hojaLeft = x + hojaPadding - 7;

    const hojaTop = top + hojaPadding - 7;

    const hojaAncho = anchoHoja - hojaPadding * 2 + 16;

    const hojaAlto = alto - hojaPadding * 2 + 15;

    const manijaX = bisagraIzquierda ? hojaLeft + hojaAncho - 18 : hojaLeft + 8;

    return (
      <g key={x}>
        {/* hoja */}
        <rect
          x={hojaLeft}
          y={hojaTop}
          width={hojaAncho}
          height={hojaAlto}
          fill="rgba(255,255,255,0.03)"
          stroke={color}
          strokeWidth={grosorMarco}
        />

        {/* vidrio */}
        <rect
          x={hojaLeft + vidrioPadding}
          y={hojaTop + vidrioPadding}
          width={hojaAncho - vidrioPadding * 2}
          height={hojaAlto - vidrioPadding * 2}
          fill="url(#glassGradient)"
        />

        {/* bisagras */}
        <rect
          x={bisagraIzquierda ? x + 2 : x + anchoHoja - 9}
          y={top + 34}
          width={7}
          height={38}
          fill={colorHerraje}
        />

        <rect
          x={bisagraIzquierda ? x + 2 : x + anchoHoja - 9}
          y={top + alto - 72}
          width={7}
          height={38}
          fill={colorHerraje}
        />

        {/* manija */}
        <rect
          x={manijaX}
          y={top + alto / 2 - 20}
          width={8}
          height={40}
          rx={2}
          fill={colorHerraje}
        />

        {/* apertura */}
        <path
          d={
            abreHaciaCentro
              ? `
                M ${x + 14} ${top + 16}
                L ${x + anchoHoja - 18} ${top + alto / 2}
                L ${x + 14} ${top + alto - 16}
              `
              : `
                M ${x + anchoHoja - 14} ${top + 16}
                L ${x + 18} ${top + alto / 2}
                L ${x + anchoHoja - 14} ${top + alto - 16}
              `
          }
          fill="none"
          stroke="rgba(255,255,255,.18)"
          strokeDasharray="5 4"
        />
      </g>
    );
  }

  return (
    <>
      {dibujarHoja(left, true, true)}
      {dibujarHoja(left + anchoHoja, false, false)}
    </>
  );
}
