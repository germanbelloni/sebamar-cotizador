const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcular = require(fromRoot("wrappers/placas/calcularPuertaPlaca"));

const data = require(fromRoot("frontend/data/productos/puertas_placa.json"));

let resultados = [];

Object.keys(data).forEach((tipo) => {
  Object.keys(data[tipo]).forEach((modelo) => {
    Object.keys(data[tipo][modelo]).forEach((medida) => {
      Object.keys(data[tipo][modelo][medida]).forEach((marco) => {
        try {
          const [ancho, alto] = medida.split("x").map(Number);

          const result = calcular({
            ancho,
            alto,
            tipo,
            modelo,
            marco,
          });

          resultados.push({
            input: { tipo, modelo, medida, marco },
            output: result,
          });

          console.log(`✔ ${tipo} ${modelo} ${medida}`);
        } catch (e) {
          console.log(`❌ ${tipo} ${modelo} ${medida}`, e.message);
        }
      });
    });
  });
});

fs.writeFileSync(
  path.join(process.cwd(), "placas_test.json"),
  JSON.stringify(resultados, null, 2),
);
