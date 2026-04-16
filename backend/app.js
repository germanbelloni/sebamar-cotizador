require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Presupuesto = require("./models/Presupuesto");
const auth = require("./middleware/auth");

// 🔹 NUEVO: importar mosquiteros
const calcularMosquitero = require("../services/mosquiteros/calcularMosquitero");

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

// 🔹 CREAR PRESUPUESTO (CON MOSQUITEROS)
app.post("/api/presupuestos", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    let total = 0;
    console.log("ITEMS ENTRADA:", req.body.items);
    const itemsProcesados = req.body.items.map((item) => {
      // 🔹 MOSQUITERO

      if (item.tipo === "mosquitero") {
        const resultado = calcularMosquitero({
          medida: item.medida,
          color: item.color,
        });
        console.log("ITEM:", item);
        const precio = resultado.total;
        const cantidad = item.cantidad || 1;
        const subtotal = precio * cantidad;

        total += subtotal;

        return {
          ...item,
          precio,
          cantidad,
          subtotal,
        };
      }

      // 🔹 ITEM NORMAL
      const precio = item.precio || 0;
      const cantidad = item.cantidad || 1;
      const subtotal = precio * cantidad;

      total += subtotal;

      return {
        ...item,
        subtotal,
      };
    });

    console.log("ITEMS PROCESADOS:", itemsProcesados);
    console.log("TOTAL FINAL:", total);

    const presupuesto = new Presupuesto({
      userId,
      numero: user.contadorPresupuestos,
      cliente: req.body.cliente,
      fecha: req.body.fecha,
      items: itemsProcesados,
      total: total,
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
app.get("/api/presupuestos/:id/pdf", auth, async (req, res) => {
  try {
    const presupuesto = await Presupuesto.findById(req.params.id);

    if (!presupuesto) {
      return res.status(404).json({ error: "No encontrado" });
    }

    if (presupuesto.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: "No autorizado" });
    }

    res.json({ msg: "PDF generado", presupuesto });
  } catch (error) {
    res.status(500).json({ error: "Error generando PDF" });
  }
});

// =========================

module.exports = app;
