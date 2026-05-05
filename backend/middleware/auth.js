const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token requerido" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.status(401).json({ error: "Token inválido" });
    }

    // 🔥 BUSCAR USUARIO REAL EN DB
    const user = await User.findById(decoded.id).lean();

    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    // 🔥 DATOS QUE USA TODO EL SISTEMA
    req.user = {
      id: user._id,
      role: user.role || "user",
      perfil: user.perfil || "amarilla", // 👈 default seguro
      margen: Number(user.margen ?? 0), // 👈 asegura número
      empresa: user.empresa || null,
    };

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error.message);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};
