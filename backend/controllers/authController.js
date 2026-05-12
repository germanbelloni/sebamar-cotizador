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
    const { nombre, password, role, perfil, margen, empresa, ownerId } =
      req.body;

    const existeUsuario = await User.findOne({
      nombre,
    });

    if (existeUsuario) {
      return res.status(400).json({
        error: "El usuario ya existe",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let finalOwnerId = null;

    // 👑 SUPERADMIN
    if (req.user?.role === "superadmin") {
      // ADMIN cliente
      if (role === "admin") {
        finalOwnerId = req.user.id;
      }

      // vendedor Sebamar
      if (role === "user") {
        finalOwnerId = req.user.id;
      }
    }

    // 🧑 ADMIN CLIENTE
    if (req.user?.role === "admin") {
      // vendedores del cliente
      if (role === "user") {
        finalOwnerId = req.user.id;
      }
    }

    const nuevoUsuario = await User.create({
      nombre,

      password: hashedPassword,

      role: role || "user",

      perfil: perfil || "amarilla",

      margen: Number(margen ?? 0),

      empresa: empresa || "sebamar",

      ownerId: finalOwnerId,
    });

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
    });

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

    return res.json({
      token,

      user: {
        id: user._id,

        nombre: user.nombre,

        role: user.role,

        perfil: user.perfil,

        margen: user.margen,

        empresa: user.empresa,

        ownerId: user.ownerId,
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
    const user = await User.findById(req.user.id).lean();

    if (!user) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    return res.json({
      id: user._id,

      nombre: user.nombre,

      role: user.role,

      perfil: user.perfil,

      margen: user.margen,

      empresa: user.empresa,

      ownerId: user.ownerId,
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
      users = await User.find().select("-password").sort({
        createdAt: -1,
      });
    }

    // 🧑 ADMIN
    if (req.user.role === "admin") {
      users = await User.find({
        ownerId: req.user.id,
      })
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

module.exports = {
  register,
  login,
  me,
  listar,
};
