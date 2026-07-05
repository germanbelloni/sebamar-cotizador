const puppeteer = require("puppeteer");
const mapPresupuestoToPrintable = require("../services/pdf/mapPresupuestoToPrintable");
const Presupuesto = require("../models/Presupuesto");
const User = require("../models/User");

const sanitizarCotizacion = require("../utils/pricing/sanitizarCotizacion");

// =========================
// PDF
// =========================

const generarHTML = require("../services/pdf/generarPDF");
const crearPresupuesto = require("../services/presupuestos/crearPresupuesto");
// const generarPresupuestoPdf = require("../services/pdf/generarPresupuestoPdf");
// =========================
// NUEVO NUMERO
// =========================

async function nuevoNumero(req, res) {
  const user = await User.findById(req.user.id);
  const printableData = mapPresupuestoToPrintable(presupuesto, user);

  console.log("PRINTABLE DATA");
  console.log(JSON.stringify(printableData, null, 2));

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

// =========================
// CREAR
// =========================

async function crear(req, res) {
  try {
    const presupuesto = await crearPresupuesto({
      user: req.user,
      body: req.body,
    });

    return res.json(presupuesto);
  } catch (error) {
    console.error("ERROR CREAR PRESUPUESTO:");
    console.error(error);

    if (error.message === "Usuario no encontrado") {
      return res.status(404).json({
        error: error.message,
      });
    }

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
  try {
    let filtros = {};

    // 👑 SUPERADMIN
    if (req.user.role === "superadmin") {
      filtros = {};
    }

    // 🧑 ADMIN
    else if (req.user.role === "admin") {
      filtros = {
        ownerId: req.user.id,
      };
    } else {
      filtros = {
        ownerId: req.user.ownerId,
      };
    }
    const presupuestos = await Presupuesto.find(filtros)
      .populate("userId", "nombre")
      .sort({
        createdAt: -1,
      });

    const resultado = presupuestos.map((p) => ({
      id: p._id,

      numero: p.numero,

      cliente: p.cliente,

      usuario: p.userId?.nombre || "Usuario",

      total: p.total,

      fecha: p.fecha,

      estado: p.estado || "pendiente",
      cantidadItems: p.items?.length || 0,

      telefono: p.telefono || "",
    }));

    return res.json(resultado);
  } catch (error) {
    console.log("ERROR LISTAR:", error);

    return res.status(500).json({
      error: "Error listando presupuestos",
    });
  }
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

  // =========================
  // 👑 SUPERADMIN
  // =========================

  if (req.user.role === "superadmin") {
    // acceso total
  }

  // =========================
  // 🧑 ADMIN
  // =========================
  else if (req.user.role === "admin") {
    if (presupuesto.ownerId?.toString() !== req.user.id) {
      return res.status(403).json({
        error: "No autorizado",
      });
    }
  }

  // =========================
  // 👨 USER
  // =========================
  else {
    if (presupuesto.userId?.toString() !== req.user.id) {
      return res.status(403).json({
        error: "No autorizado",
      });
    }
  }

  const resultado = {
    id: presupuesto._id,

    numero: presupuesto.numero,

    cliente: presupuesto.cliente,

    telefono: presupuesto.telefono,

    total: presupuesto.total,

    fecha: presupuesto.fecha,

    estado: presupuesto.estado || "pendiente",

    items: (presupuesto.items || []).map((item) => ({
      id: item._id?.toString(),

      modulo: item.modulo || "ventanas",

      titulo: item.titulo || item.descripcion || "Producto",

      descripcion: item.descripcion || "Sin descripción",

      cantidad: Number(item.cantidad || 1),

      precioUnitario: Number(item.precioUnitario || 0),

      subtotal: Number(item.subtotal || 0),

      // =========================
      // 💰 FINANCIERO
      // =========================

      precioBase: Number(item.precioBase || 0),

      precioLista: Number(item.precioLista || 0),

      precioFinal: Number(item.precioFinal || 0),

      margenAplicado: Number(item.margenAplicado || 0),

      perfilAplicado: item.perfilAplicado || "",

      configuracion: item.configuracion || {},

      metadata: item.metadata || {},
    })),
  };

  console.log("RESULTADO OBTENER:", JSON.stringify(resultado, null, 2));

  return res.json(resultado);
}

// =========================
// 🔄 CAMBIAR ESTADO
// =========================

async function cambiarEstado(req, res) {
  try {
    const presupuesto = await Presupuesto.findById(req.params.id);

    if (!presupuesto) {
      return res.status(404).json({
        error: "Presupuesto no encontrado",
      });
    }

    // =========================
    // 👑 SUPERADMIN
    // =========================

    if (req.user.role === "superadmin") {
      // acceso total
    }

    // =========================
    // 🧑 ADMIN
    // =========================
    else if (req.user.role === "admin") {
      if (presupuesto.ownerId?.toString() !== req.user.id) {
        return res.status(403).json({
          error: "No autorizado",
        });
      }
    }

    // =========================
    // 👨 USER
    // =========================
    else {
      if (presupuesto.userId?.toString() !== req.user.id) {
        return res.status(403).json({
          error: "No autorizado",
        });
      }
    }

    presupuesto.estado = req.body.estado;

    await presupuesto.save();

    return res.json({
      ok: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Error actualizando estado",
    });
  }
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

    // =========================
    // 👑 SUPERADMIN
    // =========================
    if (req.user.role === "superadmin") {
      // acceso total
    }

    // =========================
    // 🧑 ADMIN
    // =========================
    else if (req.user.role === "admin") {
      if (presupuesto.ownerId?.toString() !== req.user.id) {
        return res.status(403).json({
          error: "No autorizado",
        });
      }
    }

    // =========================
    // 👨 USER
    // =========================
    else {
      if (presupuesto.userId?.toString() !== req.user.id) {
        return res.status(403).json({
          error: "No autorizado",
        });
      }
    }

    const user = await User.findById(req.user.id);

    const html = generarHTML(presupuesto, user);

    const browser = await puppeteer.launch({
      headless: true,
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
// =========================
// 🗑 ELIMINAR
// =========================

async function eliminar(req, res) {
  try {
    const presupuesto = await Presupuesto.findById(req.params.id);

    if (!presupuesto) {
      return res.status(404).json({
        error: "Presupuesto no encontrado",
      });
    }

    // 👑 SUPERADMIN
    if (req.user.role === "superadmin") {
      // acceso total
    }

    // 🧑 ADMIN
    else if (req.user.role === "admin") {
      if (presupuesto.ownerId?.toString() !== req.user.id) {
        return res.status(403).json({
          error: "No autorizado",
        });
      }
    }

    // 👨 USER
    else {
      if (presupuesto.userId?.toString() !== req.user.id) {
        return res.status(403).json({
          error: "No autorizado",
        });
      }
    }

    await presupuesto.deleteOne();

    return res.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Error eliminando presupuesto",
    });
  }
}

// =========================
// ACTUALIZAR
// =========================

async function actualizar(req, res) {
  try {
    const presupuesto = await Presupuesto.findById(req.params.id);

    if (!presupuesto) {
      return res.status(404).json({
        error: "Presupuesto no encontrado",
      });
    }

    presupuesto.cliente = req.body.cliente;
    presupuesto.telefono = req.body.telefono;
    presupuesto.direccion = req.body.direccion;
    presupuesto.observaciones = req.body.observaciones;
    presupuesto.validez = req.body.validez;

    await presupuesto.save();

    return res.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Error actualizando presupuesto",
    });
  }
}

module.exports = {
  crear,
  listar,
  nuevoNumero,
  obtener,
  pdf,
  eliminar,
  actualizar,
  cambiarEstado,
};
