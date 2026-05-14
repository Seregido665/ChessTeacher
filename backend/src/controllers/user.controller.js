const UserModel = require("../models/User.model");
const bcrypt = require("bcryptjs");

// --- CONJUNTO DE OPERACIONES HECHAS CON LA BASE DE DATOS "users" ---
// -- BORRAR UN USUARIO :React ---
module.exports.deleteUser = (req, res, next) => {
  const id = req.params.id;

  UserModel.findByIdAndDelete(id)
    .then(() => {
      res.json({ message: "Usuario eliminado correctamente" });
    })
    .catch((err) => {
      res.json(err);
    });
};

// -- ACTUALIZAR UN USUARIO :React --
module.exports.updateUser = (req, res, next) => {
  const id = req.params.id;
  const updates = req.body;

  UserModel.findByIdAndUpdate(id, updates, { new: true })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.json(err);
    });
};
