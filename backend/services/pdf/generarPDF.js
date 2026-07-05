// LEGACY
// Se eliminará cuando PrintableBudgetDocument genere el PDF mediante ReactDOMServer.
const fs = require("fs");
const path = require("path");

const format = (n) => new Intl.NumberFormat("es-AR").format(n);

// 🔧 OPCIONAL → logo en base64 (RECOMENDADO)
let logoBase64 = "";
try {
  const logoPath = path.join(__dirname, "../../public/img/logosebamar.png");
  if (fs.existsSync(logoPath)) {
    const file = fs.readFileSync(logoPath);
    logoBase64 = `data:image/png;base64,${file.toString("base64")}`;
  }
  console.log("LOGO PATH:", logoPath);

  console.log("EXISTE:", fs.existsSync(logoPath));
} catch (e) {
  console.log("⚠ No se pudo cargar logo base64");
}

function generarHTML(presupuesto, user) {
  const numero = presupuesto._id?.toString().slice(-6) || "000000";

  const filas = (presupuesto.items || [])
    .map((item) => {
      const descripcion = item.descripcion || "Producto";
      const cantidad = item.cantidad || 1;
      const precio = item.precio || 0;
      const subtotal = item.subtotal || precio * cantidad;

      return `
        <tr>
          <td>${cantidad}</td>
          <td></td>
          <td class="text-left">${descripcion}</td>
          <td class="text-right">$${format(precio)}</td>
          <td class="text-right">$${format(subtotal)}</td>
        </tr>
      `;
    })
    .join("");

  return `
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          border: 10px solid #facc15;
          max-width: 800px;
          margin: auto;
          font-size: 14px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .titulo {
          background: #facc15;
          padding: 10px 20px;
          font-weight: bold;
          font-size: 18px;
        }

        .empresa {
          margin-top: 10px;
          font-size: 12px;
        }

        .info {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 25px;
        }

        th, td {
          border: 1px solid #000;
          padding: 6px;
        }

        th {
          background: #eee;
        }

        .text-right {
          text-align: right;
        }

        .text-left {
          text-align: left;
        }

        .total {
          margin-top: 30px;
          text-align: right;
          font-size: 18px;
          font-weight: bold;
          background: #facc15;
padding: 14px 18px;
border-radius: 12px;
display: inline-block;
float: right;
        }

        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
        }

        .logo {
          height: 60px;
        }
      </style>
    </head>

    <body>

      <!-- HEADER -->
      <div class="header">
        ${
          logoBase64
            ? `<img src="${logoBase64}" class="logo" />`
            : `<div><b>SEBAMAR</b></div>`
        }

        <div class="titulo">PRESUPUESTO</div>
      </div>

      <!-- EMPRESA -->
      <div class="empresa">
  <b>${user?.empresa || "SEBAMAR ABERTURAS"}</b><br/>
  Av. Venezuela 100<br/>
  2314-483072
</div>
        Av. Venezuela 100<br/>
        2314-483072
      </div>

      <!-- INFO -->
      <div class="info">
        <div>
  <b>Cliente:</b><br/>
  ${presupuesto.cliente || "-"}<br/>

  ${presupuesto.telefono ? `<b>Tel:</b> ${presupuesto.telefono}<br/>` : ""}

  ${presupuesto.direccion ? `<b>Dirección:</b> ${presupuesto.direccion}` : ""}
</div>

        <div class="text-right">
          <div><b>Fecha:</b> ${
            presupuesto.createdAt
              ? new Date(presupuesto.createdAt).toLocaleDateString()
              : new Date().toLocaleDateString()
          }</div>
          <div><b>Presupuesto N°:</b> ${numero}</div>
        </div>
      </div>

      <!-- TABLA -->
      <table>
        <thead>
          <tr>
            <th>Cant.</th>
            <th>Código</th>
            <th class="text-left">Descripción</th>
            <th class="text-right">Precio unitario</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${filas}
        </tbody>
      </table>

      <!-- TOTAL -->
      <div class="total">
        Total: $${format(presupuesto.total || 0)}
      </div>

      ${
        presupuesto.observaciones || presupuesto.validez
          ? `
      <div style="margin-top: 40px;">
        ${
          presupuesto.observaciones
            ? `
              <div style="margin-bottom: 10px;">
                <b>Observaciones:</b><br/>
                ${presupuesto.observaciones}
              </div>
            `
            : ""
        }

        ${
          presupuesto.validez
            ? `
              <div>
                <b>Validez:</b> ${presupuesto.validez}
              </div>
            `
            : ""
        }
      </div>
    `
          : ""
      }

      <!-- FOOTER -->
      <div class="footer">
        Visitá nuestra página web: www.sebamaraberturas.wordpress.com<br/>
        WhatsApp: 2314 483072
      </div>

    </body>
  </html>
  `;
}

module.exports = generarHTML;
