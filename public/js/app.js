function calcularFull() {

  if (modoActual === "puertas") {
    Puertas.calcular();
  } else {
    Ventanas.calcular();
  }

}