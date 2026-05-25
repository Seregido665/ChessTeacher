const MatchModel = require("../models/Match.model");

module.exports.saveMatch = async (req, res) => {
  try {
    const {
      playerColor,
      winner,
      resultReason,
      moveHistory,
      totalMoves,
      difficulty,
      finalFen
    } = req.body || {};

    const match = await MatchModel.create({
      user: req.user._id,
      playerColor,
      winner,
      resultReason,
      moveHistory,
      totalMoves,
      difficulty,
      finalFen
    });

    res.status(201).json({
      message: "Partida guardada correctamente",
      match
    });

  } catch (error) {
    console.error("ERROR GUARDANDO PARTIDA:", error);
    res.status(500).json({
      message: error.message
    });
  }
};

// - PARTIDAS DEL USUARIO -
module.exports.getMatches = async (req, res) => {
  try {
    const matches = await MatchModel.find({ user: req.user.id })
                                    .sort({ createdAt: -1 }); // Ordenar por más reciente primero

    return res.json(matches); 
  } catch (err) {
    return res.status(500).json({ message: err.message }); 
  }
};

module.exports.deleteMatch = async (req, res) => {
  try {
    const id = req.params.id;

    const match = await MatchModel.findById(id);
    if (!match) {
      return res.status(404).json({ message: "Partida no encontrada" });
    }

    if (match.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "No autorizado" });
    }

    await MatchModel.findByIdAndDelete(id);
    res.json({ message: "Partida eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
