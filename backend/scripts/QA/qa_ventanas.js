const fs = require("fs");
const path = require("path");

console.time("QA Ventanas");

// ======================================================
// WRAPPERS
// ======================================================

const calcularVentanaHerrero = require("../../../wrappers/ventanas/calcularVentanaHerrero");

const calcularVentanaModena = require("../../../wrappers/ventanas/calcularVentanaModena");

// ======================================================
// OUTPUT
// ======================================================

const carpeta = path.join(__dirname, "output");

if (!fs.existsSync(carpeta)) {
  fs.mkdirSync(carpeta);
}

const archivo = path.join(carpeta, "qa_ventanas.csv");

fs.writeFileSync(
  archivo,
  "\uFEFFmodulo;perfil;medida;color;descripcion;extras;costo;proveedor;precio;ganancia\n",
  "utf8",
);

// ======================================================
// DATOS BASE
// ======================================================

const perfiles = ["amarilla", "azul", "verde", "papu"];

const colores = ["blanco", "negro", "bronce colonial", "simil madera"];

const medidasHerrero = [
  {
    ancho: 150,
    alto: 150,
  },
  {
    ancho: 120,
    alto: 110,
  },
];

const medidasModena = [
  {
    ancho: 150,
    alto: 150,
  },
  {
    ancho: 120,
    alto: 110,
  },
];

// ======================================================
// HELPERS
// ======================================================

function guardar(linea) {
  fs.appendFileSync(archivo, `${linea}\n`, "utf8");
}
function descripcionHerrero(extra) {
  const partes = [];

  if (extra.mosquitero) {
    partes.push("Mosquitero");
  }

  if (extra.guia) {
    partes.push("Guía");
  }

  if (extra.cortina === "pvc") {
    partes.push("Cortina PVC");
  }

  if (extra.cortina === "aluminio") {
    partes.push("Cortina Aluminio");
  }

  if (partes.length === 0) {
    return "Sin extras";
  }

  return partes.join(" + ");
}

function descripcionModena(extra) {
  const partes = [];

  partes.push(extra.tipoVidrio);

  if (extra.mosquitero) {
    partes.push("Mosquitero");
  }

  if (extra.premarco) {
    partes.push("Premarco");
  }

  if (extra.contramarco) {
    partes.push("Contramarco");
  }

  return partes.join(" + ");
}

// ======================================================
// VENTANAS HERRERO
// ======================================================

const variantesHerrero = [
  {
    nombre: "sin extras",
    mosquitero: false,
    guia: false,
    cortina: null,
  },
  {
    nombre: "mosquitero",
    mosquitero: true,
    guia: false,
    cortina: null,
  },
  {
    nombre: "guia",
    mosquitero: false,
    guia: true,
    cortina: null,
  },
  {
    nombre: "guia+pvc",
    mosquitero: false,
    guia: true,
    cortina: "pvc",
  },
  {
    nombre: "guia+aluminio",
    mosquitero: false,
    guia: true,
    cortina: "aluminio",
  },
  {
    nombre: "mosq+guia",
    mosquitero: true,
    guia: true,
    cortina: null,
  },
  {
    nombre: "mosq+guia+pvc",
    mosquitero: true,
    guia: true,
    cortina: "pvc",
  },
  {
    nombre: "mosq+guia+aluminio",
    mosquitero: true,
    guia: true,
    cortina: "aluminio",
  },
];

for (const perfil of perfiles) {
  for (const medida of medidasHerrero) {
    for (const color of colores) {
      for (const extra of variantesHerrero) {
        try {
          const r = calcularVentanaHerrero({
            ancho: medida.ancho,
            alto: medida.alto,

            perfil,
            color,

            tipoVidrio: "3mm",

            mosquitero: extra.mosquitero,
            guia: extra.guia,
            cortina: extra.cortina,
          });

          const descripcion = [
            `${medida.ancho}x${medida.alto}`,
            color,
            descripcionHerrero(extra),
          ].join(" | ");

          const linea = [
            "VENTANA_HERRERO",
            perfil,
            `${medida.ancho}x${medida.alto}`,
            color,
            descripcion,
            extra.nombre,
            Math.round(r.costo || 0),
            Math.round(r.precioProveedor || 0),
            Math.round(r.precioFinal || 0),
            Math.round(r.ganancia || 0),
          ].join(";");

          guardar(linea);
        } catch (e) {
          const linea = [
            "ERROR",
            perfil,
            `${medida.ancho}x${medida.alto}`,
            color,
            extra.nombre,
            extra.nombre,
            "",
            "",
            "",
            e.message,
          ].join(";");

          guardar(linea);
        }
      }
    }
  }
}

// ======================================================
// VENTANAS MODENA
// ======================================================

const variantesModena = [
  {
    nombre: "4mm",
    tipoVidrio: "4mm",
    mosquitero: false,
    premarco: false,
    contramarco: false,
  },
  {
    nombre: "4mm+mosquitero",
    tipoVidrio: "4mm",
    mosquitero: true,
    premarco: false,
    contramarco: false,
  },
  {
    nombre: "4mm+premarco",
    tipoVidrio: "4mm",
    mosquitero: false,
    premarco: true,
    contramarco: false,
  },
  {
    nombre: "4mm+premarco+contramarco",
    tipoVidrio: "4mm",
    mosquitero: false,
    premarco: true,
    contramarco: true,
  },
  {
    nombre: "4mm+mosq+premarco+contramarco",
    tipoVidrio: "4mm",
    mosquitero: true,
    premarco: true,
    contramarco: true,
  },
  {
    nombre: "DVH 4+9+4",
    tipoVidrio: "DVH 4+9+4",
    mosquitero: false,
    premarco: false,
    contramarco: false,
  },
];

for (const perfil of perfiles) {
  for (const medida of medidasModena) {
    for (const color of colores) {
      for (const extra of variantesModena) {
        try {
          const r = calcularVentanaModena({
            ancho: medida.ancho,
            alto: medida.alto,

            perfil,
            color,

            tipoVidrio: extra.tipoVidrio,

            mosquitero: extra.mosquitero,
            premarco: extra.premarco,
            contramarco: extra.contramarco,
          });

          const descripcion = [
            `${medida.ancho}x${medida.alto}`,
            color,
            descripcionModena(extra),
          ].join(" | ");

          const linea = [
            "VENTANA_MODENA",
            perfil,
            `${medida.ancho}x${medida.alto}`,
            color,
            descripcion,
            extra.nombre,
            Math.round(r.costo || 0),
            Math.round(r.precioProveedor || 0),
            Math.round(r.precioFinal || 0),
            Math.round(r.ganancia || 0),
          ].join(";");

          guardar(linea);
        } catch (e) {
          const linea = [
            "ERROR",
            perfil,
            `${medida.ancho}x${medida.alto}`,
            color,
            extra.nombre,
            extra.nombre,
            "",
            "",
            "",
            e.message,
          ].join(";");

          guardar(linea);
        }
      }
    }
  }
}

console.log("");
console.log("✅ QA Ventanas generado:");
console.log(archivo);
console.timeEnd("QA Ventanas");
