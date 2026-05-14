const mongoose = require("mongoose");

async function connectToMongo() {
  const mongoUri = process.env.MONGODB_URI;

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      family: 4,
    });
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    throw error;
  }
}

module.exports = { connectToMongo };
