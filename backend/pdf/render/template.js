function wrapDocument(body) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>

<style>

${require("./styles")}

</style>

</head>

<body>

${body}

</body>

</html>
`;
}

module.exports = wrapDocument;
