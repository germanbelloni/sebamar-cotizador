const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const Presupuesto = require("./models/Presupuesto");
const auth = require("./middleware/auth");
const app = express();

const puppeteer = require("puppeteer");
app.use(cors());
app.use(express.json());

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🟢 MongoDB conectado");
  })
  .catch((err) => {
    console.error("🔴 Error conectando MongoDB:", err);
  });

// 📌 MODELOS
const User = require("./models/User");

// 🔹 TEST
app.get("/", (req, res) => {
  res.send("Servidor OK");
});

app.post("/api/usuarios", async (req, res) => {
  try {
    const { nombre } = req.body;

    const nuevoUsuario = new User({
      nombre,
      contadorPresupuestos: 0,
    });

    await nuevoUsuario.save();

    res.json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando usuario" });
  }
});

// 🔥 NUEVO ENDPOINT (CLAVE)
app.post("/api/presupuestos/nuevo", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const usuario = await User.findById(userId);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    usuario.contadorPresupuestos += 1;
    await usuario.save();

    res.json({
      numeroPresupuesto: usuario.contadorPresupuestos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

app.get("/api/presupuestos/:id/pdf", auth, async (req, res) => {
  try {
    const presupuesto = await Presupuesto.findById(req.params.id);

    if (!presupuesto) {
      return res.status(404).send("Presupuesto no encontrado");
    }

    if (presupuesto.userId.toString() !== req.user.userId) {
      return res.status(403).send("No autorizado");
    }
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 8px; }
          </style>
        </head>
        <body>
          <h1>Presupuesto Nº ${presupuesto.numero}</h1>

          <p><strong>Cliente:</strong> ${presupuesto.cliente}</p>
          <p><strong>Fecha:</strong> ${presupuesto.fecha}</p>

          <table>
            <tr>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio</th>
            </tr>
            ${presupuesto.items
              .map(
                (item) => `
              <tr>
                <td>${item.descripcion}</td>
                <td>${item.cantidad}</td>
                <td>$${item.precio}</td>
              </tr>
            `,
              )
              .join("")}
          </table>

          <h2>Total: $${presupuesto.total}</h2>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      headless: true,
    });
    const page = await browser.newPage();

    await page.setContent(html);

    const pdf = await page.pdf({ format: "A4" });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=presupuesto-${presupuesto.numero}.pdf`,
    });

    res.send(pdf);
  } catch (error) {
    console.error("ERROR REAL PDF:", error);
    res.status(500).send("Error generando PDF");
  }
});

app.post("/api/presupuestos", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { cliente, fecha, items, total } = req.body;

    const usuario = await User.findById(userId);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const nuevoPresupuesto = new Presupuesto({
      userId: usuario._id,
      numero: usuario.contadorPresupuestos,
      cliente,
      fecha,
      items,
      total,
    });

    await nuevoPresupuesto.save();

    res.json({
      mensaje: "Presupuesto guardado",
      presupuesto: nuevoPresupuesto,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

app.get("/api/presupuestos", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const presupuestos = await Presupuesto.find({ userId }).populate(
      "userId",
      "nombre",
    );

    const resultado = presupuestos.map((p) => ({
      numero: p.numero,
      cliente: p.cliente,
      usuario: p.userId.nombre,
      total: p.total,
      fecha: p.fecha,
    }));

    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo presupuestos" });
  }
});

const bcrypt = require("bcryptjs");

app.post("/api/auth/register", async (req, res) => {
  try {
    const { nombre, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = new User({
      nombre,
      password: hashedPassword,
    });

    await usuario.save();

    res.json({ mensaje: "Usuario creado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error registrando usuario" });
  }
});

const jwt = require("jsonwebtoken");

app.post("/api/auth/login", async (req, res) => {
  try {
    const { nombre, password } = req.body;

    const usuario = await User.findOne({ nombre });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const valid = await bcrypt.compare(password, usuario.password);

    if (!valid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ userId: usuario._id }, "secreto_super", {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error login" });
  }
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

// 🔥 TUS RUTAS EXISTENTES
app.use("/api/ventanas", require("../api/ventanas"));
app.use("/api/puertas", require("../api/puertas"));
app.use("/api/rajas", require("../api/rajas"));
app.use("/api/postigones", require("../api/postigones"));
app.use("/api/patagonicas", require("../api/patagonicas"));
app.use("/api/placas", require("../api/placas"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🔥 Server corriendo en puerto " + PORT);
});
