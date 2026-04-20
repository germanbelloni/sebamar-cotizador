const format = (n) => new Intl.NumberFormat("es-AR").format(n);

function generarHTML(presupuesto) {
  // 📍 1. NUMERO DE PRESUPUESTO (ARRIBA DE TODO)
  const numero = presupuesto._id.toString().slice(-6);

  // 📍 2. FILAS (TABLA)
  const filas = presupuesto.items
    .map((item) => {
      const descripcion = item.descripcion || "Producto";
      const cantidad = item.cantidad || 1;
      const precio = item.precio || 0;
      const subtotal = item.subtotal || precio * cantidad;

      return `
        <tr class="border-b">
          <td class="p-2 text-center">${cantidad}</td>
          <td class="p-2 text-center"></td>
          <td class="p-2 text-left">${descripcion}</td>
          <td class="p-2 text-right">$${format(precio)}</td>
          <td class="p-2 text-right">$${format(subtotal)}</td>
        </tr>
      `;
    })
    .join("");

  return `
  <html>
    <head>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>

    <!-- 📍 3. BODY (CENTRADO + RELATIVE PARA FOOTER) -->
    <body class="relative p-10 border-[15px] border-yellow-400 font-sans max-w-4xl mx-auto">

      <!-- HEADER -->
      <div class="flex justify-between items-center">

        <!-- 📍 4. LOGO -->
        <img src="http://localhost:3000/img/logosebamar.png" class="h-16" />

        <div class="bg-yellow-400 px-6 py-3 text-xl font-bold">
          PRESUPUESTO
        </div>
      </div>

      <!-- EMPRESA -->
      <div class="mt-3 text-xs">
        SEBAMAR ABERTURAS<br/>
        Av. Venezuela 100<br/>
        2314-483072<br/>
        <div class="flex gap-3 items-center mt-2">
  <img src="http://localhost:3000/img/facebook.png" class="h-4" />
  <span>Sebamar aberturas</span>
</div>

<div class="flex gap-3 items-center mt-2">
  <img src="http://localhost:3000/img/instagram.png" class="h-4" />
  <span>Sebamaraberturasok</span>
</div>
      </div>

      <!-- INFO -->
      <div class="mt-6 flex justify-between text-sm">

        <div>
          <div class="font-bold">Facturar a:</div>
          <div>${presupuesto.cliente || "-"}</div>
        </div>

        <!-- 📍 5. NUMERO USADO ACÁ -->
        <div class="text-right">
          <div><span class="font-bold">Fecha:</span> ${new Date(presupuesto.createdAt).toLocaleDateString()}</div>
          <div><span class="font-bold">Presupuesto N°:</span> ${numero}</div>
        </div>
      </div>

      <!-- TABLA -->
      <table class="w-full mt-8 border-2 border-black text-sm">
        <thead class="bg-gray-200">
          <tr>
            <th class="border p-2">Cant.</th>
            <th class="border p-2">Código</th>
            <th class="border p-2 text-left">Descripción</th>
            <th class="border p-2 text-right">Precio unitario</th>
            <th class="border p-2 text-right">Total</th>
          </tr>
        </thead>

        <tbody>
          ${filas}
        </tbody>
      </table>

      <!-- TOTALES -->
      <div class="absolute bottom-16 right-10 text-xl font-bold">
        <div>Total: $${format(presupuesto.total)}</div>
      </div>

      <!-- 📍 6. FOOTER ABAJO -->
      <div class="absolute bottom-6 left-0 w-full text-center text-xs">
        Visitá nuestra página web: www.sebamaraberturas.wordpress.com<br/>
        Por consultas comunicarse al whatsapp 2314 483072
      </div>

    </body>
  </html>
  `;
}

module.exports = generarHTML;
