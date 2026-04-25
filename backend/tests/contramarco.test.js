const calcularContramarco = require("../services/superficies/calcularContramarco");

describe("CONTRAMARCO", () => {
  it("calcula correctamente blanco", () => {
    const res = calcularContramarco({
      ancho: 100,
      alto: 100,
      color: "blanco",
      perfil: "amarilla",
    });

    expect(res.total).toBeGreaterThan(0);
  });

  it("negro debe ser más caro que blanco", () => {
    const blanco = calcularContramarco({
      ancho: 100,
      alto: 100,
      color: "blanco",
      perfil: "amarilla",
    });

    const negro = calcularContramarco({
      ancho: 100,
      alto: 100,
      color: "negro",
      perfil: "amarilla",
    });

    expect(negro.total).toBeGreaterThan(blanco.total);
  });
});

