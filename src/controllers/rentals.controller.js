import connection from "../database/db.js";
import dayjs from "dayjs";

import rentalsObjFormat from "../middlewares/rentalsObjFormat.middleware.js";

async function insertRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        const pricePerDay = await connection.query(
            `SELECT "pricePerDay" FROM games WHERE id=$1`,
            [gameId]
        );

        const { rentDate, returnDate, originalPrice, delayFee } = {
            rentDate: dayjs().format("YYYY-MM-DD"),
            originalPrice: daysRented * pricePerDay.rows[0].pricePerDay,
            returnDate: null,
            delayFee: null,
        };

        const rent = await connection.query(
            `
            INSERT INTO rentals
            ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                customerId,
                gameId,
                rentDate,
                daysRented,
                returnDate,
                originalPrice,
                delayFee,
            ]
        );

        res.sendStatus(201);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
}

async function listRentals(req, res) {
    try {
        const rentals = await connection.query(
            `
            SELECT rentals.*,
            customers.name as "customerName",
            games.name as "gameName"
            FROM rentals 
            JOIN customers
            ON rentals."customerId" = customers.id
            JOIN games
            ON rentals."gameId" = games.id`
        );

        const result = rentalsObjFormat(rentals);

        res.send(result);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
}

async function finishRental(req, res) {
    const { id } = req.params;

    try {
        const rental = await connection.query(
            `
            SELECT * FROM rentals
            WHERE id = $1`,
            [id]
        );

        if (rental.rows[0].returnDate) {
            return res.sendStatus(400);
        } else {
            const delay =
                new Date().getTime() - new Date(rental.rentDate).getTime();
            const delayInDays = Math.floor(delay / (24 * 3600 * 1000));

            let delayFee = 0;
            if (delayInDays > rental.daysRented) {
                const addicionalDays = delayInDays - rental.daysRented;
                delayFee = addicionalDays * rental.originalPrice;
                console.log("delayFee", addicionalDays);
            }

            await connection.query(
                `
                UPDATE rentals 
                SET "returnDate" = NOW(), "delayFee" = $1
                WHERE id = $2    
                `,
                [delayFee, id]
            );

            res.sendStatus(200);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function deleteRental(req, res) {
    const { id } = req.params;

    try {
        const rental = await connection.query(
            `
        DELETE * FROM rentals
        WHERE id=$1
        `,
            [id]
        );

        if (!rental.rows[0].id) {
            res.sendStatus(404);
            return;
        }

        if (!rental.rows[0].returnDate !== null) {
            res.sendStatus(400);
            return;
        }

        res.send(rental.rows[0]);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
}

export { insertRental, listRentals, finishRental, deleteRental };
