import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { closeDb, connectToDatabase } from "./utils/db";
import auth from "./routes/auth";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use('/api',auth)

app.get("/", (req, res) => {
  res.send("Hello World1!");
});

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

  //gracefully shutdown the server and close the database connection

  const shutdown = async () => {
    console.log("Received shutdown signal, closing HTTP server and database connection");
    await closeDb();
    process.exit(0);
    }
  process.on("SIGINT", shutdown);

  process.on("SIGTERM", shutdown);

});
