const dns = require("node:dns");

dns.setServers(["1.1.1.1", "1.0.0.1", "8.8.8.8", "8.8.4.4"]);

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { connectToMongo } = require("./config/mongo.config");
const router = require("./config/routes.config");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);

const PORT = 3000;

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