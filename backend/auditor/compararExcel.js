const compararJson = require("./compararJson");

/*
    El Excel terminará convertido a un objeto
    con el mismo formato que el JSON.
    Por eso reutilizamos exactamente
    el mismo comparador.
*/

module.exports = compararJson;
