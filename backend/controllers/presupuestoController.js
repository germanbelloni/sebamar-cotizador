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

    console.log("ITEM RECIBIDO:", JSON.stringify(req.body.items[0], null, 2));

    const itemsProcesados = req.body.items.map((item) => {
      console.log("ITEM MAP:", JSON.stringify(item, null, 2));

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

        modulo: item.modulo,

        titulo: item.titulo,

        cantidad,

        descripcion,

        precio,

        precioUnitario: item.precioUnitario || precio,

        subtotal,

        precioBase: item.precioBase || 0,

        precioLista: item.precioLista || 0,

        precioFinal: item.precioFinal || subtotal,

        margenAplicado: item.margenAplicado || 0,

        perfilAplicado: item.perfilAplicado || "",

        metadata: item.metadata || {},

        configuracion: item,
      };
    });

    console.log("ITEMS PROCESADOS:", JSON.stringify(itemsProcesados, null, 2));

    user.contadorPresupuestos += 1;

    await user.save();

    console.log("SCHEMA ITEMS:");

    console.log(Object.keys(Presupuesto.schema.path("items").schema.paths));

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

      estado: "pendiente",
    });

    console.log("ANTES SAVE:", JSON.stringify(presupuesto.items, null, 2));

    await presupuesto.save();

    console.log("DESPUES SAVE:", JSON.stringify(presupuesto.items, null, 2));

    return res.json(sanitizarResultado(presupuesto, req.user));
  } catch (error) {
    console.error("ERROR PRESUPUESTO:", error);

    console.error("BODY:", JSON.stringify(req.body, null, 2));

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
    }

    // 👨 USER
    else {
      filtros = {
        userId: req.user.id,
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

      modulo: item.modulo || item.tipo || "ventanas",

      titulo: item.titulo || item.descripcion || "Producto",

      descripcion: item.descripcion || "Sin descripción",

      cantidad: Number(item.cantidad || 1),

      precioUnitario: Number(item.precioUnitario || item.precio || 0),

      subtotal: Number(item.subtotal || item.precio * item.cantidad || 0),

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

  const limpio = sanitizarResultado(resultado, req.user);

  console.log("RESULTADO SANITIZADO:", JSON.stringify(limpio, null, 2));

  return res.json(limpio);
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
  cambiarEstado,
};
