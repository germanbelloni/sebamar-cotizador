require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const puppeteer = require("puppeteer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

const calcularPuerta = require("../services/puertas/calcularPuerta");
const calcularMosquitero = require("../services/mosquiteros/calcularMosquitero");

const generarHTML = require("./services/pdf/generarPDF");

const User = require("./models/User");
const Presupuesto = require("./models/Presupuesto");
const auth = require("./middleware/auth");

const app = express();

// 🔧 MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use("/img", express.static(path.join(__dirname, "../img")));

// =========================
// 🚪 PUERTAS
// =========================
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

// =========================
// 🔌 MONGO
// =========================
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("🟢 MongoDB conectado"))
    .catch((err) => console.error("🔴 Error conectando MongoDB:", err));
}

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

    const token = jwt.sign(
      { id: user._id }, // ✅ UNIFICADO
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

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
  const user = await User.findById(req.user.id); // ✅ FIX

  user.contadorPresupuestos += 1;
  await user.save();

  res.json({ numero: user.contadorPresupuestos });
});

// 🔹 CREAR
app.post("/api/presupuestos", auth, async (req, res) => {
  try {
    const userId = req.user.id; // ✅ FIX

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    let total = 0;

    const itemsProcesados = req.body.items.map((item) => {
      const cantidad = item.cantidad || 1;

      let precio = item.precio || 0;
      let descripcion = item.descripcion || item.tipo || "Producto";

      if (item.tipo === "puerta") {
        const result = calcularPuerta(item);
        precio = result.total;
        descripcion = `Puerta ${item.linea} - ${item.modelo} - ${item.medida}`;
      }

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

    user.contadorPresupuestos += 1;
    await user.save();

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
    userId: req.user.id, // ✅ FIX
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

// 🔹 PDF
app.get("/api/presupuestos/:id/pdf", auth, async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const presupuesto = await Presupuesto.findById(req.params.id);

    if (!presupuesto) {
      return res.status(404).json({ error: "No encontrado" });
    }

    // 🔐 SEGURIDAD
    if (presupuesto.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "No autorizado" });
    }

    const html = generarHTML(presupuesto);

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

module.exports = app;
