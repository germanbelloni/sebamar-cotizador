// const chromium = require("@sparticuz/chromium");

// const puppeteer =
//   process.env.NODE_ENV === "production"
//     ? require("puppeteer-core")
//     : require("puppeteer");
let chromium = null;
let puppeteer = null;

try {
  chromium = require("@sparticuz/chromium");

  puppeteer =
    process.env.NODE_ENV === "production"
      ? require("puppeteer-core")
      : require("puppeteer");
} catch (error) {
  console.log("⚠️ PDF deshabilitado temporalmente.");
}
const mapPresupuestoToPrintable = require("../services/pdf/mapPresupuestoToPrintable");
const Presupuesto = require("../models/Presupuesto");
const User = require("../models/User");
const { renderBudget } = require("../pdf/render/renderBudget");
const sanitizarCotizacion = require("../utils/pricing/sanitizarCotizacion");
const calcularItem = require("../services/presupuestos/calcularItem");

// =========================
// PDF
// =========================

const crearPresupuesto = require("../services/presupuestos/crearPresupuesto");
// const generarPresupuestoPdf = require("../services/pdf/generarPresupuestoPdf");
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

  return res.json({
    numero: user.contadorPresupuestos + 1,
  });
}

// =========================
// CALCULADOR GLOBAL
// =========================
//ACTUALIZAR
async function actualizarItems(req, res) {
  try {
    const presupuesto = await Presupuesto.findById(req.params.id);

    if (!presupuesto) {
      return res.status(404).json({
        error: "Presupuesto no encontrado",
      });
    }

    presupuesto.items = req.body.items;
    presupuesto.total = req.body.total;
    presupuesto.cliente = req.body.cliente;
    presupuesto.telefono = req.body.telefono;

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

      precioBase: Number(item.precioBase ?? 0),

      precioLista: Number(item.precioLista || 0),

      precioFinal: Number(item.precioFinal || 0),

      margenAplicado: Number(item.margenAplicado || 0),

      perfilAplicado: item.perfilAplicado || "",

      configuracion: item.configuracion || {},

      metadata: item.metadata || {},
    })),
  };

  console.log("RESULTADO OBTENER:", JSON.stringify(resultado, null, 2));
  console.log(JSON.stringify(resultado.items, null, 2));
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
    const estadosPermitidos = ["pendiente", "aprobado"];

    if (!estadosPermitidos.includes(req.body.estado)) {
      return res.status(400).json({
        error: "Estado inválido",
      });
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
// /// =========================
// // PDF
// // =========================

// async function pdf(req, res) {

//   console.log("===== ENTRE AL PDF NUEVO =====");

//   let browser;

//   try {
//     if (!req.params.id) {
//       return res.status(400).json({
//         error: "ID invalido",
//       });
//     }

//     const presupuesto = await Presupuesto.findById(req.params.id);

//     if (!presupuesto) {
//       return res.status(404).json({
//         error: "No encontrado",
//       });
//     }

//     // =========================
//     // 👑 SUPERADMIN
//     // =========================
//     if (req.user.role === "superadmin") {
//       // acceso total
//     }

//     // =========================
//     // 🧑 ADMIN
//     // =========================
//     else if (req.user.role === "admin") {
//       if (presupuesto.ownerId?.toString() !== req.user.id) {
//         return res.status(403).json({
//           error: "No autorizado",
//         });
//       }
//     }

//     // =========================
//     // 👨 USER
//     // =========================
//     else {
//       if (presupuesto.userId?.toString() !== req.user.id) {
//         return res.status(403).json({
//           error: "No autorizado",
//         });
//       }
//     }

//     const user = await User.findById(req.user.id);

//     const printable = mapPresupuestoToPrintable(presupuesto, user);

//     console.log("===== PRINTABLE =====");
//     console.log(JSON.stringify(printable, null, 2));
//     console.log("PRINTABLE COMPLETO");
//     console.log(printable);

//     const html = await renderBudget(printable);

//     if (process.env.NODE_ENV === "production") {
//       browser = await puppeteer.launch({
//         args: chromium.args,
//         defaultViewport: chromium.defaultViewport,
//         executablePath: await chromium.executablePath(),
//         headless: chromium.headless,
//       });
//     } else {
//       browser = await puppeteer.launch({
//         headless: true,
//       });
//     }

//     const page = await browser.newPage();

//     await page.setContent(html);

//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//     });

//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": "inline; filename=presupuesto.pdf",
//     });

//     return res.send(pdfBuffer);
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       error: "Error generando PDF",
//       detalle: error.message,
//     });
//   } finally {
//     if (browser) {
//       try {
//         await browser.close();
//       } catch (error) {
//         console.error("Error cerrando Chromium:", error);
//       }
//     }
//   }
// }
//TEMPORAL
async function pdf(req, res) {
  // ✅ PDF deshabilitado temporalmente
  if (!puppeteer) {
    return res.status(503).json({
      error: "PDF deshabilitado temporalmente",
    });
  }

  console.log("===== ENTRE AL PDF NUEVO =====");

  let browser;

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

    const printable = mapPresupuestoToPrintable(presupuesto, user);

    console.log("===== PRINTABLE =====");
    console.log(JSON.stringify(printable, null, 2));
    console.log("PRINTABLE COMPLETO");
    console.log(printable);

    const html = await renderBudget(printable);

    if (process.env.NODE_ENV === "production") {
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      browser = await puppeteer.launch({
        headless: true,
      });
    }

    const page = await browser.newPage();

    await page.setContent(html);

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

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
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (error) {
        console.error("Error cerrando Chromium:", error);
      }
    }
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

//actualizaritems
async function actualizarItems(req, res) {
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

    const usuario = await User.findById(req.user.id);

    let total = 0;

    const itemsProcesados = req.body.items.map((item) => {
      const cantidad = Number(item.cantidad || 1);

      let recalculado = null;

      try {
        recalculado = calcularItem(
          {
            ...item.configuracion,
            modulo: item.modulo,
            tipo: item.tipo,
            linea:
              item.linea || item.metadata?.linea || item.configuracion?.linea,
            metadata: item.metadata,
            configuracion: item.configuracion,
          },
          usuario.perfil,
        );
      } catch (error) {
        console.warn("No se pudo recalcular item:", item.modulo, error.message);
      }

      const descripcion = item.descripcion || item.tipo || "Producto";

      const precioUnitario = Number(
        recalculado?.precioFinal ??
          item.precioFinal ??
          item.precioLista ??
          item.precioProveedor ??
          item.precio ??
          item.subtotal ??
          0,
      );

      const subtotal = precioUnitario * cantidad;

      total += subtotal;

      return {
        tipo: item.tipo,
        modulo: item.modulo,
        titulo: item.titulo,
        cantidad,
        descripcion,
        precioUnitario,
        subtotal,

        precioBase: recalculado?.precioBase ?? item.precioBase ?? 0,

        precioLista: recalculado?.precioLista ?? item.precioLista ?? 0,

        precioFinal: recalculado?.precioFinal ?? item.precioFinal ?? subtotal,

        perfilAplicado:
          recalculado?.perfilAplicado ?? item.perfilAplicado ?? "",

        audit: recalculado?.audit ?? item.audit ?? null,

        metadata: item.metadata || {},

        configuracion: item.configuracion || item,
      };
    });

    presupuesto.items = itemsProcesados;
    presupuesto.total = total;
    presupuesto.cliente = req.body.cliente;
    presupuesto.telefono = req.body.telefono;

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
  obtener,
  actualizar,
  actualizarItems,
  eliminar,
  pdf,
  cambiarEstado,
  nuevoNumero,
};
