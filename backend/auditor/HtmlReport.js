function color(estado) {
  switch (estado) {
    case "ok":
      return "#d4edda";

    case "warning":
      return "#fff3cd";

    case "error":
      return "#f8d7da";

    default:
      return "#ffffff";
  }
}

function crearFila(test) {
  return `
<tr style="background:${color(test.estado)}">
    <td>${test.estado.toUpperCase()}</td>
    <td>${test.nombre}</td>
    <td>${test.esperado ?? ""}</td>
    <td>${test.obtenido ?? ""}</td>
    <td>${test.diferencia ?? ""}</td>
    <td>${test.detalle ?? ""}</td>
</tr>
`;
}

function generarHtml(resumen) {
  return `
<!DOCTYPE html>

<html>

<head>

<meta charset="utf-8"/>

<title>Auditoría</title>

<style>

body{
    font-family:Arial;
    padding:30px;
}

table{
    border-collapse:collapse;
    width:100%;
}

th,td{
    border:1px solid #ddd;
    padding:8px;
}

th{
    background:#222;
    color:white;
}

</style>

</head>

<body>

<h1>${resumen.nombre}</h1>

<p>

<b>Total:</b> ${resumen.total}

<br>

<b>OK:</b> ${resumen.ok}

<br>

<b>Warnings:</b> ${resumen.warning}

<br>

<b>Errores:</b> ${resumen.error}

<br>

<b>Resultado:</b> ${resumen.porcentaje}%

</p>

<table>

<thead>

<tr>

<th>Estado</th>

<th>Test</th>

<th>Esperado</th>

<th>Obtenido</th>

<th>Diferencia</th>

<th>Detalle</th>

</tr>

</thead>

<tbody>

${resumen.tests.map(crearFila).join("")}

</tbody>

</table>

</body>

</html>
`;
}

module.exports = generarHtml;
