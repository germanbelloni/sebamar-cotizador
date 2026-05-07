// js/modules/ui.js

window.UI = {
  renderResultado(res) {
    const container = document.getElementById("resultado");

    if (!res) {
      container.innerHTML = "<p>Error en cálculo</p>";
      return;
    }

    // 🔥 total seguro
    const total = res.total || 0;

    // 🔥 datos actuales del formulario
    const modelo = window.modeloSeleccionado || "";
    const medidaTexto =
      document.getElementById("medidaPuerta")?.selectedOptions?.[0]?.text || "";
    const vidrio = document.getElementById("vidrio")?.value || "";
    const producto = document.getElementById("producto")?.value || "";

    container.innerHTML = `
      <div class="bg-white border rounded-xl shadow p-4 space-y-3">

        <div class="text-sm text-gray-500">
          Resultado del cálculo
        </div>

        <div class="flex justify-between text-sm">
          <span>Producto</span>
          <span class="font-medium">${producto}</span>
        </div>

        <div class="flex justify-between text-sm">
          <span>Modelo</span>
          <span class="font-medium">${modelo}</span>
        </div>

        <div class="flex justify-between text-sm">
          <span>Medida</span>
          <span class="font-medium">${medidaTexto}</span>
        </div>

        <div class="flex justify-between text-sm">
          <span>Vidrio</span>
          <span class="font-medium">${vidrio}</span>
        </div>

        <div class="border-t pt-2 flex justify-between font-bold text-green-700 text-lg">
          <span>TOTAL</span>
          <span>$${total}</span>
        </div>

      </div>
    `;
  },
};
