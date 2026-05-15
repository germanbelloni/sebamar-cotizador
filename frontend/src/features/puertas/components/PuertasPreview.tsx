import type { PuertasConfig } from "../types";

import { SVG_COLORS } from "@/shared/svg/constants/colors";

type Props = {
  config: PuertasConfig;
};

type DoorModel =
  | "modelo_1"
  | "modelo_1_vr"
  | "modelo_2"
  | "modelo_3"
  | "modelo_3_vr"
  | "modelo_4"
  | "modelo_4_vr"
  | "modelo_5"
  | "modelo_6"
  | "modelo_7"
  | "modelo_8"
  | "modelo_9"
  | "modelo_10"
  | "modelo_10_vr"
  | "modelo_11"
  | "modelo_12"
  | "modelo_panel"
  | "modelo_c_panel";

type DoorMode =
  | "simple"
  | "doble"
  | "puerta_y_media"
  | "abrir"
  | "corredizo"
  | "plegadizo";

type Leaf = {
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX?: number;
  rotate?: number;
  originX?: number;
  originY?: number;
  isSecondary?: boolean;
};

type RectSpec = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type GlassKind =
  | "3mm"
  | "4mm"
  | "5mm"
  | "fantasia"
  | "esmerilado"
  | "3+3"
  | "dvh_4_9_4";

const VIEW_SIZE = 500;

const normalizeModel = (model: string): DoorModel => {
  const normalized = model
    .trim()
    .toLowerCase()
    .replace(/\//g, "_")
    .replace(/ /g, "_")
    .replace(/-/g, "_");

  const validModels: DoorModel[] = [
    "modelo_1",
    "modelo_1_vr",
    "modelo_2",
    "modelo_3",
    "modelo_3_vr",
    "modelo_4",
    "modelo_4_vr",
    "modelo_5",
    "modelo_6",
    "modelo_7",
    "modelo_8",
    "modelo_9",
    "modelo_10",
    "modelo_10_vr",
    "modelo_11",
    "modelo_12",
    "modelo_panel",
    "modelo_c_panel",
  ];

  return validModels.includes(normalized as DoorModel)
    ? (normalized as DoorModel)
    : "modelo_12";
};

const normalizeDoorMode = (
  tipo: PuertasConfig["tipoConfiguracion"],
  tipoPorton?: PuertasConfig["tipoPorton"],
): DoorMode => {
  if (tipo === "doble") {
    return "doble";
  }

  if (tipo === "puerta_y_media") {
    return "puerta_y_media";
  }

  if (tipo === "porton") {
    return tipoPorton || "abrir";
  }

  return "simple";
};

const normalizeGlass = (vidrio?: PuertasConfig["vidrio"]): GlassKind => {
  const normalized = String(vidrio || "4mm")
    .trim()
    .toLowerCase()
    .replace(/ /g, "_")
    .replaceAll("+", "_");

  if (normalized === "dvh" || normalized === "dvh_4_9_4") {
    return "dvh_4_9_4";
  }

  if (normalized === "3mm") return "3mm";
  if (normalized === "5mm") return "5mm";
  if (normalized === "fantasia") return "fantasia";
  if (normalized === "esmerilado") return "esmerilado";
  if (normalized === "3_3") return "3+3";

  return "4mm";
};

const getFrameWidth = (linea: PuertasConfig["linea"], width: number) => {
  if (linea === "herrero") return Math.max(8, width * 0.045);
  if (linea === "eco") return Math.max(6, width * 0.035);

  return Math.max(5, width * 0.03);
};

const glassFill = (vidrio: GlassKind) => {
  if (vidrio === "fantasia") return "url(#glassFantasia)";
  if (vidrio === "esmerilado") return "url(#glassEsmerilado)";
  if (vidrio === "3+3") return "url(#glassLaminado)";
  if (vidrio === "dvh_4_9_4") return "url(#glassDvh)";

  return "url(#glassClassic)";
};

const glassStroke = (vidrio: GlassKind) => {
  if (vidrio === "3mm") return "rgba(255,255,255,0.12)";
  if (vidrio === "4mm") return "rgba(255,255,255,0.18)";
  if (vidrio === "5mm") return "rgba(255,255,255,0.24)";
  if (vidrio === "3+3") return "rgba(125,211,252,0.42)";
  if (vidrio === "dvh_4_9_4") return "rgba(212,212,216,0.46)";

  return "rgba(255,255,255,0.20)";
};

function GlassPanel({ rect, vidrio }: { rect: RectSpec; vidrio: GlassKind }) {
  const isDvh = vidrio === "dvh_4_9_4";

  return (
    <g>
      <rect
        x={rect.x + 2}
        y={rect.y + 4}
        width={rect.width}
        height={rect.height}
        rx={2}
        fill="rgba(0,0,0,0.30)"
      />

      <rect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        rx={2}
        fill={glassFill(vidrio)}
        stroke={glassStroke(vidrio)}
        strokeWidth={isDvh ? 2 : 1.2}
      />

      {isDvh && (
        <>
          <rect
            x={rect.x + 5}
            y={rect.y + 5}
            width={Math.max(0, rect.width - 10)}
            height={Math.max(0, rect.height - 10)}
            rx={1}
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={1.3}
          />

          <rect
            x={rect.x + 10}
            y={rect.y + 10}
            width={Math.max(0, rect.width - 20)}
            height={Math.max(0, rect.height - 20)}
            rx={1}
            fill="rgba(0,0,0,0.12)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        </>
      )}

      <rect
        x={rect.x + 7}
        y={rect.y + 7}
        width={Math.max(0, rect.width - 14)}
        height={2}
        fill="rgba(255,255,255,0.18)"
      />

      <path
        d={`
          M ${rect.x + rect.width * 0.24} ${rect.y + 10}
          L ${rect.x + rect.width * 0.12} ${rect.y + rect.height - 12}
        `}
        stroke="rgba(255,255,255,0.14)"
        strokeWidth={Math.max(3, rect.width * 0.035)}
        strokeLinecap="round"
      />
    </g>
  );
}

function BlindPanel({ rect, color }: { rect: RectSpec; color: string }) {
  return (
    <g>
      <rect
        x={rect.x + 2}
        y={rect.y + 3}
        width={rect.width}
        height={rect.height}
        rx={2}
        fill="rgba(0,0,0,0.20)"
      />

      <rect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        rx={2}
        fill="rgba(255,255,255,0.025)"
        stroke="rgba(255,255,255,0.08)"
      />

      <rect
        x={rect.x + 4}
        y={rect.y + 4}
        width={Math.max(0, rect.width - 8)}
        height={Math.max(0, rect.height - 8)}
        rx={1}
        fill="none"
        stroke={color}
        strokeWidth={2}
        opacity={0.55}
      />

      <rect
        x={rect.x + 8}
        y={rect.y + 8}
        width={Math.max(0, rect.width - 16)}
        height={Math.max(0, rect.height * 0.16)}
        fill="rgba(255,255,255,0.04)"
      />
    </g>
  );
}

function Rails({ rects, color }: { rects: RectSpec[]; color: string }) {
  return (
    <>
      {rects.map((rect, index) => (
        <g key={`${rect.x}-${rect.y}-${index}`}>
          <rect
            x={rect.x + 1}
            y={rect.y + 2}
            width={rect.width}
            height={rect.height}
            fill="rgba(0,0,0,0.25)"
          />

          <rect
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            fill={color}
            stroke="url(#aluminumGradient)"
            strokeWidth={1}
          />

          <rect
            x={rect.x + 1}
            y={rect.y + 1}
            width={Math.max(0, rect.width - 2)}
            height={1}
            fill="rgba(255,255,255,0.14)"
          />
        </g>
      ))}
    </>
  );
}

const panel = (
  x: number,
  y: number,
  width: number,
  height: number,
): RectSpec => ({
  x,
  y,
  width,
  height,
});

function getModelGlassRects(
  model: DoorModel,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const m = 14;
  const top = y + m;
  const left = x + m;
  const innerW = w - m * 2;
  const innerH = h - m * 2;
  const gap = 8;

  if (model === "modelo_panel" || model === "modelo_c_panel") return [];

  if (model === "modelo_1") {
    return [
      panel(
        left + innerW * 0.08,
        top + innerH * 0.04,
        innerW * 0.84,
        innerH * 0.92,
      ),
    ];
  }

  if (model === "modelo_1_vr") {
    const cols = 3;
    const rows = 6;
    const cellW = (innerW - gap * (cols - 1)) / cols;
    const cellH = (innerH - gap * (rows - 1)) / rows;

    return Array.from({ length: rows * cols }, (_, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);

      return panel(
        left + col * (cellW + gap),
        top + row * (cellH + gap),
        cellW,
        cellH,
      );
    });
  }

  if (model === "modelo_2") return [];

  if (model === "modelo_3") {
    return [
      panel(
        left + innerW * 0.06,
        top + innerH * 0.03,
        innerW * 0.88,
        innerH * 0.45,
      ),
    ];
  }

  if (model === "modelo_3_vr") {
    const rows = 3;
    const paneH = innerH * 0.145;

    return Array.from({ length: rows }, (_, row) =>
      panel(
        left + innerW * 0.06,
        top + row * (paneH + gap),
        innerW * 0.88,
        paneH,
      ),
    );
  }

  if (model === "modelo_4") {
    return [
      panel(
        left + innerW * 0.05,
        top + innerH * 0.03,
        innerW * 0.9,
        innerH * 0.18,
      ),
    ];
  }

  if (model === "modelo_4_vr") {
    const cols = 3;
    const paneW = (innerW - gap * (cols - 1)) / cols;

    return Array.from({ length: cols }, (_, col) =>
      panel(
        left + col * (paneW + gap),
        top + innerH * 0.03,
        paneW,
        innerH * 0.17,
      ),
    );
  }

  if (model === "modelo_5") return [];

  if (model === "modelo_6") {
    const cols = 3;
    const paneW = (innerW - gap * (cols - 1)) / cols;

    return Array.from({ length: cols }, (_, col) =>
      panel(
        left + col * (paneW + gap),
        top + innerH * 0.04,
        paneW,
        innerH * 0.46,
      ),
    );
  }

  if (model === "modelo_7") {
    const cols = 3;
    const paneW = (innerW - gap * (cols - 1)) / cols;

    return Array.from({ length: cols }, (_, col) =>
      panel(
        left + col * (paneW + gap),
        top + innerH * 0.04,
        paneW,
        innerH * 0.15,
      ),
    );
  }

  if (model === "modelo_8") {
    const rows = 4;
    const paneH = (innerH - gap * (rows - 1)) / rows;

    return Array.from({ length: rows }, (_, row) =>
      panel(
        left + innerW * 0.04,
        top + row * (paneH + gap),
        innerW * 0.92,
        paneH,
      ),
    );
  }

  if (model === "modelo_9") {
    return [
      panel(
        left + innerW * 0.72,
        top + innerH * 0.03,
        innerW * 0.2,
        innerH * 0.94,
      ),
    ];
  }

  if (model === "modelo_10") {
    return [
      panel(
        left + innerW * 0.7,
        top + innerH * 0.04,
        innerW * 0.24,
        innerH * 0.4,
      ),
    ];
  }

  if (model === "modelo_10_vr") {
    const rows = 3;
    const paneH = (innerH * 0.46 - gap * (rows - 1)) / rows;

    return Array.from({ length: rows }, (_, row) =>
      panel(
        left + innerW * 0.7,
        top + innerH * 0.04 + row * (paneH + gap),
        innerW * 0.24,
        paneH,
      ),
    );
  }

  if (model === "modelo_11") {
    const cols = 3;
    const paneW = (innerW * 0.72 - gap * (cols - 1)) / cols;

    return Array.from({ length: cols }, (_, col) =>
      panel(
        left + innerW * 0.14 + col * (paneW + gap),
        top + innerH * 0.04,
        paneW,
        innerH * 0.58,
      ),
    );
  }

  return [
    panel(
      left + innerW * 0.08,
      top + innerH * 0.04,
      innerW * 0.84,
      innerH * 0.66,
    ),
  ];
}

function getModelBlindRects(
  model: DoorModel,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const m = 14;
  const top = y + m;
  const left = x + m;
  const innerW = w - m * 2;
  const innerH = h - m * 2;
  const gap = 8;

  if (model === "modelo_panel" || model === "modelo_c_panel") {
    const rows = 5;
    const panelH = (innerH - gap * (rows - 1)) / rows;

    return Array.from({ length: rows }, (_, row) =>
      panel(
        left + innerW * 0.04,
        top + row * (panelH + gap),
        innerW * 0.92,
        panelH,
      ),
    );
  }

  if (model === "modelo_2") {
    return [
      panel(
        left + innerW * 0.04,
        top + innerH * 0.04,
        innerW * 0.92,
        innerH * 0.43,
      ),
      panel(
        left + innerW * 0.04,
        top + innerH * 0.55,
        innerW * 0.92,
        innerH * 0.41,
      ),
    ];
  }

  if (model === "modelo_3" || model === "modelo_3_vr") {
    return [
      panel(
        left + innerW * 0.05,
        top + innerH * 0.56,
        innerW * 0.9,
        innerH * 0.4,
      ),
    ];
  }

  if (model === "modelo_4" || model === "modelo_4_vr") {
    return [
      panel(
        left + innerW * 0.05,
        top + innerH * 0.29,
        innerW * 0.9,
        innerH * 0.67,
      ),
    ];
  }

  if (model === "modelo_5") {
    return [
      panel(
        left + innerW * 0.04,
        top + innerH * 0.04,
        innerW * 0.92,
        innerH * 0.92,
      ),
    ];
  }

  if (model === "modelo_6") {
    return [
      panel(
        left + innerW * 0.05,
        top + innerH * 0.58,
        innerW * 0.9,
        innerH * 0.38,
      ),
    ];
  }

  if (model === "modelo_7") {
    return [
      panel(
        left + innerW * 0.05,
        top + innerH * 0.28,
        innerW * 0.9,
        innerH * 0.68,
      ),
    ];
  }

  if (model === "modelo_9") {
    return [
      panel(
        left + innerW * 0.05,
        top + innerH * 0.04,
        innerW * 0.6,
        innerH * 0.92,
      ),
    ];
  }

  if (model === "modelo_10") {
    return [
      panel(
        left + innerW * 0.05,
        top + innerH * 0.04,
        innerW * 0.58,
        innerH * 0.42,
      ),
      panel(
        left + innerW * 0.05,
        top + innerH * 0.58,
        innerW * 0.9,
        innerH * 0.38,
      ),
    ];
  }

  if (model === "modelo_10_vr") {
    return [
      panel(
        left + innerW * 0.05,
        top + innerH * 0.04,
        innerW * 0.58,
        innerH * 0.46,
      ),
    ];
  }

  if (model === "modelo_11") {
    return [
      panel(
        left + innerW * 0.05,
        top + innerH * 0.72,
        innerW * 0.9,
        innerH * 0.24,
      ),
    ];
  }

  if (model === "modelo_12") {
    return [
      panel(
        left + innerW * 0.08,
        top + innerH * 0.76,
        innerW * 0.84,
        innerH * 0.2,
      ),
    ];
  }

  return [];
}

function getModelRails(
  model: DoorModel,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const m = 14;
  const top = y + m;
  const left = x + m;
  const innerW = w - m * 2;
  const innerH = h - m * 2;
  const rail = 6;
  const gap = 8;

  if (model === "modelo_1_vr") {
    const cols = 3;
    const rows = 6;
    const cellW = (innerW - gap * (cols - 1)) / cols;
    const cellH = (innerH - gap * (rows - 1)) / rows;

    return [
      ...[1, 2].map((col) =>
        panel(
          left + col * cellW + (col - 0.5) * gap - rail / 2,
          top,
          rail,
          innerH,
        ),
      ),
      ...[1, 2, 3, 4, 5].map((row) =>
        panel(
          left,
          top + row * cellH + (row - 0.5) * gap - rail / 2,
          innerW,
          rail,
        ),
      ),
    ];
  }

  if (model === "modelo_panel" || model === "modelo_c_panel") {
    const rows = 5;
    const panelH = (innerH - gap * (rows - 1)) / rows;

    return [1, 2, 3, 4].map((row) =>
      panel(
        left + innerW * 0.04,
        top + row * panelH + (row - 0.5) * gap - rail / 2,
        innerW * 0.92,
        rail,
      ),
    );
  }

  if (model === "modelo_2") {
    return [
      panel(
        left + innerW * 0.04,
        top + innerH * 0.51 - rail / 2,
        innerW * 0.92,
        rail,
      ),
    ];
  }

  if (model === "modelo_3" || model === "modelo_3_vr") {
    return [
      panel(
        left + innerW * 0.05,
        top + innerH * 0.52 - rail / 2,
        innerW * 0.9,
        rail,
      ),
      panel(
        left + innerW * 0.05,
        top + innerH * 0.7 - rail / 2,
        innerW * 0.9,
        rail,
      ),
      panel(
        left + innerW * 0.05,
        top + innerH * 0.82 - rail / 2,
        innerW * 0.9,
        rail,
      ),
    ];
  }

  if (model === "modelo_4") {
    return [
      panel(
        left + innerW * 0.05,
        top + innerH * 0.25 - rail / 2,
        innerW * 0.9,
        rail,
      ),
      panel(
        left + innerW * 0.05,
        top + innerH * 0.48 - rail / 2,
        innerW * 0.9,
        rail,
      ),
      panel(
        left + innerW * 0.05,
        top + innerH * 0.62 - rail / 2,
        innerW * 0.9,
        rail,
      ),
      panel(
        left + innerW * 0.05,
        top + innerH * 0.76 - rail / 2,
        innerW * 0.9,
        rail,
      ),
    ];
  }

  if (model === "modelo_4_vr") {
    return [];
  }

  if (model === "modelo_6") {
    const cols = 3;
    const paneW = (innerW - gap * (cols - 1)) / cols;

    return [
      panel(
        left + paneW + gap / 2 - rail / 2,
        top + innerH * 0.04,
        rail,
        innerH * 0.46,
      ),
      panel(
        left + paneW * 2 + gap * 1.5 - rail / 2,
        top + innerH * 0.04,
        rail,
        innerH * 0.46,
      ),
      panel(
        left + innerW * 0.05,
        top + innerH * 0.54 - rail / 2,
        innerW * 0.9,
        rail,
      ),
    ];
  }

  if (model === "modelo_7") {
    return [
      panel(
        left + innerW * 0.05,
        top + innerH * 0.24 - rail / 2,
        innerW * 0.9,
        rail,
      ),
    ];
  }

  if (model === "modelo_8") {
    return [1, 2, 3].map((row) =>
      panel(
        left + innerW * 0.04,
        top + row * (innerH / 4) - rail / 2,
        innerW * 0.92,
        rail,
      ),
    );
  }

  if (model === "modelo_9") {
    return [
      panel(
        left + innerW * 0.68 - rail / 2,
        top + innerH * 0.04,
        rail,
        innerH * 0.92,
      ),
    ];
  }

  if (model === "modelo_10") {
    return [
      panel(
        left + innerW * 0.66 - rail / 2,
        top + innerH * 0.04,
        rail,
        innerH * 0.92,
      ),
      panel(
        left + innerW * 0.05,
        top + innerH * 0.54 - rail / 2,
        innerW * 0.9,
        rail,
      ),
      panel(
        left + innerW * 0.05,
        top + innerH * 0.72 - rail / 2,
        innerW * 0.9,
        rail,
      ),
      panel(
        left + innerW * 0.05,
        top + innerH * 0.84 - rail / 2,
        innerW * 0.9,
        rail,
      ),
    ];
  }

  if (model === "modelo_10_vr") {
    return [
      panel(
        left + innerW * 0.66 - rail / 2,
        top + innerH * 0.04,
        rail,
        innerH * 0.46,
      ),
      panel(
        left + innerW * 0.7,
        top + innerH * 0.19 - rail / 2,
        innerW * 0.24,
        rail,
      ),
      panel(
        left + innerW * 0.7,
        top + innerH * 0.34 - rail / 2,
        innerW * 0.24,
        rail,
      ),
    ];
  }

  if (model === "modelo_11") {
    const startX = left + innerW * 0.14;
    const totalW = innerW * 0.72;
    const paneW = (totalW - gap * 2) / 3;

    return [
      panel(
        startX + paneW + gap / 2 - rail / 2,
        top + innerH * 0.04,
        rail,
        innerH * 0.58,
      ),
      panel(
        startX + paneW * 2 + gap * 1.5 - rail / 2,
        top + innerH * 0.04,
        rail,
        innerH * 0.58,
      ),
      panel(
        left + innerW * 0.05,
        top + innerH * 0.68 - rail / 2,
        innerW * 0.9,
        rail,
      ),
    ];
  }

  if (model === "modelo_12") {
    return [
      panel(
        left + innerW * 0.08,
        top + innerH * 0.72 - rail / 2,
        innerW * 0.84,
        rail,
      ),
      panel(
        left + innerW * 0.08,
        top + innerH * 0.84 - rail / 2,
        innerW * 0.84,
        rail,
      ),
    ];
  }

  return [];
}

function DoorLeaf({
  leaf,
  model,
  color,
  vidrio,
  linea,
}: {
  leaf: Leaf;
  model: DoorModel;
  color: string;
  vidrio: GlassKind;
  linea: PuertasConfig["linea"];
}) {
  const frameWidth = getFrameWidth(linea, leaf.width);

  const transform = [
    leaf.rotate
      ? `rotate(${leaf.rotate} ${leaf.originX || leaf.x} ${leaf.originY || leaf.y})`
      : "",
    leaf.scaleX
      ? `translate(${leaf.x + leaf.width} 0) scale(${leaf.scaleX} 1)`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const glassRects = getModelGlassRects(
    model,
    leaf.x,
    leaf.y,
    leaf.width,
    leaf.height,
  );

  const blindRects = getModelBlindRects(
    model,
    leaf.x,
    leaf.y,
    leaf.width,
    leaf.height,
  );

  const railRects = getModelRails(
    model,
    leaf.x,
    leaf.y,
    leaf.width,
    leaf.height,
  );

  return (
    <g transform={transform || undefined}>
      <rect
        x={leaf.x + 3}
        y={leaf.y + 5}
        width={leaf.width}
        height={leaf.height}
        rx={2}
        fill="none"
        stroke="rgba(0,0,0,0.32)"
        strokeWidth={frameWidth + 2}
      />

      <rect
        x={leaf.x}
        y={leaf.y}
        width={leaf.width}
        height={leaf.height}
        rx={2}
        fill="rgba(255,255,255,0.018)"
        stroke={color}
        strokeWidth={frameWidth}
      />

      <rect
        x={leaf.x}
        y={leaf.y}
        width={leaf.width}
        height={leaf.height}
        rx={2}
        fill="none"
        stroke="url(#aluminumGradient)"
        strokeWidth={Math.max(1, frameWidth - 1)}
        opacity={0.92}
      />

      <rect
        x={leaf.x + frameWidth / 2}
        y={leaf.y + frameWidth / 2}
        width={Math.max(0, leaf.width - frameWidth)}
        height={Math.max(0, leaf.height - frameWidth)}
        fill="none"
        stroke="rgba(0,0,0,0.26)"
        strokeWidth={2}
      />

      {blindRects.map((rect, index) => (
        <BlindPanel key={`blind-${index}`} rect={rect} color={color} />
      ))}

      {glassRects.map((rect, index) => (
        <GlassPanel key={`glass-${index}`} rect={rect} vidrio={vidrio} />
      ))}

      <Rails rects={railRects || []} color={color} />

      <rect
        x={leaf.x + 6}
        y={leaf.y + 6}
        width={Math.max(0, leaf.width - 12)}
        height={2}
        fill="rgba(255,255,255,0.12)"
      />
    </g>
  );
}

function StraightBar({
  x,
  y,
  height,
}: {
  x: number;
  y: number;
  height: number;
}) {
  return (
    <g>
      <line
        x1={x + 2}
        y1={y + 2}
        x2={x + 2}
        y2={y + height + 2}
        stroke="rgba(0,0,0,0.46)"
        strokeWidth={9}
        strokeLinecap="round"
      />

      <line
        x1={x}
        y1={y}
        x2={x}
        y2={y + height}
        stroke="url(#handleSteel)"
        strokeWidth={7}
        strokeLinecap="round"
      />

      <line
        x1={x - 2}
        y1={y + 7}
        x2={x - 2}
        y2={y + height - 7}
        stroke="rgba(255,255,255,0.28)"
        strokeWidth={1.2}
        strokeLinecap="round"
      />

      <circle cx={x} cy={y + 16} r={5.5} fill="#27272A" />
      <circle cx={x} cy={y + height - 16} r={5.5} fill="#27272A" />
      <circle cx={x - 1} cy={y + 15} r={1.5} fill="rgba(255,255,255,0.35)" />
      <circle
        cx={x - 1}
        cy={y + height - 17}
        r={1.5}
        fill="rgba(255,255,255,0.35)"
      />
    </g>
  );
}

function CurvedBar({
  x,
  y,
  height,
  side,
}: {
  x: number;
  y: number;
  height: number;
  side: PuertasConfig["mano"];
}) {
  const curve = side === "derecha" ? -22 : 22;

  return (
    <g>
      <path
        d={`
      M ${x + 2} ${y + 2}
      C ${x + curve + 2} ${y + height * 0.32}
        ${x + curve + 2} ${y + height * 0.68}
        ${x + 2} ${y + height + 2}
    `}
        fill="none"
        stroke="rgba(0,0,0,0.46)"
        strokeWidth={9}
        strokeLinecap="round"
      />

      <path
        d={`
      M ${x} ${y}
      C ${x + curve} ${y + height * 0.32}
        ${x + curve} ${y + height * 0.68}
        ${x} ${y + height}
    `}
        fill="none"
        stroke="url(#handleSteel)"
        strokeWidth={7}
        strokeLinecap="round"
      />

      <path
        d={`
      M ${x - 2} ${y + 8}
      C ${x + curve - 2} ${y + height * 0.34}
        ${x + curve - 2} ${y + height * 0.66}
        ${x - 2} ${y + height - 8}
    `}
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={1.2}
        strokeLinecap="round"
      />

      <circle cx={x} cy={y + 16} r={5.5} fill="#27272A" />
      <circle cx={x} cy={y + height - 16} r={5.5} fill="#27272A" />
    </g>
  );
}

function HalfHandle({
  x,
  y,
  side,
}: {
  x: number;
  y: number;
  side: PuertasConfig["mano"];
}) {
  const direction = side === "derecha" ? -1 : 1;

  return (
    <g>
      <rect x={x - 4} y={y - 17} width={8} height={34} rx={3} fill="#18181B" />

      <rect
        x={x - 2}
        y={y - 14}
        width={1.4}
        height={28}
        fill="rgba(255,255,255,0.24)"
      />

      <path
        d={`
      M ${x} ${y - 3}
      L ${x + direction * 20} ${y - 3}
      Q ${x + direction * 27} ${y - 3}
        ${x + direction * 27} ${y + 5}
      L ${x + direction * 27} ${y + 14}
    `}
        fill="none"
        stroke="#18181B"
        strokeWidth={5.5}
        strokeLinecap="round"
      />

      <path
        d={`
      M ${x + direction * 2} ${y - 5}
      L ${x + direction * 19} ${y - 5}
    `}
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </g>
  );
}

function LockSet({
  x,
  y,
  side,
}: {
  x: number;
  y: number;
  side: PuertasConfig["mano"];
}) {
  const direction = side === "derecha" ? -1 : 1;

  return (
    <g>
      <circle cx={x} cy={y} r={7} fill="#18181B" />
      <circle cx={x - 1} cy={y - 1} r={2} fill="rgba(255,255,255,0.22)" />

      <rect
        x={direction === 1 ? x : x - 32}
        y={y - 4}
        width={32}
        height={8}
        rx={4}
        fill="#18181B"
      />

      <rect
        x={direction === 1 ? x + 5 : x - 27}
        y={y - 2}
        width={20}
        height={1.5}
        fill="rgba(255,255,255,0.20)"
      />
    </g>
  );
}

function OpeningLines({
  leaf,
  mano,
}: {
  leaf: Leaf;
  mano: PuertasConfig["mano"];
}) {
  const hingeX = mano === "derecha" ? leaf.x + leaf.width : leaf.x;

  const targetX = mano === "derecha" ? leaf.x + 18 : leaf.x + leaf.width - 18;

  return (
    <path
      d={`
    M ${hingeX} ${leaf.y + 20}
    L ${targetX} ${leaf.y + leaf.height / 2}
    L ${hingeX} ${leaf.y + leaf.height - 20}
  `}
      fill="none"
      stroke="rgba(255,255,255,0.18)"
      strokeWidth={1.5}
      strokeDasharray="5 4"
    />
  );
}

function SlidingGuide({
  x,
  y,
  width,
  height,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  return (
    <g>
      <rect
        x={x - 22}
        y={y + height + 18}
        width={width + 44}
        height={8}
        rx={4}
        fill="#27272A"
      />

      <rect
        x={x - 22}
        y={y - 26}
        width={width + 44}
        height={7}
        rx={3.5}
        fill="#27272A"
      />

      <circle cx={x + width * 0.24} cy={y + height + 22} r={5} fill="#A1A1AA" />
      <circle cx={x + width * 0.76} cy={y + height + 22} r={5} fill="#A1A1AA" />
    </g>
  );
}

function FoldingLines({ leaves }: { leaves: Leaf[] }) {
  return (
    <>
      {leaves.map((leaf, index) => (
        <path
          key={`fold-${index}`}
          d={`
        M ${leaf.x} ${leaf.y + 15}
        L ${leaf.x + leaf.width} ${leaf.y + leaf.height / 2}
        L ${leaf.x} ${leaf.y + leaf.height - 15}
      `}
          fill="none"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
      ))}
    </>
  );
}

function DimensionLines({
  x,
  y,
  width,
  height,
  realWidth,
  realHeight,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  realWidth: number;
  realHeight: number;
}) {
  const offset = 38;

  return (
    <g>
      <line
        x1={x}
        y1={y + height + offset}
        x2={x + width}
        y2={y + height + offset}
        stroke="#71717A"
        strokeWidth={1.4}
      />

      <polygon
        points={`${x + 8},${y + height + offset - 4} ${x},${y + height + offset} ${x + 8},${y + height + offset + 4}`}
        fill="#A1A1AA"
      />

      <polygon
        points={`${x + width - 8},${y + height + offset - 4} ${x + width},${y + height + offset} ${x + width - 8},${y + height + offset + 4}`}
        fill="#A1A1AA"
      />

      <text
        x={x + width / 2}
        y={y + height + offset - 7}
        textAnchor="middle"
        fill="#A1A1AA"
        fontSize={13}
      >
        {realWidth} cm
      </text>

      <line
        x1={x - offset}
        y1={y}
        x2={x - offset}
        y2={y + height}
        stroke="#71717A"
        strokeWidth={1.4}
      />

      <polygon
        points={`${x - offset - 4},${y + 8} ${x - offset},${y} ${x - offset + 4},${y + 8}`}
        fill="#A1A1AA"
      />

      <polygon
        points={`${x - offset - 4},${y + height - 8} ${x - offset},${y + height} ${x - offset + 4},${y + height - 8}`}
        fill="#A1A1AA"
      />

      <text
        x={x - offset - 14}
        y={y + height / 2}
        textAnchor="middle"
        fill="#A1A1AA"
        fontSize={13}
        transform={`rotate(-90 ${x - offset - 14} ${y + height / 2})`}
      >
        {realHeight} cm
      </text>
    </g>
  );
}

function buildLeaves(
  config: PuertasConfig,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const mode = normalizeDoorMode(config.tipoConfiguracion, config.tipoPorton);

  if (mode === "doble") {
    const leafWidth = width / 2;

    return [
      {
        x,
        y,
        width: leafWidth,
        height,
      },
      {
        x: x + leafWidth,
        y,
        width: leafWidth,
        height,
      },
    ];
  }

  if (mode === "puerta_y_media") {
    return [
      {
        x,
        y,
        width: width * 0.64,
        height,
      },
      {
        x: x + width * 0.64,
        y,
        width: width * 0.36,
        height,
        isSecondary: true,
      },
    ];
  }

  if (mode === "corredizo") {
    const totalLeaves = Math.max(2, config.hojas || 2);
    const leafWidth = width / totalLeaves;

    return Array.from({ length: totalLeaves }, (_, index) => ({
      x: x + index * leafWidth + (index % 2 === 0 ? -10 : 10),
      y,
      width: leafWidth + 8,
      height,
    }));
  }

  if (mode === "plegadizo") {
    const totalLeaves = Math.max(3, config.hojas || 4);
    const leafWidth = width / totalLeaves;

    return Array.from({ length: totalLeaves }, (_, index) => ({
      x: x + index * leafWidth,
      y,
      width: leafWidth,
      height,
      rotate: index % 2 === 0 ? -3 : 3,
      originX: x + index * leafWidth,
      originY: y + height / 2,
    }));
  }

  return [
    {
      x,
      y,
      width,
      height,
    },
  ];
}

export function PuertasPreview({ config }: Props) {
  const model = normalizeModel(config.modelo);

  const mode = normalizeDoorMode(config.tipoConfiguracion, config.tipoPorton);

  const vidrio = normalizeGlass(config.vidrio);

  const color =
    SVG_COLORS[config.color as keyof typeof SVG_COLORS] || SVG_COLORS.blanco;

  const ratio = config.ancho / config.alto;

  const drawHeight = 300;

  const drawWidth = Math.min(310, Math.max(105, drawHeight * ratio));

  const left = (VIEW_SIZE - drawWidth) / 2;

  const top = 82;

  const leaves = buildLeaves(config, left, top, drawWidth, drawHeight);

  const mainLeaf =
    config.mano === "derecha" ? leaves[leaves.length - 1] : leaves[0];

  const handleX =
    config.mano === "derecha"
      ? mainLeaf.x + mainLeaf.width - 26
      : mainLeaf.x + 26;

  const handleY = mainLeaf.y + mainLeaf.height * 0.52;

  return (
    <div
      className="
        rounded-2xl
        border border-border
        bg-card
        p-6
        transition-all duration-300
      "
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Puerta</h3>

        <span className="text-sm text-muted-foreground">
          {config.ancho} × {config.alto}
        </span>
      </div>

      <div
        className="
          relative
          mt-6
          flex
          h-[420px]
          items-center
          justify-center
          overflow-hidden
          rounded-2xl
          border border-white/5
          bg-gradient-to-b
          from-zinc-950
          via-zinc-900
          to-black
          p-6
          transition-all duration-300
        "
      >
        <div
          className="
            absolute
            h-[420px]
            w-[420px]
            rounded-full
            bg-white/[0.015]
            blur-3xl
          "
        />

        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
          fill="none"
          className="relative z-10 drop-shadow-[0_0_18px_rgba(0,0,0,0.35)]"
        >
          <defs>
            <linearGradient
              id="aluminumGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
              <stop offset="22%" stopColor="rgba(255,255,255,0.12)" />
              <stop offset="52%" stopColor="rgba(0,0,0,0.14)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
            </linearGradient>

            <linearGradient id="glassClassic" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.24)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
            </linearGradient>

            <linearGradient id="glassLaminado" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(125,211,252,0.30)" />
              <stop offset="100%" stopColor="rgba(30,64,175,0.18)" />
            </linearGradient>

            <linearGradient id="glassDvh" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(113,113,122,0.48)" />
              <stop offset="45%" stopColor="rgba(39,39,42,0.42)" />
              <stop offset="100%" stopColor="rgba(10,10,12,0.36)" />
            </linearGradient>

            <linearGradient id="glassEsmerilado" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(244,244,245,0.38)" />
              <stop offset="100%" stopColor="rgba(161,161,170,0.26)" />
            </linearGradient>

            <pattern
              id="glassFantasia"
              width="12"
              height="12"
              patternUnits="userSpaceOnUse"
            >
              <rect width="12" height="12" fill="rgba(148,163,184,0.18)" />
              <path
                d="M 0 12 L 12 0 M -3 9 L 3 15 M 9 -3 L 15 3"
                stroke="rgba(255,255,255,0.20)"
                strokeWidth={1}
              />
            </pattern>

            <linearGradient id="handleSteel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F4F4F5" />
              <stop offset="35%" stopColor="#A1A1AA" />
              <stop offset="70%" stopColor="#52525B" />
              <stop offset="100%" stopColor="#E4E4E7" />
            </linearGradient>
          </defs>

          {mode === "corredizo" && (
            <SlidingGuide
              x={left}
              y={top}
              width={drawWidth}
              height={drawHeight}
            />
          )}

          <rect
            x={left - 9}
            y={top - 9}
            width={drawWidth + 18}
            height={drawHeight + 18}
            rx={3}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />

          <rect
            x={left - 5}
            y={top - 5}
            width={drawWidth + 10}
            height={drawHeight + 10}
            rx={3}
            fill="none"
            stroke={color}
            strokeWidth={4}
            opacity={0.55}
          />

          {leaves.map((leaf, index) => (
            <DoorLeaf
              key={`leaf-${index}`}
              leaf={leaf}
              model={model}
              color={color}
              vidrio={vidrio}
              linea={config.linea}
            />
          ))}

          {mode === "plegadizo" && <FoldingLines leaves={leaves} />}

          {mode !== "corredizo" &&
            leaves.map((leaf, index) => (
              <OpeningLines
                key={`opening-${index}`}
                leaf={leaf}
                mano={
                  index === 0
                    ? config.mano
                    : config.mano === "derecha"
                      ? "izquierda"
                      : "derecha"
                }
              />
            ))}

          {config.extras.barralRecto ? (
            <StraightBar
              x={handleX}
              y={mainLeaf.y + mainLeaf.height * 0.24}
              height={mainLeaf.height * 0.46}
            />
          ) : null}

          {config.extras.barralCurvo ? (
            <CurvedBar
              x={handleX}
              y={mainLeaf.y + mainLeaf.height * 0.24}
              height={mainLeaf.height * 0.46}
              side={config.mano}
            />
          ) : null}

          {config.extras.manija ? (
            <HalfHandle x={handleX} y={handleY} side={config.mano} />
          ) : null}

          {config.extras.picaporte ? (
            <LockSet x={handleX} y={handleY + 18} side={config.mano} />
          ) : null}

          <line
            x1={left}
            y1={top + drawHeight + 10}
            x2={left + drawWidth}
            y2={top + drawHeight + 10}
            stroke="rgba(0,0,0,0.35)"
            strokeWidth={7}
            strokeLinecap="round"
          />

          <DimensionLines
            x={left}
            y={top}
            width={drawWidth}
            height={drawHeight}
            realWidth={config.ancho}
            realHeight={config.alto}
          />
        </svg>
      </div>

      <div className="mt-4 space-y-3 text-sm text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Línea: {config.linea}</span>

          <span>Color: {config.color}</span>
        </div>

        <div
          className="
            rounded-xl
            border border-border
            bg-background
            px-4 py-3
            text-center
          "
        >
          <div className="text-base font-medium text-foreground">
            {config.ancho} × {config.alto} cm
          </div>
        </div>

        <div className="mt-2 text-xs text-muted-foreground">
          Puerta {config.ancho}x{config.alto}
          {" · "}
          {config.linea}
          {" · "}
          {config.tipoConfiguracion}
          {config.modelo && ` · ${config.modelo}`}
          {config.vidrio && ` · ${config.vidrio}`}
          {config.extras.barralRecto ? " · barral recto" : ""}
          {config.extras.barralCurvo ? " · barral curvo" : ""}
          {config.extras.manija ? " · media manija" : ""}
          {config.extras.picaporte ? " · picaporte" : ""}
        </div>
      </div>
    </div>
  );
}
