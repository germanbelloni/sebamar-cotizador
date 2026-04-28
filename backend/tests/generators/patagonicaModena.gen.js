const fs = require("fs");
const path = require("path");
const { fromRoot } = require("../../utils/path");

const wrapper = require(
  fromRoot("wrappers/patagonicas/patagonicasModenaWrapper"),
);

const medidas = ["100x60", "150x100", "150x150"];
const rajas = [40, 50, 60];
const cantidades = [1, 2];

const resultados = [];

medidas.forEach((medida) => {
  rajas.forEach((tipoRaja) => {
    cantidades.forEach((cantidadRajas) => {
      try {
        const res = wrapper({
          medida,
          tipoRaja,
          cantidadRajas,
          tipoVidrio: "4mm",
          tipoApertura: "abrir",
          color: "blanco",
          extras: {
            mosquitero: true,
            cajonBlock: false,
            guia: false,
          },
        });

        resultados.push({
          input: { medida, tipoRaja, cantidadRajas },
          output: res,
        });

        console.log("✔", medida, tipoRaja, cantidadRajas, res.total);
      } catch (e) {
        console.log("❌", medida, e.message);
      }
    });
  });
});

fs.writeFileSync(
  path.join(__dirname, "patagonicas_output.json"),
  JSON.stringify(resultados, null, 2),
);
