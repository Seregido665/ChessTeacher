const { verifyToken } = require("../config/jwt.config");
const UserModel = require("../models/User.model");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token de acceso requerido" });
    }

    // Verificar el token
    const decoded = verifyToken(token);

    // Buscar el usuario en la base de datos
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    req.user = user;
    next();
    
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};


module.exports = {
  authenticateToken
};