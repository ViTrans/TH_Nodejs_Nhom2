import express from "express";
import dotenv from "dotenv";
import configViewEngine from "./configs/viewEngine";
import initWebRoute from "./route/webRoute";
import path from "path";
const app = express();
dotenv.config();
const port = process.env.PORT;
configViewEngine(app);
initWebRoute(app);
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
