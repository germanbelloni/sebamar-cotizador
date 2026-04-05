const fs = require("fs");
const path = require("path");
const perfiles = require("../../config/perfiles");

function redondear5(valor) {
  return Math.floor((valor + 2.5) / 5) * 5;
}

function obtenerProducto(nombre) {
  const ruta = path.join(process.cwd(), "data/productos", `${nombre}.json`);
  return JSON.parse(fs.readFileSync(ruta, "utf-8"));
}

// =========================
// 🎨 COLOR (REUTILIZABLE)
// =========================
function calcularColor(base, color) {
  return base * (color || 0);
}

// =========================
// 🚪 MODENA
// =========================
function calcularModena(data, producto) {
  const modelo = producto.modelos[data.modelo];

  if (!modelo) {
    throw new Error("Modelo no encontrado en modena");
  }

  let precio = modelo.base;

  // COLOR
  precio += calcularColor(precio, data.color);

  // VIDRIO
  if (data.vidrio === "dvh") {
    precio += (modelo.vidrios["4mm"] || 0) * 2;
    precio += modelo.dvh.camara || 0;
  } else {
    precio += modelo.vidrios[data.vidrio] || 0;
  }

  // TAMAÑO
  if (data.ancho === 90) precio *= 1.1;
  if (data.ancho === 70) precio *= 0.93;

  // ADICIONALES
  if (data.adicionales) {
    data.adicionales.forEach((a) => {
      precio += producto.adicionales[a] || 0;
    });
  }

  return precio;
}

// =========================
// 💼 PERFIL
// =========================
function aplicarPerfil(precio, perfil) {
  return (
    precio *
    (1 - perfil.descuento) *
    (1 + perfil.flete) *
    (1 + perfil.ganancia)
  );
}

module.exports = async (req, res) => {
  const { url, method } = req;

  // =========================
  // 📏 MEDIDAS
  // =========================
  if (url.startsWith("/api/medidas/")) {
    const producto = url.split("/").pop();
    const data = obtenerProducto(producto);
    return res.json(Object.keys(data.medidas || {}));
  }

  // =========================
  // 🎨 COLORES
  // =========================
  if (url === "/api/colores") {
    const colores = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "data/colores.json"), "utf-8")
    );
    return res.json(colores);
  }

  // =========================
  // 💰 CALCULAR
  // =========================
  if (url.startsWith("/api/calcular/") && method === "POST") {
    const productoNombre = url.split("/").pop();
    const producto = obtenerProducto(productoNombre);

    // =========================
    // 🚪 PUERTAS HERRERO (NO TOCAR LOGICA)
    // =========================
    if (productoNombre === "puertas_herrero") {
      const {
        modelo,
        color,
        tipoVidrio,
        tamano,
        adicionales = [],
        perfil = "amarilla",
      } = req.body;

      const modeloData = producto.modelos[modelo.toLowerCase()];

      if (!modeloData) {
        return res.json({ error: "Modelo no encontrado" });
      }

      let total = modeloData.base || 0;

      total *= 1 + (color || 0);

      if (tipoVidrio && modeloData.vidrios) {
        const vidrioValor = modeloData.vidrios[tipoVidrio];
        if (typeof vidrioValor === "number") {
          total += vidrioValor;
        }
      }

      // 👉 SACAMOS hardcode y usamos perfil
      const perfilData = perfiles[perfil] || perfiles["amarilla"];

      total = aplicarPerfil(total, perfilData);

      const ajuste = producto.ajustes[tamano] || 0;
      total *= 1 + ajuste;

      adicionales.forEach((a) => {
        total += producto.adicionales[a] || 0;
      });

      total = redondear5(total);

      return res.json({ total });
    }

    // =========================
    // 🚪 PUERTAS MODENA (NUEVO)
    // =========================
    if (productoNombre === "puertas_modena") {
      const {
        modelo,
        color,
        vidrio,
        ancho,
        adicionales = [],
        perfil = "amarilla",
      } = req.body;

      const perfilData = perfiles[perfil] || perfiles["amarilla"];

      let precioBase = calcularModena(
        { modelo, color, vidrio, ancho, adicionales },
        producto
      );

      let precioFinal = aplicarPerfil(precioBase, perfilData);

      precioFinal = redondear5(precioFinal);

      return res.json({ total: precioFinal });
    }

    // =========================
    // 🪟 VENTANAS (NO TOCAR)
    // =========================
    const { medida, color, incluirGuia, incluirMosquitero, tipoVidrio } =
      req.body;

    const productoData = producto;
    const datos = productoData.medidas?.[medida];

    if (!datos) return res.json({ error: "Medida no encontrada" });

    const descuento = productoNombre === "modena" ? 0.07 : 0.1;
    const flete = 0.06;
    const ganancia = 0.3;

    const base = datos.base || 0;
    const guia = datos.guia || 0;
    const mosq = datos.mosquitero || 0;

    let vidrioCalc = datos.vidrio || 0;
    if (datos.vidrios) {
      vidrioCalc = datos.vidrios[tipoVidrio || "3mm"] || 0;
    }

    const baseColor = base * (1 + (color || 0));
    const guiaColor = incluirGuia ? guia * (1 + (color || 0)) : 0;

    const subtotal = baseColor + vidrioCalc;
    const costo = subtotal * (1 - descuento);

    let precio = costo * (1 + flete) * (1 + ganancia);
    precio = redondear5(precio);

    let precioGuia = null;
    if (incluirGuia) {
      let g = guiaColor * (1 - descuento);
      g *= 1 + flete;
      g *= 1 + ganancia;
      precioGuia = redondear5(g);
    }

    let precioMosq = 0;
    if (incluirMosquitero) {
      let m = mosq * (1 + (color || 0));
      m *= 1 - descuento;
      m *= 1 + flete;
      m *= 1 + ganancia;
      precioMosq = redondear5(m);
    }

    return res.json({
      ventana: precio,
      guia: precioGuia,
      mosquitero: incluirMosquitero ? precioMosq : null,
      total: precio + (precioGuia || 0) + precioMosq,
    });
  }

  return res.status(404).send("Not found");
};