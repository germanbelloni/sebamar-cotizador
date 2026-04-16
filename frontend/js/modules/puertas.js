// js/puertas.js
function formatearTexto(texto) {
  return texto.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

window.Puertas = {
  init() {
    this.cargarModelos();
  },

  cargarModelos() {
    const producto = document.getElementById("producto").value;

    fetch(`/frontend/data/productos/puertas_${producto}.json`)
      .then((res) => res.json())
      .then((data) => {
        window.dataPuertas = data;

        const select = document.getElementById("modeloPuerta");
        select.innerHTML = "";

        Object.keys(data.modelos).forEach((nombre) => {
          const nombreLower = nombre.toLowerCase();

          if (
            nombreLower.includes("adicional") ||
            nombreLower.includes("barral")
          )
            return;

          const option = document.createElement("option");
          option.value = nombre;
          option.textContent = formatearTexto(nombre);

          select.appendChild(option);
        });

        window.modeloSeleccionado = select.value;

        this.cargarVidrios();
      });
  },

  cargarVidrios() {
    if (!window.dataPuertas) return;

    const modelo = window.modeloSeleccionado.trim();
    const producto = document.getElementById("producto").value;
    const select = document.getElementById("vidrio");

    select.innerHTML = "";

    const modeloKey = Object.keys(window.dataPuertas.modelos).find(
      (k) => k.toLowerCase().trim() === modelo,
    );

    const modeloData = window.dataPuertas.modelos[modeloKey];

    if (!modeloData) return;

    Object.keys(modeloData.vidrios).forEach((v) => {
      const valor = modeloData.vidrios[v];

      if (typeof valor !== "number") return;

      const option = document.createElement("option");
      option.value = v;
      option.textContent = v;

      select.appendChild(option);
    });

    if (producto === "modena") {
      const tieneVidrio = Object.values(modeloData.vidrios).some((v) => v > 0);

      if (tieneVidrio) {
        const dvh = document.createElement("option");
        dvh.value = "dvh";
        dvh.textContent = "DVH";
        select.appendChild(dvh);
      }
    }
  },

  cambiarModelo() {
    if (!window.dataPuertas || !window.dataPuertas.modelos) {
      console.warn("⏳ dataPuertas todavía no cargó");
      return;
    }

    const select = document.getElementById("modeloPuerta");
    const modelo = select.value;

    window.modeloSeleccionado = modelo;

    const vidrioSelect = document.getElementById("vidrio");

    const modeloData = window.dataPuertas.modelos[modelo];

    const sinVidrio =
      !modeloData || Object.values(modeloData.vidrios).every((v) => v === 0);

    if (sinVidrio) {
      vidrioSelect.style.display = "none";
    } else {
      vidrioSelect.style.display = "block";
    }

    this.cargarVidrios();
  },

  calcular() {
    const modelo = window.modeloSeleccionado;
    const medida = window.medidaSeleccionada;
    const vidrio = document.getElementById("vidrio").value;

    const modeloData = window.dataPuertas.modelos[modelo];

    if (!modeloData) {
      alert("Modelo inválido");
      return;
    }

    // 🔥 PRECIO BASE (DE TU JSON)
    let precioBase = modeloData.base || 0;

    // 🔥 PRECIO VIDRIO
    let precioVidrio = modeloData.vidrios?.[vidrio] || 0;

    // 🔥 TOTAL
    let total = precioBase + precioVidrio;


    const res = {
      total,
    };

    // 🔥 guardar resultado
    window.ultimoResultado = res;

    // 🔥 render UI
    window.UI.renderResultado(res);
    console.log("MODELO:", modelo);
    console.log("MEDIDA:", medida);
    console.log("DATA MODELO:", modeloData);
    console.log("PRECIOS:", modeloData.precios);
  },
};
