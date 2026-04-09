const puertasHerrero = require("./puertas_herrero");
const puertasModena = require("./puertas_modena");
const ventanasHerrero = require("./ventanas_herrero");
const ventanasModena = require("./ventanas_modena");

module.exports = async (req, res) => {
  const { url } = req;

  try {
    if (url.startsWith("/api/puertas_herrero")) {
      return require("./puertas_herrero")(req, res);
    }

    if (url.startsWith("/api/puertas_modena")) {
      return puertasModena(req, res);
    }

    if (url.startsWith("/api/ventanas_herrero")) {
      return ventanasHerrero(req, res);
    }

    if (url.startsWith("/api/ventanas_modena")) {
      return ventanasModena(req, res);
    }

    if (url === "/api/colores") {
      const fs = require("fs");
      const path = require("path");

      const data = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), "data/colores.json"), "utf-8"),
      );

      return res.json(data);
    }

    return res.status(404).json({ error: "Endpoint no encontrado" });
  } catch (err) {
    console.error("ERROR API:", err);
    return res.status(500).json({ error: "Error interno" });
  }
};
