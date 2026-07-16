const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcularPuerta = require(fromRoot("wrappers/puertas/calcularPuerta"));

const calcularPuertaEco = require(
  fromRoot("wrappers/puertas/calcularPuertaEco"),
);

const calcularPorton = require(fromRoot("wrappers/portones/calcularporton"));
// ======================================================
// OUTPUT
// ======================================================

const carpeta = path.join(__dirname, "output");

if (!fs.existsSync(carpeta)) {
  fs.mkdirSync(carpeta);
}

const archivo = path.join(carpeta, "qa_puertas.csv");

try {
  fs.unlinkSync(archivo);
} catch {}

fs.writeFileSync(
  archivo,
  "\uFEFFmodulo;perfil;linea;configuracion;medida;color;descripcion;costo;proveedor;precio;ganancia\n",
);

// ======================================================
// DATOS
// ======================================================

const perfiles = ["amarilla", "azul", "verde", "papu"];

const colores = ["blanco", "negro", "bronce colonial", "simil madera"];

// ======================================================
// HELPERS
// ======================================================

function guardar(linea) {
  fs.appendFileSync(archivo, `${linea}\n`);
}

function agregarResultado(
  modulo,
  perfil,
  linea,
  configuracion,
  medida,
  color,
  descripcion,
  r,
) {
  guardar(
    [
      modulo,
      perfil,
      linea,
      configuracion,
      medida,
      color,
      descripcion,
      Math.round(r.costo || 0),
      Math.round(r.precioProveedor || 0),
      Math.round(r.precioFinal || 0),
      Math.round(r.ganancia || 0),
    ].join(";"),
  );
}

function descripcionPuerta(modelo, tipoVidrio, extras, premarco, contramarco) {
  const partes = [modelo];

  if (tipoVidrio) {
    partes.push(tipoVidrio);
  }

  if (extras.barralRecto) {
    partes.push("Barral recto");
  }

  if (extras.barralCurvo) {
    partes.push("Barral curvo");
  }

  if (extras.picaporte) {
    partes.push("Picaporte");
  }

  if (extras.mediaManija) {
    partes.push("Media manija");
  }

  if (premarco) {
    partes.push("Premarco");
  }

  if (contramarco) {
    partes.push("Contramarco");
  }

  if (partes.length === 1) {
    partes.push("Sin extras");
  }

  return partes.join(" | ");
}

// ======================================================
// SIMPLE
// ======================================================

const simples = [
  {
    ancho: 80,
    alto: 200,
  },
];

// const modelosSimples = ["modelo_4", "modelo_5", "modelo_panel"];
const modelosSimples = ["modelo_4"];

// ======================================================
// SIMPLE HERRERO / MODENA
// ======================================================

for (const perfil of perfiles) {
  for (const color of colores) {
    for (const medida of simples) {
      for (const modelo of modelosSimples) {
        for (const linea of ["herrero", "modena"]) {
          try {
            const extras = {
              barralRecto: 0,
              barralCurvo: 0,
              picaporte: false,
              mediaManija: false,
            };

            if (modelo === "modelo_panel") {
              extras.barralRecto = 1;
            }

            const llevaVidrio =
              modelo !== "modelo_5" && modelo !== "modelo_panel";

            const r = calcularPuerta({
              ancho: medida.ancho,
              alto: medida.alto,

              linea,
              configuracion: "simple",

              modelo,
              color,
              perfil,

              tipoVidrio: llevaVidrio ? "3mm" : undefined,

              extras,

              premarco: false,
              contramarco: false,
            });

            agregarResultado(
              "PUERTA",
              perfil,
              linea,
              "simple",
              `${medida.ancho}x${medida.alto}`,
              color,
              descripcionPuerta(
                modelo,
                llevaVidrio ? "3mm" : null,
                extras,
                false,
                false,
              ),
              r,
            );
          } catch (e) {
            guardar(
              [
                "ERROR",
                perfil,
                linea,
                "simple",
                `${medida.ancho}x${medida.alto}`,
                color,
                e.message,
              ].join(";"),
            );
          }
        }
      }
    }
  }
}

//======================================================
//ECO
//======================================================

for (const perfil of perfiles) {
  for (const color of colores) {
    try {
      const r = calcularPuertaEco({
        ancho: 80,
        alto: 200,

        configuracion: "simple",

        modelo: descripcionPuerta(
          "modelo_4",
          "3mm",
          {
            barralRecto: 0,
            barralCurvo: 0,
            picaporte: false,
            mediaManija: false,
          },
          false,
          false,
        ),

        color,
        perfil,

        extras: {
          barralRecto: 0,
          barralCurvo: 0,
          picaporte: false,
        },
      });

      agregarResultado(
        "PUERTA",
        perfil,
        "eco",
        "simple",
        "80x200",
        color,
        "modelo_4",
        r,
      );
    } catch (e) {
      guardar(
        ["ERROR", perfil, "eco", "simple", "80x200", color, e.message].join(
          ";",
        ),
      );
    }
  }
}

// ======================================================
// PORTON
// ======================================================

for (const perfil of perfiles) {
  for (const color of colores) {
    for (const linea of ["herrero", "modena"]) {
      try {
        const r = calcularPorton({
          ancho: 240,
          alto: 200,

          linea,

          sistema: "abrir",
          hojas: 3,

          modelo: descripcionPuerta(
            "modelo_5",
            null,
            {
              barralRecto: 0,
              barralCurvo: 0,
              picaporte: false,
              mediaManija: false,
            },
            false,
            false,
          ),

          color,
          perfil,

          extras: {
            barralRecto: 0,
            barralCurvo: 0,
            picaporte: false,
            mediaManija: false,
          },

          premarco: false,
          contramarco: false,
        });

        agregarResultado(
          "PORTON",
          perfil,
          linea,
          "porton",
          "240x200",
          color,
          "modelo_5",
          r,
        );
      } catch (e) {
        guardar(
          ["ERROR", perfil, linea, "porton", "240x200", color, e.message].join(
            ";",
          ),
        );
      }
    }
  }
}

console.log("");
console.log("✅ QA Puertas generado:");
console.log(archivo);
console.timeEnd?.("QA Puertas");
