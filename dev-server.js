const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const apiHandler = require("./api/calcular/index");

// 🔹 API (compatible Express 5)
app.all(/^\/api\/.*$/, async (req, res) => {
  try {
    await apiHandler(req, res);
  } catch (err) {
    console.error("ERROR API:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

// 🔹 fallback (SPA)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Dev server corriendo en http://localhost:${PORT}`);
});