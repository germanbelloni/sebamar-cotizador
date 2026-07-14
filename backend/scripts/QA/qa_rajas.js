const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcularRajaHerrero = require(
  fromRoot("wrappers/rajas/calcularRajaHerrero"),
);

const calcularRajaModena = require(
  fromRoot("wrappers/rajas/calcularRajaModena"),
);

// ======================================
// SILENCIAR LOGS
// ======================================

const originalLog = console.log;
const originalDir = console.dir;

console.log = () => {};
console.dir = () => {};

// ======================================
// OUTPUT
// ======================================

const carpeta = path.join(__dirname, "output");

if (!fs.existsSync(carpeta)) {
  fs.mkdirSync(carpeta);
}

const archivo = path.join(carpeta, "qa_rajas.csv");

if (fs.existsSync(archivo)) {
  fs.unlinkSync(archivo);
}

fs.writeFileSync(
  archivo,
  "\uFEFFmodulo;perfil;medida;color;descripcion;extras;costo;proveedor;precio;ganancia\n",
);

// ======================================
// DATOS
// ======================================

const perfiles = ["amarilla", "azul", "verde", "papu"];

const colores = ["blanco", "negro", "bronce colonial", "simil madera"];

const medidas = [
  {
    ancho: 50,
    alto: 100,
  },
];

// ======================================
// HELPERS
// ======================================

function guardar(linea) {
  fs.appendFileSync(archivo, `${linea}\n`);
}

function descripcionHerrero(extra) {
  const partes = [];

  if (extra.modelo === "brazo") {
    partes.push("Brazo");
  }

  if (extra.modelo === "volcable") {
    partes.push("Volcable");
  }

  if (extra.mosquitero) {
    partes.push("Mosquitero");
  }

  if (partes.length === 0) {
    return "Raja";
  }

  return partes.join(" + ");
}

function descripcionModena(extra) {
  const partes = [];

  if (extra.modelo === "brazo") {
    partes.push("Brazo");
  }

  if (extra.modelo === "volcable") {
    partes.push("Volcable");
  }

  if (extra.modelo === "oscilobatiente") {
    partes.push("Oscilobatiente");
  }

  if (extra.mosquitero) {
    partes.push("Mosquitero");
  }

  if (extra.premarco) {
    partes.push("Premarco");
  }

  if (extra.contramarco) {
    partes.push("Contramarco");
  }

  if (partes.length === 0) {
    return "Raja";
  }

  return partes.join(" + ");
}

// ======================================
// HERRERO
// ======================================

const variantesHerrero = [
  {
    nombre: "raja",
    modelo: "raja",
    mosquitero: false,
  },
  {
    nombre: "raja+mosquitero",
    modelo: "raja",
    mosquitero: true,
  },
  {
    nombre: "brazo",
    modelo: "brazo",
    mosquitero: false,
  },
  {
    nombre: "brazo+mosquitero",
    modelo: "brazo",
    mosquitero: true,
  },
  {
    nombre: "volcable",
    modelo: "volcable",
    mosquitero: false,
  },
  {
    nombre: "volcable+mosquitero",
    modelo: "volcable",
    mosquitero: true,
  },
];

for (const perfil of perfiles) {
  for (const medida of medidas) {
    for (const color of colores) {
      for (const extra of variantesHerrero) {
        try {
          const r = calcularRajaHerrero({
            ancho: medida.ancho,
            alto: medida.alto,

            perfil,
            color,

            tipoVidrio: "4mm",

            modelo: extra.modelo,
            mosquitero: extra.mosquitero,
            bisagra: "izquierda",
          });

          const descripcion = [
            `${medida.ancho}x${medida.alto}`,
            color,
            descripcionHerrero(extra),
          ].join(" | ");

          const linea = [
            "RAJA_HERRERO",
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
          guardar(
            [
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
            ].join(";"),
          );
        }
      }
    }
  }
}

// ======================================
// MODENA
// ======================================

const variantesModena = [
  {
    nombre: "raja",
    modelo: "raja",
    mosquitero: false,
    premarco: false,
    contramarco: false,
  },
  {
    nombre: "raja+mosquitero",
    modelo: "raja",
    mosquitero: true,
    premarco: false,
    contramarco: false,
  },
  {
    nombre: "contramarco",
    modelo: "raja",
    mosquitero: false,
    premarco: false,
    contramarco: true,
  },
  {
    nombre: "premarco+contramarco",
    modelo: "raja",
    mosquitero: false,
    premarco: true,
    contramarco: true,
  },
  {
    nombre: "brazo",
    modelo: "brazo",
    mosquitero: false,
    premarco: false,
    contramarco: false,
  },
  {
    nombre: "volcable",
    modelo: "volcable",
    mosquitero: false,
    premarco: false,
    contramarco: false,
  },
  {
    nombre: "oscilobatiente",
    modelo: "oscilobatiente",
    mosquitero: false,
    premarco: false,
    contramarco: false,
  },
];

for (const perfil of perfiles) {
  for (const medida of medidas) {
    for (const color of colores) {
      for (const extra of variantesModena) {
        try {
          const r = calcularRajaModena({
            ancho: medida.ancho,
            alto: medida.alto,

            perfil,
            color,

            vidrio: "4mm",

            modelo: extra.modelo,
            mosquitero: extra.mosquitero,
            premarco: extra.premarco,
            contramarco: extra.contramarco,
            bisagra: "izquierda",
          });

          const descripcion = [
            `${medida.ancho}x${medida.alto}`,
            color,
            descripcionModena(extra),
          ].join(" | ");

          const linea = [
            "RAJA_MODENA",
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
          guardar(
            [
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
            ].join(";"),
          );
        }
      }
    }
  }
}

// ======================================

console.log = originalLog;
console.dir = originalDir;

console.log("");
console.log("✅ QA Rajas generado:");
console.log(archivo);

console.timeEnd?.("QA Rajas");
