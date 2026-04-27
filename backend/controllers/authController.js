const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

async function register(req, res) {
  try {
    const { nombre, password } = req.body;

    const existingUser = await User.findOne({ nombre });

    if (existingUser) {
      return res.status(400).json({ error: "Usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ nombre, password: hashedPassword });

    await user.save();

    return res.status(201).json({ msg: "Usuario creado" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Usuario ya existe" });
    }

    return res.status(500).json({ error: "Error registrando usuario" });
  }
}

async function login(req, res) {
  try {
    const { nombre, password } = req.body;
    const user = await User.findOne({ nombre });

    if (!user) {
      return res.status(400).json({ error: "Credenciales invalidas" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: "Credenciales invalidas" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ error: "Error en login" });
  }
}

module.exports = { login, register };
