const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const config = require("./config");
const helpers = require("./helpers");
const crearPDF = require("./pdf");

const calcularVentanaHerrero = require("../../wrappers/ventanas/calcularVentanaHerrero");
const calcularVentanaModena = require("../../wrappers/ventanas/calcularVentanaModena");
const calcularPuertaHerrero = require("../../wrappers/puertas/calcularPuerta");
const calcularPuertaModena = require("../../wrappers/puertas/calcularPuerta");
const calcularPuertaEco = require("../../wrappers/puertas/calcularPuertaEco");
const calcularMosquiteroVentana = require("../../wrappers/mosquiteros/calcularMosquiteroVentana");
const calcularMosquiteroFijo = require("../../wrappers/mosquiteros/calcularMosquiteroFijo");
const calcularPuertaMosquitera = require("../../wrappers/mosquiteros/calcularPuertaMosquitera");
const calcularRajaHerrero = require("../../wrappers/rajas/calcularRajaHerrero");
const calcularRajaModena = require("../../wrappers/rajas/calcularRajaModena");
const calcularPatagonicaHerrero = require("../../wrappers/patagonicas/calcularPatagonicaHerrero");
const calcularPatagonicaModena = require("../../wrappers/patagonicas/calcularPatagonicaModena");
const calcularPostigones = require("../../wrappers/postigones/calcularPostigones");
const calcularPortones = require("../../wrappers/portones/calcularPorton");
const calcularSuperficies = require("../../wrappers/superficies/calcularSuperficies");

const casos = [];

async function main() {
  console.log("");

  console.log("=================================");
  console.log("QA SEBAMAR");
  console.log("=================================");

  // ACA VAMOS A GENERAR LOS MODULOS

  await generarVentanasHerrero();

  await generarVentanasModena();

  await generarPuertasHerrero();

  await generarPuertasModena();

  await generarPuertasEco();

  await generarMosquiterosVentana();

  await generarMosquiterosFijos();

  await generarPuertasMosquiteras();

  await generarRajasHerrero();

  await generarRajasModena();

  await generarPatagonicasHerrero();

  await generarPatagonicasModena();

  await generarPostigones();

  await generarPortones();

  await generarMarcos();

  await generarPanosFijos();

  console.log("");

  console.log("Casos generados:", casos.length);

  await crearPDF(casos);

  console.log("");

  console.log("PDF generado correctamente.");
}

main();

async function generarVentanasHerrero() {
  console.log("Generando Ventanas Herrero...");

  const perfiles = config.perfiles;

  const casosBase = [
    {
      ancho: 120,
      alto: 100,
      color: "blanco",
      tipoVidrio: "3mm",
    },

    {
      ancho: 150,
      alto: 150,
      color: "negro",
      tipoVidrio: "4mm",
      mosquitero: true,
    },

    {
      ancho: 200,
      alto: 150,
      color: "bronce_colonial",
      tipoVidrio: "3+3",
      guia: true,
    },

    {
      ancho: 240,
      alto: 200,
      color: "simil_madera",
      tipoVidrio: "3+3",
      guia: true,
      cortina: "pvc",
      mosquitero: true,
    },
  ];

  for (const perfil of perfiles) {
    for (const configuracion of casosBase) {
      try {
        const resultado = calcularVentanaHerrero({
          ...configuracion,

          perfil,
        });

        casos.push({
          id: `VH-${perfil.toUpperCase()}-${casos.length + 1}`,

          modulo: "Ventanas Herrero",

          linea: "Herrero",

          nivel: casosBase.indexOf(configuracion) + 1,

          perfil,

          configuracion,

          resultado,
        });
      } catch (err) {
        console.log(err.message);
      }
    }
  }
}

async function generarVentanasModena() {
  console.log("Generando Ventanas Modena...");

  const perfiles = config.perfiles;

  const casosBase = [
    // NIVEL 1
    {
      ancho: 120,
      alto: 100,
      color: "blanco",
      tipoVidrio: "3mm",
    },

    // NIVEL 2
    {
      ancho: 150,
      alto: 150,
      color: "negro",
      tipoVidrio: "4mm",
      mosquitero: true,
    },

    // NIVEL 3
    {
      ancho: 200,
      alto: 150,
      color: "bronce_colonial",
      tipoVidrio: "DVH 4+9+4",
      guia: true,
      premarco: true,
    },

    // NIVEL 4
    {
      ancho: 240,
      alto: 200,
      color: "simil_madera",
      tipoVidrio: "DVH 5+9+5",
      guia: true,
      mosquitero: true,
      premarco: true,
      contramarco: true,
      bipuntos: true,
    },
  ];

  for (const perfil of perfiles) {
    for (const configuracion of casosBase) {
      try {
        const resultado = calcularVentanaModena({
          ...configuracion,

          perfil,
        });

        casos.push({
          id: `VM-${perfil.toUpperCase()}-${casos.length + 1}`,

          modulo: "Ventanas Modena",

          linea: "Modena",

          nivel: casosBase.indexOf(configuracion) + 1,

          perfil,

          configuracion,

          resultado,
        });
      } catch (err) {
        console.log(err.message);
      }
    }
  }
}

async function generarPuertasHerrero() {
  console.log("Generando Puertas Herrero...");

  const perfiles = config.perfiles;

  const casosBase = [
    // Caso 1
    {
      linea: "herrero",
      configuracion: "simple",
      modelo: "modelo 1",
      ancho: 80,
      alto: 200,
      color: "blanco",
      tipoVidrio: "3mm",
      mano: "derecha",
      extras: {},
    },

    // Caso 2
    {
      linea: "herrero",
      configuracion: "simple",
      modelo: "modelo 2",
      ancho: 90,
      alto: 200,
      color: "negro",
      tipoVidrio: "4mm",
      mano: "derecha",
      extras: {
        barralRecto: 1,
        mediaManija: true,
      },
    },

    // Caso 3
    {
      linea: "herrero",
      configuracion: "simple",
      modelo: "modelo 3",
      ancho: 90,
      alto: 205,
      color: "bronce_colonial",
      tipoVidrio: "fantasia",
      mano: "izquierda",
      extras: {
        picaporte: true,
      },
    },

    // Caso 4
    {
      linea: "herrero",
      configuracion: "simple",
      modelo: "modelo 11",
      ancho: 90,
      alto: 210,
      color: "simil_madera",
      tipoVidrio: "3+3",
      mano: "derecha",
      extras: {
        barralCurvo: 1,
        mediaManija: true,
        barraAntipanico: 1,
      },
    },
  ];

  for (const perfil of perfiles) {
    for (const configuracion of casosBase) {
      try {
        const resultado = calcularPuertaHerrero({
          ...configuracion,
          perfil,
        });

        casos.push({
          id: `PH-${perfil.toUpperCase()}-${casos.length + 1}`,
          modulo: "Puertas Herrero",
          linea: "Herrero",
          perfil,
          configuracion,
          resultado,
        });
      } catch (err) {
        console.log("Puertas Herrero:", err.message);
      }
    }
  }
}

async function generarPuertasModena() {
  console.log("Generando Puertas Modena...");

  const perfiles = config.perfiles;

  const casosBase = [
    // Caso 1
    {
      linea: "modena",
      configuracion: "simple",
      modelo: "modelo 1",
      ancho: 80,
      alto: 200,
      color: "blanco",
      tipoVidrio: "3mm",
      mano: "derecha",
      premarco: false,
      contramarco: false,
      extras: {},
    },

    // Caso 2
    {
      linea: "modena",
      configuracion: "simple",
      modelo: "modelo 3",
      ancho: 90,
      alto: 200,
      color: "negro",
      tipoVidrio: "dvh",
      mano: "derecha",
      premarco: true,
      contramarco: false,
      extras: {},
    },

    // Caso 3
    {
      linea: "modena",
      configuracion: "simple",
      modelo: "modelo 8",
      ancho: 90,
      alto: 205,
      color: "bronce_colonial",
      tipoVidrio: "4+4",
      mano: "izquierda",
      premarco: true,
      contramarco: true,
      extras: {
        picaporte: true,
      },
    },

    // Caso 4
    {
      linea: "modena",
      configuracion: "simple",
      modelo: "modelo 11",
      ancho: 90,
      alto: 210,
      color: "simil_madera",
      tipoVidrio: "dvh_5_9_5",
      mano: "derecha",
      premarco: true,
      contramarco: true,
      extras: {
        barralCurvo: 1,
        mediaManija: true,
        barraAntipanico: 1,
      },
    },
  ];

  for (const perfil of perfiles) {
    for (const configuracion of casosBase) {
      try {
        const resultado = calcularPuertaModena({
          ...configuracion,
          perfil,
        });

        casos.push({
          id: `PM-${perfil.toUpperCase()}-${casos.length + 1}`,
          modulo: "Puertas Modena",
          linea: "Modena",
          perfil,
          configuracion,
          resultado,
        });
      } catch (err) {
        console.log("Puertas Modena:", err.message);
      }
    }
  }
}

async function generarPuertasEco() {
  console.log("Generando Puertas Eco...");

  const perfiles = config.perfiles;

  const casosBase = [
    // Caso 1
    {
      linea: "eco",
      configuracion: "simple",
      modelo: "modelo 1 vr",
      ancho: 80,
      alto: 200,
      color: "blanco",
      tipoVidrio: "4mm",
      mano: "derecha",
      extras: {},
    },

    // Caso 2
    {
      linea: "eco",
      configuracion: "simple",
      modelo: "modelo 2",
      ancho: 90,
      alto: 200,
      color: "negro",
      tipoVidrio: "4mm",
      mano: "derecha",
      extras: {
        barralRecto: 1,
        mediaManija: true,
      },
    },

    // Caso 3
    {
      linea: "eco",
      configuracion: "simple",
      modelo: "modelo 3",
      ancho: 90,
      alto: 205,
      color: "bronce_colonial",
      tipoVidrio: "fantasia",
      mano: "izquierda",
      extras: {
        picaporte: true,
      },
    },

    // Caso 4
    {
      linea: "eco",
      configuracion: "simple",
      modelo: "modelo 4 vr",
      ancho: 90,
      alto: 210,
      color: "simil_madera",
      tipoVidrio: "3mm",
      mano: "derecha",
      extras: {
        barralCurvo: 1,
        mediaManija: true,
        barraAntipanico: 1,
      },
    },
  ];

  for (const perfil of perfiles) {
    for (const configuracion of casosBase) {
      try {
        const resultado = calcularPuertaEco({
          ...configuracion,
          perfil,
        });

        casos.push({
          id: `PE-${perfil.toUpperCase()}-${casos.length + 1}`,
          modulo: "Puertas Eco",
          linea: "Eco",
          perfil,
          configuracion,
          resultado,
        });
      } catch (err) {
        console.log("Puertas Eco:", err.message);
      }
    }
  }
}
async function generarMosquiterosVentana() {
  console.log("Generando Mosquiteros Ventana...");

  const perfiles = config.perfiles;

  const casosBase = [
    {
      ancho: 100,
      alto: 110,
      color: "blanco",
    },

    {
      ancho: 120,
      alto: 130,
      color: "negro",
    },

    {
      ancho: 150,
      alto: 150,
      color: "blanco",
    },

    {
      ancho: 240,
      alto: 200,
      color: "negro",
    },
  ];

  for (const perfil of perfiles) {
    for (const configuracion of casosBase) {
      try {
        const resultado = calcularMosquiteroVentana({
          ...configuracion,
          perfil,
        });

        casos.push({
          id: `MV-${perfil.toUpperCase()}-${casos.length + 1}`,
          modulo: "Mosquitero Ventana",
          perfil,
          configuracion,
          resultado,
        });
      } catch (err) {
        console.log("Mosquitero Ventana:", err.message);
      }
    }
  }
}

async function generarMosquiterosFijos() {
  console.log("Generando Mosquiteros Fijos...");

  const perfiles = config.perfiles;

  const casosBase = [
    {
      ancho: 60,
      alto: 60,
      color: "blanco",
    },

    {
      ancho: 100,
      alto: 120,
      color: "negro",
    },

    {
      ancho: 150,
      alto: 150,
      color: "bronce_colonial",
    },

    {
      ancho: 240,
      alto: 200,
      color: "simil_madera",
    },
  ];

  for (const perfil of perfiles) {
    for (const configuracion of casosBase) {
      try {
        const resultado = calcularMosquiteroFijo({
          ...configuracion,
          perfil,
        });

        casos.push({
          id: `MF-${perfil.toUpperCase()}-${casos.length + 1}`,
          modulo: "Mosquitero Fijo",
          perfil,
          configuracion,
          resultado,
        });
      } catch (err) {
        console.log("Mosquitero Fijo:", err.message);
      }
    }
  }
}

async function generarPuertasMosquiteras() {
  console.log("Generando Puertas Mosquiteras...");

  const perfiles = config.perfiles;

  const casosBase = [
    {
      ancho: 80,
      alto: 200,
      color: "blanco",
      ladoBisagra: "derecha",
    },

    {
      ancho: 90,
      alto: 200,
      color: "blanco",
      ladoBisagra: "izquierda",
    },

    {
      ancho: 90,
      alto: 205,
      color: "blanco",
      ladoBisagra: "derecha",
    },

    {
      ancho: 100,
      alto: 210,
      color: "blanco",
      ladoBisagra: "izquierda",
    },
  ];

  for (const perfil of perfiles) {
    for (const configuracion of casosBase) {
      try {
        const resultado = calcularPuertaMosquitera({
          ...configuracion,
          perfil,
        });

        casos.push({
          id: `PMO-${perfil.toUpperCase()}-${casos.length + 1}`,
          modulo: "Puerta Mosquitera",
          perfil,
          configuracion,
          resultado,
        });
      } catch (err) {
        console.log("Puerta Mosquitera:", err.message);
      }
    }
  }
}

async function generarRajasHerrero() {
  console.log("Generando Rajas Herrero...");

  const perfiles = config.perfiles;

  const casosBase = [
    // Caso 1
    {
      ancho: 40,
      alto: 40,
      vidrio: "3mm",
      color: "blanco",
      modelo: "raja",
    },

    // Caso 2
    {
      ancho: 60,
      alto: 90,
      vidrio: "4mm",
      color: "negro",
      modelo: "brazo",
      mosquitero: true,
    },

    // Caso 3
    {
      ancho: 80,
      alto: 150,
      vidrio: "3+3",
      color: "bronce_colonial",
      vidrioRepartido: true,
      modelo: "volcable",
    },

    // Caso 4
    {
      ancho: 95,
      alto: 170,
      vidrio: "esmerilado",
      color: "simil_madera",
      mosquitero: true,
    },
  ];

  for (const perfil of perfiles) {
    for (const configuracion of casosBase) {
      try {
        const resultado = calcularRajaHerrero({
          ...configuracion,
          perfil,
        });

        casos.push({
          id: `RH-${perfil.toUpperCase()}-${casos.length + 1}`,
          modulo: "Raja Herrero",
          perfil,
          configuracion,
          resultado,
        });
      } catch (err) {
        console.log("Raja Herrero:", err.message);
      }
    }
  }
}

async function generarRajasModena() {
  console.log("Generando Rajas Modena...");

  const perfiles = config.perfiles;

  const casosBase = [
    // Caso 1
    {
      ancho: 40,
      alto: 40,
      vidrio: "3mm",
      color: "blanco",
      modelo: "raja",
    },

    // Caso 2
    {
      ancho: 60,
      alto: 80,
      vidrio: "dvh",
      color: "negro",
      modelo: "oscilobatiente",
      premarco: true,
      contramarco: true,
    },

    // Caso 3
    {
      ancho: 80,
      alto: 120,
      vidrio: "3+3",
      color: "bronce_colonial",
      modelo: "brazo",
      mosquitero: true,
      vidrioRepartido: true,
    },

    // Caso 4
    {
      ancho: 95,
      alto: 170,
      vidrio: "esmerilado",
      color: "simil_madera",
      modelo: "volcable",
      mosquitero: true,
      premarco: true,
      contramarco: true,
    },
  ];

  for (const perfil of perfiles) {
    for (const configuracion of casosBase) {
      try {
        const resultado = calcularRajaModena({
          ...configuracion,
          perfil,
        });

        casos.push({
          id: `RM-${perfil.toUpperCase()}-${casos.length + 1}`,
          modulo: "Raja Modena",
          perfil,
          configuracion,
          resultado,
        });
      } catch (err) {
        console.log("Raja Modena:", err.message);
      }
    }
  }
}

async function generarPatagonicasHerrero() {
  console.log("Generando Patagónicas Herrero...");

  const perfiles = config.perfiles;

  const casosBase = [
    {
      medidaTotal: "120x120",
      tipo: "1_raja",
      anchoRaja: 40,
      tipoVidrio: "4mm",
      color: "blanco",
    },

    {
      medidaTotal: "150x120",
      tipo: "1_raja",
      anchoRaja: 50,
      tipoVidrio: "3+3",
      color: "negro",
      tipoRaja: "brazo",
    },

    {
      medidaTotal: "200x150",
      tipo: "2_rajas",
      anchoRaja: 50,
      tipoVidrio: "4mm",
      color: "bronce_colonial",
      tipoRaja: "volcable",
      guia: true,
      cortina: "pvc",
    },

    {
      medidaTotal: "200x150",
      tipo: "2_rajas",
      anchoRaja: 50,
      tipoVidrio: "3+3",
      color: "simil_madera",
      guia: true,
      cortina: "aluminio",
      cajonBlock: true,
    },
  ];

  for (const perfil of perfiles) {
    for (const configuracion of casosBase) {
      try {
        const resultado = calcularPatagonicaHerrero({
          ...configuracion,
          perfil,
        });

        casos.push({
          id: `PH-${perfil.toUpperCase()}-${casos.length + 1}`,
          modulo: "Patagónica Herrero",
          perfil,
          configuracion,
          resultado,
        });
      } catch (err) {
        console.log("Patagónica Herrero:", err.message);
      }
    }
  }
}

async function generarPatagonicasModena() {
  console.log("Generando Patagónicas Modena...");

  const perfiles = config.perfiles;

  const casosBase = [
    {
      medida: "120x120",
      cantidadRajas: 1,
      tipoVidrio: "4mm",
      color: "blanco",
    },

    {
      medida: "150x120",
      cantidadRajas: 1,
      tipoVidrio: "dvh",
      color: "negro",
      tipoRaja: "oscilobatiente",
      mosquitero: true,
      herrajesBlancos: true,
    },

    {
      medida: "200x150",
      cantidadRajas: 2,
      tipoVidrio: "3+3",
      color: "bronce_colonial",
      tipoRaja: "brazo",
      premarco: true,
      contramarco: true,
    },

    {
      medida: "200x150",
      cantidadRajas: 2,
      tipoVidrio: "4+4",
      color: "simil_madera",
      tipoRaja: "volcable",
      mosquitero: true,
      guia: true,
      cortina: "aluminio",
      cajonBlock: true,
      premarco: true,
      contramarco: true,
      herrajesBlancos: true,
    },
  ];

  for (const perfil of perfiles) {
    for (const configuracion of casosBase) {
      try {
        const resultado = calcularPatagonicaModena({
          ...configuracion,
          perfil,
        });

        casos.push({
          id: `PM-${perfil.toUpperCase()}-${casos.length + 1}`,
          modulo: "Patagónica Modena",
          perfil,
          configuracion,
          resultado,
        });
      } catch (err) {
        console.log("Patagónica Modena:", err.message);
      }
    }
  }
}

async function generarPostigones() {
  console.log("Generando Postigones...");

  const perfiles = config.perfiles;

  const casosBase = [
    // Básico corredizo
    {
      medida: "120x120",
      tipo: "corredizo",
      color: "blanco",
    },

    // Abrir + marco ancho
    {
      medida: "150x150",
      tipo: "abrir",
      marco: "ancho",
      apertura: "izquierda",
      color: "negro",
    },

    // Extras
    {
      medida: "200x200",
      tipo: "corredizo",
      color: "bronce_colonial",
      extras: {
        microperforado: true,
        herrajeBlanco: true,
      },
    },

    // Altura >200 + color madera + abrir
    {
      ancho: 220,
      alto: 205,
      tipo: "abrir",
      marco: "ancho",
      apertura: "derecha",
      color: "simil_madera",
      extras: {
        microperforado: true,
      },
    },
  ];

  for (const perfil of perfiles) {
    for (const configuracion of casosBase) {
      try {
        const resultado = calcularPostigones({
          ...configuracion,
          perfil,
        });

        casos.push({
          id: `POST-${perfil.toUpperCase()}-${casos.length + 1}`,
          modulo: "Postigones",
          perfil,
          configuracion,
          resultado,
        });
      } catch (err) {
        console.log("Postigones:", err.message);
      }
    }
  }
}

async function generarPortones() {
  console.log("Generando Portones...");

  const perfiles = config.perfiles;

  const casosBase = [
    // Herrero básico
    {
      linea: "herrero",
      sistema: "corredizo",
      modelo: "modelo 1",
      ancho: 240,
      alto: 200,
      hojas: 3,
      color: "blanco",
    },

    // Herrero abrir (doble travesaño + bisagras)
    {
      linea: "herrero",
      sistema: "abrir",
      modelo: "modelo 2",
      ancho: 270,
      alto: 200,
      hojas: 3,
      color: "negro",
      extras: {
        picaporte: true,
      },
    },

    // Corredizo + más de 3 hojas
    {
      linea: "herrero",
      sistema: "corredizo",
      modelo: "modelo 1",
      ancho: 320,
      alto: 200,
      hojas: 4,
      color: "bronce_colonial",
      extras: {
        barralRecto: true,
        mediaManija: true,
      },
    },

    // Plegadizo + herraje especial
    {
      linea: "herrero",
      sistema: "plegadizo",
      modelo: "modelo 1",
      ancho: 400,
      alto: 205,
      hojas: 5,
      color: "simil_madera",
      extras: {
        barralCurvo: true,
      },
    },

    // Modena + premarco/contramarco
    {
      linea: "modena",
      sistema: "corredizo",
      modelo: "modelo 1",
      ancho: 320,
      alto: 200,
      hojas: 4,
      color: "blanco",
      premarco: true,
      contramarco: true,
    },

    // Recargo altura máxima
    {
      linea: "modena",
      sistema: "corredizo",
      modelo: "modelo 2",
      ancho: 320,
      alto: 215,
      hojas: 4,
      color: "negro",
      extras: {
        cartelprohibido: true,
      },
    },
  ];

  for (const perfil of perfiles) {
    for (const configuracion of casosBase) {
      try {
        const resultado = calcularPortones({
          ...configuracion,
          perfil,
        });

        casos.push({
          id: `PORTON-${perfil.toUpperCase()}-${casos.length + 1}`,
          modulo: "Portones",
          perfil,
          configuracion,
          resultado,
        });
      } catch (err) {
        console.log("Portones:", err.message);
      }
    }
  }
}

async function generarMarcos() {
  console.log("Generando Marcos...");

  const perfiles = config.perfiles;

  const casosBase = [
    {
      tipo: "premarco",
      ancho: 120,
      alto: 150,
      linea: "modena",
      color: "blanco",
    },
    {
      tipo: "contramarco",
      ancho: 120,
      alto: 150,
      linea: "modena",
      color: "negro",
    },
  ];

  for (const perfil of perfiles) {
    for (const configuracion of casosBase) {
      try {
        const resultado = calcularSuperficies({
          ...configuracion,
          perfil,
        });

        casos.push({
          id: `MARCOS-${perfil.toUpperCase()}-${casos.length + 1}`,
          modulo: "Marcos",
          perfil,
          configuracion,
          resultado,
        });
      } catch (err) {
        console.log("Marcos:", err.message);
      }
    }
  }
}

async function generarPanosFijos() {
  console.log("Generando Paños Fijos...");

  const perfiles = config.perfiles;

  const casosBase = [
    // Básico
    {
      tipo: "pano_fijo",
      ancho: 120,
      alto: 150,
      linea: "herrero",
      color: "blanco",
      tipoVidrio: "4mm",
    },

    // Color + 3+3
    {
      tipo: "pano_fijo",
      ancho: 150,
      alto: 150,
      linea: "modena",
      color: "negro",
      tipoVidrio: "3+3",
    },

    // DVH
    {
      tipo: "pano_fijo",
      ancho: 200,
      alto: 150,
      linea: "modena",
      color: "simil_madera",
      tipoVidrio: "dvh",
    },

    // Premarco + Contramarco
    {
      tipo: "pano_fijo",
      ancho: 150,
      alto: 150,
      linea: "modena",
      color: "blanco",
      tipoVidrio: "4mm",
      premarco: true,
      contramarco: true,
    },

    // Travesaños
    {
      tipo: "pano_fijo",
      ancho: 200,
      alto: 150,
      linea: "herrero",
      color: "bronce_colonial",
      tipoVidrio: "4mm",
      travesanoVertical: true,
      travesanoHorizontal: true,
    },
  ];

  for (const perfil of perfiles) {
    for (const configuracion of casosBase) {
      try {
        const resultado = calcularSuperficies({
          ...configuracion,
          perfil,
        });

        casos.push({
          id: `PANO-FIJO-${perfil.toUpperCase()}-${casos.length + 1}`,
          modulo: "Paños Fijos",
          perfil,
          configuracion,
          resultado,
        });
      } catch (err) {
        console.log("Paños Fijos:", err.message);
      }
    }
  }
}
