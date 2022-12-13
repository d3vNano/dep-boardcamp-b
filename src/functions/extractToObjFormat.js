function extractToObjFormat(rentals) {
    return rentals.rows.map((obj) => {
        const {
            id,
            customerId,
            gameId,
            rentDate,
            daysRented,
            returnDate,
            originalPrice,
            delayFee,
            customerName,
            gameName,
        } = obj;

        return {
            id,
            customerId,
            gameId,
            rentDate,
            daysRented,
            returnDate,
            originalPrice,
            delayFee,
            customer: {
                id: customerId,
                name: customerName,
            },
            game: {
                id: gameId,
                name: gameName,
            },
        };
    });
}

export default extractToObjFormat;
