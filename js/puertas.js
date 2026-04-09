// js/puertas.js

window.Puertas = {
  init() {
    this.cargarModelos();
  },

  cargarModelos() {
    fetch("/data/productos/puertas_herrero.json")
      .then((res) => res.json())
      .then((data) => {
        window.dataPuertas = data;

        const select = document.getElementById("modeloPuerta");
        select.innerHTML = "";

        Object.keys(data.modelos).forEach((nombre) => {
          const nombreLower = nombre.toLowerCase();

          // filtrar basura
          if (
            nombreLower.includes("adicional") ||
            nombreLower.includes("barral")
          )
            return;

          const option = document.createElement("option");

          // ✅ CLAVE REAL
          option.value = nombre;

          // ✅ TEXTO LINDO
          option.textContent = formatearTexto(nombre);

          select.appendChild(option);
        });

        // ✅ guardar selección correcta
        modeloSeleccionado = select.value;

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

    // 🔥 SOLO MODENA
    if (producto === "modena") {
      const dvh = document.createElement("option");
      dvh.value = "dvh";
      dvh.textContent = "DVH";
      select.appendChild(dvh);
    }
  },

  cambiarModelo() {
    const select = document.getElementById("modeloPuerta");
    const modelo = select.value;

    window.modeloSeleccionado = modelo;

    const vidrioSelect = document.getElementById("vidrio");

    // 🔥 ocultar vidrio en modelos sin vidrio
    if (
      modelo.toLowerCase().includes("modelo 5") ||
      modelo.toLowerCase().includes("panel")
    ) {
      vidrioSelect.style.display = "none";
    } else {
      vidrioSelect.style.display = "block";
    }

    this.cargarVidrios();
  },
};
