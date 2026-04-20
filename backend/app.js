require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const puppeteer = require("puppeteer");
const calcularPuerta = require("../services/puertas/calcularPuerta");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const generarHTML = require("./services/pdf/generarPDF");

const User = require("./models/User");
const Presupuesto = require("./models/Presupuesto");
const auth = require("./middleware/auth");

// 🔹 NUEVO: importar mosquiteros
const calcularMosquitero = require("../services/mosquiteros/calcularMosquitero");

const app = express();

// 🔧 MIDDLEWARES
app.use(cors());
app.use(express.json());

const path = require("path");

app.use("/img", express.static(path.join(__dirname, "../img")));

app.post("/api/puertas", auth, (req, res) => {
  try {
    const { linea, tipo } = req.body;

    if (!linea) {
      return res.status(400).json({ error: "Falta linea" });
    }

    const resultado = calcularPuerta({
      ...req.body,
      tipo: tipo || "simple",
    });

    res.json(resultado);
  } catch (error) {
    console.log("ERROR PUERTAS:", error.message);

    res.status(500).json({
      error: "Error en cálculo",
      detalle: error.message,
    });
  }
});

// 🔌 CONEXIÓN A MONGO
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("🟢 MongoDB conectado"))
    .catch((err) => console.error("🔴 Error conectando MongoDB:", err));
}

// 🔹 TEST
app.get("/", (req, res) => {
  res.send("Servidor OK");
});

// =========================
// 🔐 AUTH
// =========================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { nombre, password } = req.body;

    const existingUser = await User.findOne({ nombre });

    if (existingUser) {
      return res.status(400).json({ error: "Usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      nombre,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ msg: "Usuario creado" });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(400).json({ error: "Usuario ya existe" });
    }

    res.status(500).json({ error: "Error registrando usuario" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { nombre, password } = req.body;

    const user = await User.findOne({ nombre });

    if (!user) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error en login" });
  }
});

// =========================
// 📦 PRESUPUESTOS
// =========================

// 🔹 NUEVO NUMERO
app.post("/api/presupuestos/nuevo", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);

  user.contadorPresupuestos += 1;
  await user.save();

  res.json({ numero: user.contadorPresupuestos });
});

app.post("/api/presupuestos", auth, async (req, res) => {
  try {
    const User = require("./models/User");
    const Presupuesto = require("./models/Presupuesto");

    const userId = req.user.userId;

    // 🔎 buscar usuario
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    let total = 0;

    const itemsProcesados = req.body.items.map((item) => {
      const cantidad = item.cantidad || 1;

      let precio = item.precio || 0;
      let descripcion = item.descripcion || item.tipo || "Producto";

      // 🚪 PUERTAS
      if (item.tipo === "puerta") {
        const result = calcularPuerta(item);

        precio = result.total;

        descripcion = `Puerta ${item.linea} - ${item.modelo} - ${item.medida}`;
      }

      // 🪟 MOSQUITEROS (si querés mantenerlo consistente)
      if (item.tipo === "mosquitero") {
        const result = calcularMosquitero(item);

        precio = result.total;

        descripcion = `Mosquitero ${item.medida}`;
      }

      const subtotal = precio * cantidad;

      total += subtotal;

      return {
        descripcion,
        cantidad,
        precio,
        subtotal,
      };
    });

    // 🔢 numeración (ACÁ VA)
    user.contadorPresupuestos += 1;
    await user.save();

    // 📄 crear presupuesto
    const presupuesto = new Presupuesto({
      userId,
      numero: user.contadorPresupuestos,
      cliente: req.body.cliente,
      fecha: req.body.fecha,
      items: itemsProcesados,
      total,
    });

    await presupuesto.save();

    res.json(presupuesto);
  } catch (error) {
    console.error("ERROR PRESUPUESTO:", error);
    res.status(500).json({ error: "Error creando presupuesto" });
  }
});
// 🔹 LISTAR
app.get("/api/presupuestos", auth, async (req, res) => {
  const presupuestos = await Presupuesto.find({
    userId: req.user.userId,
  }).populate("userId", "nombre");

  const resultado = presupuestos.map((p) => ({
    id: p._id,
    numero: p.numero,
    cliente: p.cliente,
    usuario: p.userId.nombre,
    total: p.total,
    fecha: p.fecha,
  }));

  res.json(resultado);
});

// 🔹 PDF (con seguridad)
// 🔹 PDF (con seguridad)
app.get("/api/presupuestos/:id/pdf", auth, async (req, res) => {
  try {
    const presupuesto = await Presupuesto.findById(req.params.id);

    if (!presupuesto) {
      return res.status(404).json({ error: "No encontrado" });
    }

    if (presupuesto.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: "No autorizado" });
    }

    // 👉 Generar HTML
    const html = generarHTML(presupuesto);

    // 👉 Puppeteer
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    // 👉 Respuesta PDF
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=presupuesto.pdf",
    });

    res.send(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generando PDF" });
  }
});
// =========================
const format = (n) => new Intl.NumberFormat("es-AR").format(n);

module.exports = app;
