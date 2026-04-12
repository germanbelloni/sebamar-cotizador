const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// 🔹 TEST
app.get("/", (req, res) => {
  res.send("Servidor OK");
});

// 🔹 MEDIDAS
app.get("/api/medidas", (req, res) => {
  try {
    const producto = req.query.producto;

    const filePath = path.join(
      process.cwd(),
      "data/productos",
      `${producto}.json`,
    );

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    res.json(Object.keys(data.medidas || {}));
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

// 🔹 COLORES
app.get("/api/colores", (req, res) => {
  const colores = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/colores.json"), "utf-8"),
  );
  res.json(colores);
});

// 🔥 NUEVAS RUTAS (LO IMPORTANTE)
app.use("/api/ventanas", require("../api/ventanas"));
app.use("/api/puertas", require("../api/puertas"));
app.use("/api/rajas", require("../api/rajas"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🔥 Server corriendo en puerto " + PORT);
});
