const jwt = require("jsonwebtoken");

const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Token requerido",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.status(401).json({
        error: "Token inválido",
      });
    }

    const user = await User.findById(decoded.id).lean();

    if (!user) {
      return res.status(401).json({
        error: "Usuario no encontrado",
      });
    }

    if (!user.activo) {
      return res.status(401).json({
        error: "Usuario inactivo",
      });
    }

    req.user = {
      id: user._id.toString(),

      nombre: user.nombre,

      role: user.role,

      perfil: user.perfil,

      margen: Number(user.margen ?? 0),

      empresa: user.empresa,

      ownerId: user.ownerId,

      activo: user.activo,
    };

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);

    return res.status(401).json({
      error: "Token inválido o expirado",
    });
  }
};
