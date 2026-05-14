const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  playerColor: {
    type: String,
    enum: ["white", "black"],
    required: true
  },

  winner: {
    type: String,
    enum: ["white", "black", "draw"],
    required: true
  },

  resultReason: {
    type: String,
    enum: ["checkmate", "stalemate", "draw", "resignation"],
  },

  moveHistory: {
    type: [String],
    required: true,
    default: []
  },

  totalMoves: {
    type: Number,
    required: true
  },

  difficulty: {
    type: Number,
    required: true
  },

  finalFen: {
    type: String
  }

}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

module.exports = mongoose.model("Match", matchSchema);
