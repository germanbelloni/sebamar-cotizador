"use strict";

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const proveedorDatos = require("./data/proveedorDatos");
const transformarVentanasHerrero = require("./data/transformadores/ventanasHerrero");
const transformarMosquiterosVentana = require("./data/transformadores/mosquiterosVentana");
const transformarRajasHerrero = require("./data/transformadores/rajasHerrero");
const transformarPuertasHerrero = require("./data/transformadores/puertasHerrero");
const transformarMediaPuertaHerrero = require("./data/transformadores/mediaPuertaHerrero");
const transformarVentanasModena = require("./data/transformadores/ventanasModena");
const transformarRajasModena = require("./data/transformadores/rajasModena");
const transformarPuertasModena = require("./data/transformadores/puertasModena");
const transformarPatagonicasModena = require("./data/transformadores/patagonicasModena");
const transformarPostigones = require("./data/transformadores/postigones");
const transformarPuertasLivianas = require("./data/transformadores/puertasLivianas");
const transformarRecargos = require("./data/transformadores/recargos");
const transformarPuertasPlaca = require("./data/transformadores/puertasPlaca");
const renderWorkbook = require("./render/renderWorkbook");
const temas = require("./config/temas");

const MODULOS = {
  "ventanas-herrero": {
    archivo: "Ventanas Herrero",
    obtenerFilas: proveedorDatos.obtenerVentanasHerrero,
    transformar: transformarVentanasHerrero,
  },
  "mosquiteros-ventana": {
    archivo: "Mosquiteros ventana",
    obtenerFilas: () => proveedorDatos.leerHoja("MOSQUITEROS_VENTANA"),
    transformar: transformarMosquiterosVentana,
  },
  "rajas-herrero": {
    archivo: "Rajas Herrero",
    obtenerFilas: () => proveedorDatos.leerHoja("RAJAS_HERRERO"),
    transformar: transformarRajasHerrero,
  },
  "puertas-herrero": {
    archivo: "Puertas Herrero",
    obtenerFilas: () => proveedorDatos.leerHoja("PUERTAS_HERRERO"),
    transformar: transformarPuertasHerrero,
  },
  "media-puerta-herrero": {
    archivo: "Media Puerta Herrero",
    obtenerFilas: () => proveedorDatos.leerHoja("MEDIA_PUERTA_HERRERO"),
    transformar: transformarMediaPuertaHerrero,
  },
  "ventanas-modena": {
    archivo: "Ventanas Modena",
    obtenerFilas: () => proveedorDatos.leerHoja("VENTANAS_MODENA"),
    transformar: transformarVentanasModena,
  },
  "rajas-modena": {
    archivo: "Rajas Modena",
    obtenerFilas: () => proveedorDatos.leerHoja("RAJAS_MODENA"),
    transformar: transformarRajasModena,
  },
  "puertas-modena": {
    archivo: "Puertas Modena",
    obtenerFilas: () => proveedorDatos.leerHoja("PUERTAS_MODENA"),
    transformar: transformarPuertasModena,
  },
  "patagonicas-modena": {
    archivo: "Patagonicas Modena",
    obtenerFilas: () => proveedorDatos.leerHoja("PATAGONICAS_MODENA"),
    transformar: transformarPatagonicasModena,
  },
  postigones: {
    archivo: "Postigones",
    obtenerFilas: () => proveedorDatos.leerHoja("POSTIGONES"),
    transformar: transformarPostigones,
  },
  "puertas-livianas": {
    archivo: "Puertas Livianas",
    obtenerFilas: () => proveedorDatos.leerHoja("PUERTAS_ECO"),
    transformar: transformarPuertasLivianas,
  },
  recargos: {
    archivo: "Recargos",
    obtenerFilas: proveedorDatos.obtenerSuperficies,
    transformar: transformarRecargos,
  },
  "puertas-placa": {
    archivo: "Puertas Placa",
    obtenerFilas: () => proveedorDatos.leerHoja("PUERTAS_PLACA"),
    transformar: transformarPuertasPlaca,
  },
};

const TODOS = [
  "ventanas-herrero",
  "mosquiteros-ventana",
  "rajas-herrero",
  "puertas-herrero",
  "media-puerta-herrero",
  "ventanas-modena",
  "rajas-modena",
  "puertas-modena",
  "patagonicas-modena",
  "postigones",
  "puertas-livianas",
  "puertas-placa",
  "recargos",
];

const moduloNombre = process.argv[2] || "ventanas-herrero";
const perfil = (process.argv[3] || "amarilla").toLowerCase();
const PERFILES = ["amarilla", "azul", "verde", "papu"];
const modulo = MODULOS[moduloNombre];

if (moduloNombre !== "todo" && !modulo) {
  throw new Error(`Modulo inexistente: ${moduloNombre}.`);
}
if (perfil !== "todos" && !temas[perfil]) {
  throw new Error(`Perfil visual inexistente: ${perfil}.`);
}

async function generarModulo(moduloNombre, perfil) {
  const modulo = MODULOS[moduloNombre];

  if (!modulo) {
    throw new Error(`Modulo inexistente: ${moduloNombre}.`);
  }

  const hoja = modulo.transformar(modulo.obtenerFilas(), perfil);

  return hoja;
}

async function main() {
  if (moduloNombre === "todo") {
    const perfiles = perfil === "todos" ? PERFILES : [perfil];

    const outputDir = path.resolve(__dirname, "output");

    fs.rmSync(outputDir, {
      recursive: true,
      force: true,
    });

    fs.mkdirSync(outputDir, {
      recursive: true,
    });

    for (const p of perfiles) {
      console.log("\n=================================");
      console.log(` PERFIL ${p.toUpperCase()}`);
      console.log("=================================\n");

      const hojas = [];

      for (const nombre of TODOS) {
        console.log(`\n========== ${nombre} ==========\n`);

        const hoja = await generarModulo(nombre, p);

        hojas.push(hoja);
      }

      const baseName = `Lista ${temas[p].nombre}`;

      const xlsxPath = path.join(outputDir, `${baseName}.xlsx`);
      const jsonPath = path.join(outputDir, `${baseName}.json`);
      const pdfPath = path.join(outputDir, `${baseName}.pdf`);

      await renderWorkbook({
        hojas,
        output: xlsxPath,
      });

      fs.writeFileSync(jsonPath, JSON.stringify(hojas, null, 2), "utf8");

      execFileSync(
        "python",
        [path.join(__dirname, "render", "render_pdf.py"), jsonPath, pdfPath],
        { stdio: "inherit" },
      );

      console.log(`✅ Excel generado: ${baseName}.xlsx`);
      console.log(`✅ PDF generado: ${baseName}.pdf`);
    }

    console.log("\n✅ Todas las listas fueron generadas.");
    return;
  }

  // Generación individual
  const hoja = await generarModulo(moduloNombre, perfil);

  const outputDir = path.resolve(__dirname, "output");

  fs.mkdirSync(outputDir, { recursive: true });

  const baseName = `Lista ${temas[perfil].nombre} - ${MODULOS[moduloNombre].archivo}`;

  const xlsxPath = path.join(outputDir, `${baseName}.xlsx`);

  await renderWorkbook({
    hojas: [hoja],
    output: xlsxPath,
  });

  console.log(`✅ Excel generado: ${baseName}.xlsx`);
}

main().catch((error) => {
  console.error(`Error al generar ${moduloNombre}: ${error.message}`);
  process.exitCode = 1;
});
