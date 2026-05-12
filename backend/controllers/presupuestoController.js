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

const calcularPorton = require("../../wrappers/portones/calcularporton");

const calcularSuperficies = require("../../wrappers/superficies/calcularSuperficies");

const calcularPuertaPlaca = require("../../wrappers/placas/calcularPuertaPlaca");

const calcularPuertaEco = require("../../wrappers/puertas/calcularPuertaEco");

const calcularPuertaMosquitera = require("../../wrappers/mosquiteros/calcularPuertaMosquitera");

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
      return calcularPorton({
        ...item,
        perfil,
      });

    case "superficie":
      return calcularSuperficies({
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
  const presupuestos = await Presupuesto.find({
    userId: req.user.id,
  }).populate("userId", "nombre");

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

// =========================
// OBTENER
// =========================

async function obtener(req, res) {
  const presupuesto = await Presupuesto.findById(req.params.id);

  if (!presupuesto) {
    return res.status(404).json({
      error: "No encontrado",
    });
  }

  if (presupuesto.userId.toString() !== req.user.id) {
    return res.status(403).json({
      error: "No autorizado",
    });
  }

  return res.json(presupuesto);
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

    if (presupuesto.userId.toString() !== req.user.id) {
      return res.status(403).json({
        error: "No autorizado",
      });
    }

    const html = generarHTML(presupuesto);

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
