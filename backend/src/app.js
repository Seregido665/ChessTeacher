require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { connectToMongo } = require("./config/mongo.config");
const router = require("./config/routes.config");

const app = express();
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use("/", router);

const PORT = process.env.PORT || 3000;

async function bootstrap() {
      try {
            await connectToMongo();
            app.listen(PORT, () => {
                  console.log(`Server is running on port ${PORT}`);
            });
      } catch (error) {
            console.error("No se pudo iniciar:", error.message);
            process.exit(1);
      }
}

bootstrap();