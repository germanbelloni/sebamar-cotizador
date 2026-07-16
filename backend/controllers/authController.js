const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/User");

// =========================
// 🔐 TOKEN
// =========================

function generarToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
}

// =========================
// 👤 REGISTER
// SOLO SUPERADMIN
// =========================

async function register(req, res) {
  try {
    const {
      nombre,
      password,
      role,
      perfil,
      margen,
      logo,
      empresa,
      nombreEmpresa,
    } = req.body;

    // =========================
    // VALIDACIONES BÁSICAS
    // =========================

    if (!nombre || !password) {
      return res.status(400).json({
        error: "Nombre y password son obligatorios",
      });
    }

    const existeUsuario = await User.findOne({
      nombre,
    });

    if (existeUsuario) {
      return res.status(400).json({
        error: "El usuario ya existe",
      });
    }

    // =========================
    // VALIDAR ROLES
    // =========================

    const currentUserRole = req.user?.role;

    // SOLO SUPERADMIN CREA ADMINS
    if (role === "admin" && currentUserRole !== "superadmin") {
      return res.status(403).json({
        error: "No autorizado para crear admins",
      });
    }

    // ADMIN SOLO CREA USERS
    if (currentUserRole === "admin" && role !== "user") {
      return res.status(403).json({
        error: "Admin solo puede crear vendedores",
      });
    }

    // USER NO CREA NADA
    if (currentUserRole === "user") {
      return res.status(403).json({
        error: "No autorizado",
      });
    }

    // =========================
    // OWNER ID AUTOMÁTICO
    // =========================

    let finalOwnerId = null;

    // 👑 SUPERADMIN
    if (currentUserRole === "superadmin") {
      finalOwnerId = req.user.id;
    }

    // 🧑 ADMIN
    if (currentUserRole === "admin") {
      finalOwnerId = req.user.id;
    }

    // SEGURIDAD EXTRA
    if (!finalOwnerId) {
      return res.status(400).json({
        error: "No se pudo asignar ownerId",
      });
    }

    // =========================
    // HASH PASSWORD
    // =========================

    const hashedPassword = await bcrypt.hash(password, 10);

    // =========================
    // CREAR USUARIO
    // =========================
    const empresaSlug = nombreEmpresa
      ?.toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");
    let empresaData = {};

    if (currentUserRole === "admin") {
      const admin = await User.findById(req.user.id);

      console.log("ADMIN ENCONTRADO:");
      console.log(JSON.stringify(admin, null, 2));

      empresaData = {
        empresa: admin.empresa,
        nombreEmpresa: admin.nombreEmpresa,
        logo: admin.logo,
        telefono: admin.telefono,
        direccion: admin.direccion,
        email: admin.email,
        observacionesPdf: admin.observacionesPdf,
        colorPrimario: admin.colorPrimario,
        colorSecundario: admin.colorSecundario,
        margen: admin.margen,
        perfil: admin.perfil,
      };
      console.log("EMPRESA DATA:");
      console.log(JSON.stringify(empresaData, null, 2));
    }
    console.log("ROLE:", currentUserRole);
    console.log("OWNER:", finalOwnerId);
    console.log("DATA FINAL:", JSON.stringify(empresaData, null, 2));
    const nuevoUsuario = await User.create({
      nombre,

      password: hashedPassword,

      role: role || "user",
      perfil:
        currentUserRole === "admin" ? empresaData.perfil : perfil || "amarilla",

      margen:
        currentUserRole === "admin" ? empresaData.margen : Number(margen ?? 0),

      empresa:
        currentUserRole === "admin"
          ? empresaData.empresa
          : empresaSlug || nombre.toLowerCase(),

      nombreEmpresa:
        currentUserRole === "admin"
          ? empresaData.nombreEmpresa
          : nombreEmpresa || "",
      logo: empresaData.logo || "",

      telefono: empresaData.telefono || "",

      direccion: empresaData.direccion || "",

      email: empresaData.email || "",

      observacionesPdf: empresaData.observacionesPdf || "",

      colorPrimario: empresaData.colorPrimario || "#D6B400",

      colorSecundario: empresaData.colorSecundario || "#1f2937",

      ownerId: finalOwnerId,
    });
    // =========================
    // RESPONSE
    // =========================

    return res.status(201).json({
      ok: true,

      user: {
        id: nuevoUsuario._id,

        nombre: nuevoUsuario.nombre,

        role: nuevoUsuario.role,

        perfil: nuevoUsuario.perfil,

        margen: nuevoUsuario.margen,

        empresa: nuevoUsuario.empresa,

        ownerId: nuevoUsuario.ownerId,
      },
    });
  } catch (error) {
    console.log("ERROR REGISTER:", error.message);

    return res.status(500).json({
      error: "Error registrando usuario",
      detalle: error.message,
    });
  }
}

// =========================
// 🔑 LOGIN
// =========================

async function login(req, res) {
  try {
    const { nombre, password } = req.body;

    const user = await User.findOne({
      nombre,
    }).populate("ownerId", "nombre empresa role");

    if (!user) {
      return res.status(401).json({
        error: "Credenciales inválidas",
      });
    }

    if (!user.activo) {
      return res.status(401).json({
        error: "Usuario inactivo",
      });
    }

    const passwordOk = await bcrypt.compare(password, user.password);

    if (!passwordOk) {
      return res.status(401).json({
        error: "Credenciales inválidas",
      });
    }

    const token = generarToken(user);

    console.log("LOGIN USER:", JSON.stringify(user, null, 2));

    return res.json({
      token,

      user: {
        id: user._id,

        nombre: user.nombre,

        role: user.role,

        perfil: user.perfil,

        margen: user.margen,

        empresa: user.empresa,

        nombreEmpresa: user.nombreEmpresa,

        ownerId: user.ownerId,

        telefono: user.telefono,

        direccion: user.direccion,

        email: user.email,

        observacionesPdf: user.observacionesPdf,

        logo: user.logo,

        colorPrimario: user.colorPrimario,

        colorSecundario: user.colorSecundario,
      },
    });
  } catch (error) {
    console.log("ERROR LOGIN:", error.message);

    return res.status(500).json({
      error: "Error login",
      detalle: error.message,
    });
  }
}

// =========================
// 👤 ME
// =========================

async function me(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .populate("ownerId", "nombre empresa role")
      .lean();

    if (!user) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }
    console.log("LOGIN USER:", JSON.stringify(user, null, 2));

    return res.json({
      id: user._id,

      nombre: user.nombre,

      role: user.role,

      perfil: user.perfil,

      margen: user.margen,

      empresa: user.empresa,

      ownerId: user.ownerId,
      telefono: user.telefono,

      direccion: user.direccion,

      email: user.email,

      observacionesPdf: user.observacionesPdf,

      logo: user.logo,
      nombreEmpresa: user.nombreEmpresa,

      colorPrimario: user.colorPrimario,

      colorSecundario: user.colorSecundario,
    });
  } catch (error) {
    console.log("ERROR ME:", error.message);

    return res.status(500).json({
      error: "Error obteniendo usuario",
    });
  }
}

async function listar(req, res) {
  try {
    let users = [];

    // 👑 SUPERADMIN
    if (req.user.role === "superadmin") {
      users = await User.find()
        .populate("ownerId", "nombre role")
        .select("-password")
        .sort({
          createdAt: -1,
        });
    }

    // 🧑 ADMIN
    if (req.user.role === "admin") {
      users = await User.find({
        ownerId: req.user.id,
      })
        .populate("ownerId", "nombre role")
        .select("-password")
        .sort({
          createdAt: -1,
        });
    }
    return res.json(users);
  } catch (error) {
    console.log("ERROR LISTAR USERS:", error.message);

    return res.status(500).json({
      error: "Error obteniendo usuarios",
    });
  }
}

// =========================
// 🔒 TOGGLE ACTIVO
// =========================

async function toggleActivo(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    if (req.user.role === "admin" && user.role === "admin") {
      return res.status(403).json({
        error: "No autorizado",
      });
    }

    user.activo = !user.activo;

    await user.save();

    return res.json({
      ok: true,
      activo: user.activo,
    });
  } catch (error) {
    console.log("ERROR TOGGLE USER:", error.message);

    return res.status(500).json({
      error: "Error actualizando usuario",
    });
  }
}

async function actualizarConfiguracion(req, res) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    user.margen = Number(req.body.margen || 0);

    user.empresa = req.body.empresa || "";

    user.nombreEmpresa = req.body.nombreEmpresa || "";

    user.telefono = req.body.telefono || "";

    user.direccion = req.body.direccion || "";

    user.email = req.body.email || "";

    user.observacionesPdf = req.body.observacionesPdf || "";

    user.logo = req.body.logo || "";

    user.colorPrimario = req.body.colorPrimario || "#D6B400";

    user.colorSecundario = req.body.colorSecundario || "#1f2937";

    await user.save();

    return res.json({
      ok: true,
      user,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Error actualizando configuración",
    });
  }
}

module.exports = {
  register,
  login,
  me,
  listar,
  toggleActivo,
  actualizarConfiguracion,
};
