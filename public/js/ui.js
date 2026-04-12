const UI = {

  renderResultado(res, data) {

    const container = document.getElementById("resultado");

    container.innerHTML = `
      <div class="bg-white border rounded-xl shadow p-4 space-y-2">

        <div class="text-sm text-gray-500">Presupuesto</div>

        <div class="flex justify-between">
          <span>${data.tipo} ${data.ancho}x200</span>
          <span>$${res.total || 0}</span>
        </div>

        <div class="border-t pt-2 flex justify-between font-bold text-green-700">
          <span>TOTAL</span>
          <span>$${res.total || 0}</span>
        </div>

      </div>
    `;
  }

};