const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcularPatagonicaHerrero = require(
  fromRoot("wrappers/patagonicas/calcularPatagonicaHerrero"),
);

const calcularPatagonicaModena = require(
  fromRoot("wrappers/patagonicas/calcularPatagonicaModena"),
);

const originalLog = console.log;
const originalDir = console.dir;

console.log = () => {};
console.dir = () => {};

const carpeta = path.join(__dirname, "output");

if (!fs.existsSync(carpeta)) {
  fs.mkdirSync(carpeta);
}

const archivo = path.join(carpeta, "qa_patagonicas.csv");

if (fs.existsSync(archivo)) {
  fs.unlinkSync(archivo);
}

fs.writeFileSync(
  archivo,
  "\uFEFFmodulo;perfil;medida;color;extras;costo;proveedor;precio;ganancia\n",
);

function guardar(linea) {
  fs.appendFileSync(archivo, `${linea}\n`);
}

const perfiles = ["amarilla", "azul", "verde", "papu"];

const colores = ["blanco", "negro", "bronce colonial", "simil madera"];

const medidas = [
  {
    tipo: "1_raja",
    medida: "150x110",
    cantidadRajas: 1,
    ancho: 150,
    alto: 110,
  },
  {
    tipo: "2_rajas",
    medida: "200x150",
    cantidadRajas: 2,
    ancho: 200,
    alto: 150,
  },
];

const variantesHerrero = [
  { nombre: "raja", tipoRaja: "raja" },
  { nombre: "brazo", tipoRaja: "brazo" },
  { nombre: "volcable", tipoRaja: "volcable" },
];

const variantesModena = [
  {
    nombre: "raja",
    tipoRaja: "raja",
    mosquitero: false,
    premarco: false,
    contramarco: false,
    herrajesBlancos: false,
  },
  {
    nombre: "brazo",
    tipoRaja: "brazo",
    mosquitero: false,
    premarco: false,
    contramarco: false,
    herrajesBlancos: false,
  },
  {
    nombre: "volcable",
    tipoRaja: "volcable",
    mosquitero: false,
    premarco: false,
    contramarco: false,
    herrajesBlancos: false,
  },
  {
    nombre: "oscilobatiente",
    tipoRaja: "oscilobatiente",
    mosquitero: false,
    premarco: false,
    contramarco: false,
    herrajesBlancos: false,
  },
  {
    nombre: "mosquitero",
    tipoRaja: "raja",
    mosquitero: true,
    premarco: false,
    contramarco: false,
    herrajesBlancos: false,
  },
  {
    nombre: "premarco",
    tipoRaja: "raja",
    mosquitero: false,
    premarco: true,
    contramarco: true,
    herrajesBlancos: false,
  },
  {
    nombre: "herrajes_blancos",
    tipoRaja: "raja",
    mosquitero: false,
    premarco: false,
    contramarco: false,
    herrajesBlancos: true,
  },
];

// =====================================
// HERRERO
// =====================================

for (const perfil of perfiles) {
  for (const color of colores) {
    for (const medida of medidas) {
      for (const extra of variantesHerrero) {
        try {
          const r = calcularPatagonicaHerrero({
            medidaTotal: medida.medida,
            tipo: medida.tipo,
            perfil,
            color,
            tipoVidrio: "4mm",
            tipoRaja: extra.tipoRaja,
            anchoRaja: 40,
            linea: "Herrero",
          });

          guardar(
            [
              "PATAGONICA_HERRERO",
              perfil,
              medida.medida,
              color,
              extra.nombre,
              Math.round(r.costo || 0),
              Math.round(r.precioProveedor || 0),
              Math.round(r.precioFinal || 0),
              Math.round(r.ganancia || 0),
            ].join(";"),
          );
        } catch (e) {
          guardar(
            [
              "ERROR",
              perfil,
              medida.medida,
              color,
              extra.nombre,
              "",
              "",
              "",
              e.message,
            ].join(";"),
          );
        }
      }
    }
  }
}

// =====================================
// MODENA
// =====================================

for (const perfil of perfiles) {
  for (const color of colores) {
    for (const medida of medidas) {
      for (const extra of variantesModena) {
        try {
          const r = calcularPatagonicaModena({
            medida: medida.medida,
            ancho: medida.ancho,
            alto: medida.alto,
            cantidadRajas: medida.cantidadRajas,
            perfil,
            color,
            tipoVidrio: "4mm",
            tipoRaja: extra.tipoRaja,
            mosquitero: extra.mosquitero,
            premarco: extra.premarco,
            contramarco: extra.contramarco,
            herrajesBlancos: extra.herrajesBlancos,
          });

          guardar(
            [
              "PATAGONICA_MODENA",
              perfil,
              medida.medida,
              color,
              extra.nombre,
              Math.round(r.costo || 0),
              Math.round(r.precioProveedor || 0),
              Math.round(r.precioFinal || 0),
              Math.round(r.ganancia || 0),
            ].join(";"),
          );
        } catch (e) {
          guardar(
            [
              "ERROR",
              perfil,
              medida.medida,
              color,
              extra.nombre,
              "",
              "",
              "",
              e.message,
            ].join(";"),
          );
        }
      }
    }
  }
}

console.log = originalLog;
console.dir = originalDir;

console.log("");
console.log("✅ QA Patagónicas generado:");
console.log(archivo);
