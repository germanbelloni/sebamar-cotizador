const fs = require("fs");
const path = require("path");

module.exports = function handler(req, res) {
  try {
    const filePath = path.join(
      process.cwd(),
      "data/colores.json"
    );

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error interno" });
  }
};