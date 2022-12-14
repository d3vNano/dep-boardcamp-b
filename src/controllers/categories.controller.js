import connection from "../database/db.js";

async function insertCategories(req, res) {
    const { name } = req.body;

    if (!name) {
        res.sendStatus(400);
        return;
    }

    const categoryExists = await connection.query(
        `SELECT * FROM categories WHERE name = $1`,
        [name]
    );

    if (categoryExists.rows[0]) {
        res.sendStatus(409);
        return;
    }

    try {
        const category = await connection.query(
            "INSERT INTO categories (name) VALUES ($1)",
            [name]
        );

        res.sendStatus(201);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
}

async function listCategories(req, res) {
    try {
        const categories = await connection.query("SELECT * FROM categories;");

        res.send(categories.rows);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
}

export { insertCategories, listCategories };
