const calcularPremarco = require("../services/superficies/calcularPremarco");

describe("PREMARCO", () => {
  it("calcula correctamente un premarco básico", () => {
    const res = calcularPremarco({
      ancho: 100,
      alto: 100,
      perfil: "amarilla",
    });

    expect(res.total).toBeGreaterThan(0);
  });

  it("a mayor tamaño, mayor precio", () => {
    const chico = calcularPremarco({
      ancho: 100,
      alto: 100,
      perfil: "amarilla",
    });

    const grande = calcularPremarco({
      ancho: 200,
      alto: 150,
      perfil: "amarilla",
    });

    expect(grande.total).toBeGreaterThan(chico.total);
  });
});
    

