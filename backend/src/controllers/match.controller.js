const MatchModel = require("../models/Match.model");

module.exports.saveMatch = async (req, res) => {
  try {
    const {
      user,
      playerColor,
      winner,
      resultReason,
      moveHistory,
      totalMoves,
      difficulty,
      finalFen
    } = req.body || {};

    const match = await MatchModel.create({
      user,
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

// -- BORRAR UN USUARIO :React ---
module.exports.deleteMatch = (req, res, next) => {
  const id = req.params.id;       // PUEDE QUE SEA _id ¿?¿?¿?¿?¿?¿?¿?¿?

  MatchModel.findByIdAndDelete(id)
    .then(() => {
      res.json("Match deleted successfully");
    })
    .catch((err) => {
      res.json(err);
    });
};
