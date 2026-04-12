const Ventanas = {

  calcular() {

    const producto = document.getElementById("producto").value;

    const body = {
      medida: medidaSeleccionada,
      color: colorSeleccionado,
      incluirGuia: document.getElementById("guia").checked,
      incluirMosquitero: document.getElementById("mosq").checked,
      tipoVidrio: document.getElementById("vidrio").value
    };

    const endpoint = producto === "modena"
      ? "ventanas_modena"
      : "ventanas_herrero";

    Api.post(endpoint, body)
      .then(res => {
        UI.renderResultado(res, { tipo: "ventana" });
      });

  }

};