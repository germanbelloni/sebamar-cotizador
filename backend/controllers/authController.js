const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/User");

// =========================
// 🔐 GENERAR TOKEN
// =========================
function generarToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      perfil: user.perfil,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
}

// =========================
// 📝 REGISTER
// =========================
async function register(req, res) {
  try {
    const { nombre, email, password, role, perfil } = req.body;

    const existeUsuario = await User.findOne({ email });

    if (existeUsuario) {
      return res.status(400).json({
        error: "El usuario ya existe",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await User.create({
      nombre,
      email,
      password: hashedPassword,
      role: role || "user",
      perfil: perfil || "standard",
    });

    const token = generarToken(nuevoUsuario);

    return res.status(201).json({
      token,
      user: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        role: nuevoUsuario.role,
        perfil: nuevoUsuario.perfil,
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
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        error: "Credenciales invalidas",
      });
    }

    const passwordOk = await bcrypt.compare(password, user.password);

    if (!passwordOk) {
      return res.status(401).json({
        error: "Credenciales invalidas",
      });
    }

    const token = generarToken(user);

    return res.json({
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        perfil: user.perfil,
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

module.exports = {
  register,
  login,
};
