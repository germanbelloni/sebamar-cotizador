const calcularPanoFijo = require("../services/superficies/calcularPanoFijo");

describe("PANO FIJO", () => {
  it("calcula correctamente blanco 100x100 3mm", () => {
    const res = calcularPanoFijo({
      ancho: 100,
      alto: 100,
      linea: "herrero",
      color: "blanco",
      tipoVidrio: "3mm",
      perfil: "amarilla",
    });

    expect(res.total).toBeGreaterThan(0);
  });

  it("negro debe ser más caro que blanco", () => {
    const blanco = calcularPanoFijo({
      ancho: 100,
      alto: 100,
      linea: "herrero",
      color: "blanco",
      tipoVidrio: "3mm",
      perfil: "amarilla",
    });

    const negro = calcularPanoFijo({
      ancho: 100,
      alto: 100,
      linea: "herrero",
      color: "negro",
      tipoVidrio: "3mm",
      perfil: "amarilla",
    });

    expect(negro.total).toBeGreaterThan(blanco.total);
  });
});