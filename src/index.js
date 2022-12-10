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
app.post("/categories", async (req, res) => {
    const { name } = req.body;

    const categoryExists = await connection.query(
        `SELECT * FROM categories WHERE name = $1`,
        [name]
    );

    if (!name) {
        res.sendStatus(400);
        return;
    }

    if (categoryExists.rows[0]) {
        res.sendStatus(409);
        return;
    }

    console.log(categoryExists.rows[0]);

    const category = await connection.query(
        "INSERT INTO categories (name) VALUES ($1)",
        [name]
    );

    res.sendStatus(201);
});

app.get("/categories", async (req, res) => {
    const categories = await connection.query("SELECT * FROM categories;");

    res.send(categories.rows);
});

//CRUD JOGOS
app.post("/games", async (req, res) => {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    const gameExists = await connection.query(
        "SELECT * FROM games WHERE name = $1",
        [name]
    );

    const categoryExists = await connection.query(
        "SELECT * FROM categories WHERE id = $1",
        [categoryId]
    );

    if (
        !name ||
        stockTotal <= 0 ||
        pricePerDay <= 0 ||
        !categoryExists.rows[0]
    ) {
        console.log("1 DEU RUIM");
        res.sendStatus(400);
        return;
    }

    if (gameExists.rows[0]) {
        console.log("2 DEU RUIM");
        res.sendStatus(409);
        return;
    }

    await connection.query(
        'INSERT INTO games ("name", "image", "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)',
        [name, image, stockTotal, categoryId, pricePerDay]
    );

    res.sendStatus(201);
});

app.get("/games", async (req, res) => {
    const games = await connection.query(
        `SELECT games.*, categories.name as "categoryName"
        FROM games
        JOIN categories
        ON games."categoryId"=categories.id`
    );

    res.send(games.rows);
});

//CRUD CLIENTES
app.post("/customers", (req, res) => {});

app.get("/customers", (req, res) => {});

app.get("/customers/:id", (req, res) => {});

app.put("/customers/:id", (req, res) => {});

//CRUD ALUGUEIS
app.post("/rentals", (req, res) => {});

app.get("/rentals", (req, res) => {});

app.post("/rentals/:id/return", (req, res) => {});

app.delete("/rentals/:id", (req, res) => {});

//CONEXÃO
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(chalk.bold.cyan(`[Listening ON] Port: ${PORT}`));
});
