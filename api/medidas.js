const fs = require("fs");
const path = require("path");

module.exports = function handler(req, res) {
  try {
    const { producto } = req.query;

    const filePath = path.join(
      process.cwd(),
      `data/productos/${producto}.json`
    );

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    return res.status(200).json(Object.keys(data.medidas || {}));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error interno" });
  }
};