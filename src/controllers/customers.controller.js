import connection from "../database/db.js";

async function insertCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    const customerExists = await connection.query(
        `SELECT * FROM customers WHERE cpf=$1`,
        [cpf]
    );

    if (cpf.length !== 11 || phone.length < 10 || !name || !birthday) {
        res.sendStatus(400);
        return;
    }

    if (customerExists.rows[0]) {
        res.sendStatus(409);
        return;
    }

    try {
        await connection.query(
            `
            INSERT INTO customers
                (name, phone, cpf, birthday)
            VALUES ($1, $2, $3, $4)`,
            [name, phone, cpf, birthday]
        );

        res.sendStatus(201);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
}

async function listCustomer(req, res) {
    const { cpf: filter } = req.query;
    try {
        if (!filter) {
            const customers = await connection.query(`SELECT * FROM customers`);

            res.send(customers.rows);
            return;
        }

        const cpfFiltered = await connection.query(
            `SELECT * FROM customers WHERE cpf LIKE $1`,
            [`${filter}%`]
        );

        res.send(cpfFiltered.rows);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
}

async function listCustomers(req, res) {
    const { id } = req.params;

    try {
        const customer = await connection.query(
            `SELECT * FROM customers WHERE id=$1`,
            [id]
        );

        if (!customer.rows[0]) {
            res.sendStatus(404);
            return;
        }

        res.send(customer.rows[0]);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
}

async function updateCustomer(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    if (cpf.length !== 11 || phone.length < 10 || !name || !birthday) {
        res.sendStatus(400);
        return;
    }

    try {
        const customerExists = await connection.query(
            `SELECT * FROM customers WHERE cpf=$1`,
            [cpf]
        );

        if (customerExists.rows[0]) {
            res.sendStatus(409);
            return;
        }

        await connection.query(
            `UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5`,
            [name, phone, cpf, birthday, id]
        );

        res.sendStatus(200);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
}

export { insertCustomer, listCustomer, listCustomers, updateCustomer };
