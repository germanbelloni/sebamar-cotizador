const puppeteer = require("puppeteer");

const Presupuesto = require("../models/Presupuesto");
const User = require("../models/User");
const calcularMosquitero = require("../services/mosquiteros/calcularMosquitero");
const calcularPuerta = require("../services/puertas/calcularPuerta");
const generarHTML = require("../services/pdf/generarPDF");

async function nuevoNumero(req, res) {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  user.contadorPresupuestos += 1;
  await user.save();

  return res.json({ numero: user.contadorPresupuestos });
}

async function crear(req, res) {
  try {
    const userId = req.user.id;
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

      return { cantidad, descripcion, precio, subtotal };
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

    return res.json(presupuesto);
  } catch (error) {
    console.error("ERROR PRESUPUESTO:", error);
    return res.status(500).json({ error: "Error creando presupuesto" });
  }
}

async function listar(req, res) {
  const presupuestos = await Presupuesto.find({ userId: req.user.id }).populate(
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

  return res.json(resultado);
}

async function obtener(req, res) {
  const presupuesto = await Presupuesto.findById(req.params.id);

  if (!presupuesto) {
    return res.status(404).json({ error: "No encontrado" });
  }

  if (presupuesto.userId.toString() !== req.user.id) {
    return res.status(403).json({ error: "No autorizado" });
  }

  return res.json(presupuesto);
}

async function pdf(req, res) {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "ID invalido" });
    }

    const presupuesto = await Presupuesto.findById(req.params.id);

    if (!presupuesto) {
      return res.status(404).json({ error: "No encontrado" });
    }

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

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=presupuesto.pdf",
    });

    return res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error generando PDF" });
  }
}

module.exports = { crear, listar, nuevoNumero, obtener, pdf };
