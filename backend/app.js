require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Presupuesto = require("./models/Presupuesto");
const auth = require("./middleware/auth");

const app = express();

// 🔧 MIDDLEWARES
app.use(cors());
app.use(express.json());

// 🔌 CONEXIÓN A MONGO
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("🟢 MongoDB conectado"))
    .catch((err) => console.error("🔴 Error conectando MongoDB:", err));
}
// 🔹 TEST ENDPOINT
app.get("/", (req, res) => {
  res.send("Servidor OK");
});

// =========================
// 🔐 AUTH
// =========================
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

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

    console.error(error);
    res.status(500).json({ error: "Error registrando usuario" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    console.log("JWT_SECRET LOGIN:", process.env.JWT_SECRET); // 👈 ACÁ

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
    console.error("ERROR LOGIN:", error);
    res.status(500).json({ error: "Error en login" });
  }
});

// =========================
// 📦 PRESUPUESTOS
// =========================

// NUEVO NUMERO
app.post("/api/presupuestos/nuevo", auth, async (req, res) => {
  const userId = req.user.userId;

  const user = await User.findById(userId);

  user.contadorPresupuestos += 1;
  await user.save();

  res.json({ numero: user.contadorPresupuestos });
});

// CREAR
app.post("/api/presupuestos", auth, async (req, res) => {
  const userId = req.user.userId;
  if (!req.body.cliente || !req.body.items || req.body.items.length === 0) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  if (req.body.total < 0) {
    return res.status(400).json({ error: "Total inválido" });
  }

  const user = await User.findById(userId);

  const presupuesto = new Presupuesto({
    userId,
    numero: user.contadorPresupuestos,
    cliente: req.body.cliente,
    fecha: req.body.fecha,
    items: req.body.items,
    total: req.body.total,
  });

  await presupuesto.save();

  res.json(presupuesto);
});

// LISTAR
app.get("/api/presupuestos", auth, async (req, res) => {
  const userId = req.user.userId;

  const presupuestos = await Presupuesto.find({ userId }).populate(
    "userId",
    "nombre",
  );

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

app.get("/api/presupuestos/:id/pdf", auth, async (req, res) => {
  try {
    const presupuesto = await Presupuesto.findById(req.params.id);

    if (!presupuesto) {
      return res.status(404).json({ error: "No encontrado" });
    }

    // 🔴 VALIDACIÓN CLAVE
    if (presupuesto.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: "No autorizado" });
    }

    // Por ahora devolvemos JSON (después PDF real)
    res.json({ msg: "PDF generado", presupuesto });
  } catch (error) {
    res.status(500).json({ error: "Error generando PDF" });
  }
});

app.get("/api/presupuestos/:id", auth, async (req, res) => {
  try {
    const presupuesto = await Presupuesto.findById(req.params.id);

    if (!presupuesto) {
      return res.status(404).json({ error: "No encontrado" });
    }

    if (presupuesto.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: "No autorizado" });
    }

    res.json({
      id: presupuesto._id,
      cliente: presupuesto.cliente,
      numero: presupuesto.numero,
      fecha: presupuesto.fecha,
      items: presupuesto.items,
      total: presupuesto.total,
    });
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

// =========================

module.exports = app;
