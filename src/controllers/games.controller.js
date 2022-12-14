import connection from "../database/db.js";

async function insertGames(req, res) {
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
        res.sendStatus(400);
        return;
    }

    if (gameExists.rows[0]) {
        console.log("2 DEU RUIM");
        res.sendStatus(409);
        return;
    }

    try {
        await connection.query(
            `INSERT INTO games
                ("name", "image", "stockTotal", "categoryId", "pricePerDay")
                VALUES ($1, $2, $3, $4, $5)`,
            [name, image, stockTotal, categoryId, pricePerDay]
        );

        res.sendStatus(201);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
}

async function listGames(req, res) {
    const { game: filter } = req.query;

    try {
        if (!filter) {
            const games = await connection.query(
                `SELECT
                    games.*, categories.name as "categoryName"
                    FROM games
                    JOIN categories
                    ON games."categoryId"=categories.id`
            );
            res.send(games.rows);
            return;
        }

        const gamesFiltered = await connection.query(
            `SELECT
                    games.*, categories.name as "categoryName"
                    FROM games
                    JOIN categories
                    ON games."categoryId"=categories.id
                    WHERE (games.name) ILIKE ($1)
                    `,
            [`${filter}%`]
        );
        res.send(gamesFiltered.rows);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
}

export { insertGames, listGames };
