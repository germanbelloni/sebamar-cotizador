const puppeteer = require("puppeteer");

const Presupuesto = require("../models/Presupuesto");
const User = require("../models/User");

// =========================
// WRAPPERS
// =========================

const calcularMosquitero = require("../../wrappers/mosquiteros/calcularMosquiteroVentana");

const calcularPuerta = require("../../wrappers/puertas/calcularPuerta");

const calcularVentanaHerrero = require("../../wrappers/ventanas/calcularVentanaHerrero");
const calcularVentanaModena = require("../../wrappers/ventanas/calcularVentanaModena");

const calcularRajaHerrero = require("../../wrappers/rajas/calcularRajaHerrero");
const calcularRajaModena = require("../../wrappers/rajas/calcularRajaModena");

const calcularPostigones = require("../../wrappers/postigones/calcularPostigones");

const calcularPatagonicaHerrero = require("../../wrappers/patagonicas/calcularPatagonicaHerrero");
const calcularPatagonicaModena = require("../../wrappers/patagonicas/calcularPatagonicaModena");

const calcularporton = require("../../wrappers/portones/calcularporton");

const calcularsuperficies = require("../../wrappers/superficies/calcularSuperficies");

const calcularPuertaPlaca = require("../../wrappers/placas/calcularPuertaPlaca");

const calcularPuertaEco = require("../../wrappers/puertas/calcularPuertaEco");

const calcularPuertaMosquitera = require("../../wrappers/mosquiteros/calcularPuertaMosquitera");

const sanitizarResultado = require("../utils/pricing/sanitizarResultado");

// =========================
// PDF
// =========================

const generarHTML = require("../services/pdf/generarPDF");

// =========================
// NUEVO NUMERO
// =========================

async function nuevoNumero(req, res) {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      error: "Usuario no encontrado",
    });
  }

  user.contadorPresupuestos += 1;

  await user.save();

  return res.json({
    numero: user.contadorPresupuestos,
  });
}

// =========================
// CALCULADOR GLOBAL
// =========================

function calcularItem(item, perfil) {
  switch (item.tipo) {
    case "puerta":
      return calcularPuerta({
        ...item,
        perfil,
      });

    case "puertaEco":
      return calcularPuertaEco({
        ...item,
        perfil,
      });

    case "mosquitero":
      return calcularMosquitero({
        ...item,
        perfil,
      });

    case "puertaMosquitera":
      return calcularPuertaMosquitera({
        ...item,
        perfil,
      });

    case "ventana":
      if (item.linea === "modena") {
        return calcularVentanaModena({
          ...item,
          perfil,
        });
      }

      return calcularVentanaHerrero({
        ...item,
        perfil,
      });

    case "raja":
      if (item.linea === "modena") {
        return calcularRajaModena({
          ...item,
          perfil,
        });
      }

      return calcularRajaHerrero({
        ...item,
        perfil,
      });

    case "postigon":
      return calcularPostigones({
        ...item,
        perfil,
      });

    case "patagonica":
      if (item.linea === "modena") {
        return calcularPatagonicaModena({
          ...item,
          perfil,
        });
      }

      return calcularPatagonicaHerrero({
        ...item,
        perfil,
      });

    case "porton":
      return calcularporton({
        ...item,
        perfil,
      });

    case "superficie":
      return calcularsuperficies({
        ...item,
        perfil,
      });

    case "placa":
      return calcularPuertaPlaca({
        ...item,
        perfil,
      });

    default:
      return null;
  }
}

// =========================
// CREAR
// =========================

async function crear(req, res) {
  try {
    const userId = req.user.id;
    const ownerId = req.user.ownerId || req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    let total = 0;

    const itemsProcesados = req.body.items.map((item) => {
      const cantidad = item.cantidad || 1;

      let precio = item.precio || 0;

      let descripcion = item.descripcion || item.tipo || "Producto";

      const resultado = calcularItem(item, req.user.perfil);

      if (resultado) {
        precio = resultado.precioVenta || resultado.total || 0;

        descripcion = resultado.descripcion || descripcion;
      }

      const subtotal = precio * cantidad;

      total += subtotal;

      return {
        tipo: item.tipo,
        cantidad,
        descripcion,
        precio,
        subtotal,
        configuracion: item,
      };
    });

    user.contadorPresupuestos += 1;

    await user.save();

    const presupuesto = new Presupuesto({
      userId,
      ownerId,
      numero: user.contadorPresupuestos,
      cliente: req.body.cliente,
      fecha: req.body.fecha,
      items: itemsProcesados,
      telefono: req.body.telefono,

      direccion: req.body.direccion,

      observaciones: req.body.observaciones,

      validez: req.body.validez,
      total,
    });

    await presupuesto.save();

    return res.json(sanitizarResultado(presupuesto, req.user));
  } catch (error) {
    console.error("ERROR PRESUPUESTO:", error);

    return res.status(500).json({
      error: "Error creando presupuesto",
      detalle: error.message,
    });
  }
}

// =========================
// LISTAR
// =========================

async function listar(req, res) {
  const ownerId = req.user.ownerId || req.user.id;

  const presupuestos = await Presupuesto.find({
    ownerId,
  }).populate("userId", "nombre");

  const resultado = presupuestos.map((p) => ({
    id: p._id,

    numero: p.numero,

    cliente: p.cliente,

    usuario: p.userId?.nombre || "Usuario",

    total: p.total,

    fecha: p.fecha,
  }));

  return res.json(resultado);
}

// =========================
// OBTENER
// =========================

async function obtener(req, res) {
  const presupuesto = await Presupuesto.findById(req.params.id);

  const user = await User.findById(req.user.id);

  if (!presupuesto) {
    return res.status(404).json({
      error: "No encontrado",
    });
  }

  const ownerId = req.user.ownerId || req.user.id;

  if (presupuesto.ownerId?.toString() !== ownerId) {
    return res.status(403).json({
      error: "No autorizado",
    });
  }

  const resultado = {
    id: presupuesto._id,

    numero: presupuesto.numero,

    cliente: presupuesto.cliente,

    telefono: presupuesto.telefono,

    total: presupuesto.total,

    fecha: presupuesto.fecha,

    items: (presupuesto.items || []).map((item) => ({
      id: item._id?.toString(),

      modulo: item.modulo || item.tipo || "ventanas",

      titulo: item.titulo || item.descripcion || "Producto",

      descripcion: item.descripcion || "Sin descripción",

      cantidad: Number(item.cantidad || 1),

      precioUnitario: Number(item.precioUnitario || item.precio || 0),

      subtotal: Number(item.subtotal || item.precio * item.cantidad || 0),

      configuracion: item.configuracion || {},

      metadata: item.metadata || {},
    })),
  };

  return res.json(sanitizarResultado(resultado, req.user));
}

// =========================
// PDF
// =========================

async function pdf(req, res) {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        error: "ID invalido",
      });
    }

    const presupuesto = await Presupuesto.findById(req.params.id);

    if (!presupuesto) {
      return res.status(404).json({
        error: "No encontrado",
      });
    }

    const ownerId = req.user.ownerId || req.user.id;

    if (presupuesto.ownerId?.toString() !== ownerId) {
      return res.status(403).json({
        error: "No autorizado",
      });
    }

    const user = await User.findById(req.user.id);

    const html = generarHTML(presupuesto, user);

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

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

    return res.status(500).json({
      error: "Error generando PDF",
      detalle: error.message,
    });
  }
}

module.exports = {
  crear,
  listar,
  nuevoNumero,
  obtener,
  pdf,
};
