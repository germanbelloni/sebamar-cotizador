const { renderBudget } = require("../pdf/render/renderBudget");

async function preview(req, res) {
  try {
    console.log("========== PDF V2 ==========");
    console.log(JSON.stringify(req.body, null, 2));

    const html = await renderBudget(req.body);

    res.setHeader("Content-Type", "text/html; charset=utf-8");

    return res.send(`
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Preview</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>

        <body class="bg-zinc-200 p-10">
          ${html}
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
}

module.exports = {
  preview,
};
