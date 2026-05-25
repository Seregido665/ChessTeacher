const UserModel = require("../models/User.model");
const bcrypt = require("bcryptjs");

module.exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.user._id.toString() !== id) {
      return res.status(403).json({ message: "No autorizado" });
    }

    await UserModel.findByIdAndDelete(id);
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.user._id.toString() !== id) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const updates = { ...req.body };

    if (updates.password) {
      const salt = bcrypt.genSaltSync(10);
      updates.password = bcrypt.hashSync(updates.password, salt);
    }

    const user = await UserModel.findByIdAndUpdate(id, updates, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
