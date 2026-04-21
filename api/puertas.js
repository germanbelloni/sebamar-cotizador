const calcularPuerta = require("../services/puertas/calcularPuerta");

function apiPuertas(req, res) {
  try {
    const resultado = calcularPuerta(req.body);

    res.json(resultado);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

module.exports = apiPuertas;
