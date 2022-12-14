import chalk from "chalk";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import router from "./routes/routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use(router);

//CONEXÃO
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(chalk.bold.cyan(`[Listening ON] Port: ${PORT}`));
});
