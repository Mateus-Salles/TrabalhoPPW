import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { Connection } from "./database/connection.js";
import { router } from "./routes/routes.js";

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "./resources/views");
app.use(express.static("resources"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

(async () => {
  try {
    await Connection.authenticate();

    console.log("Connection has been established successfully.");
  } catch (err) {
    console.error("Unable to connect to the database: ", err);
  }
})();

app.listen(port, () => console.log(`Server running... [PORT ${port}]`));
