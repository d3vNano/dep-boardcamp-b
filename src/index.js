import chalk from "chalk";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;

const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const app = express();
app.use(cors());
app.use(express.json());

//CRUD CATEGORIAS
app.get("/categories", async (req, res) => {
    const categories = await connection.query("SELECT * FROM categories;");

    res.send(categories.rows);
});

app.post("/categories", async (req, res) => {
    const { name } = req.body;

    if (!name) {
        res.sendStatus(400);
    }

    const category = await connection.query(
        "INSERT INTO categories (name) VALUES ($1)",
        [name]
    );

    res.sendStatus(201);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(chalk.bold.cyan(`[Listening ON] Port: ${PORT}`));
});
