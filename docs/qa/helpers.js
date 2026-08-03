function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(array) {
  return array[randomInt(0, array.length - 1)];
}

function dinero(valor = 0) {
  return "$" + Number(valor).toLocaleString("es-AR");
}

function titulo(texto) {
  return String(texto).toUpperCase();
}

function check(valor) {
  return valor ? "Sí" : "No";
}

module.exports = {
  randomInt,
  randomItem,
  dinero,
  titulo,
  check,
};
