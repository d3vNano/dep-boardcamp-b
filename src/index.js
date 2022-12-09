import chalk from "chalk";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

const { Pool } = pkg;

const connection = new Pool({
    host: "localhost",
    post: 5432,
    user: "postgres",
    password: "root",
    database: "",
});

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

//rotas aqui

//rotas aqui

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(chalk.bold.cyan(`[Listening ON] Port: ${PORT}`));
});
