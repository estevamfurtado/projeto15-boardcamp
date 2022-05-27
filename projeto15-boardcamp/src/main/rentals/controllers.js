import db from '../../db.js';
import dayjs from 'dayjs';



export async function getRentals(req, res) {

    // Filter & Query String
    const { customerId, gameId } = req.query;
    console.log(customerId, gameId);

    const customerFilter = customerId ? `"customerId"=${customerId}` : "";
    const gameFilter = gameId ? `"gameId"=${gameId}` : "";
    const filter = (customerId || gameId) ? `WHERE ${customerFilter}${(customerId && gameId) ? " AND " : ""}${gameFilter}` : "";
    let query = `
        SELECT rentals.*, 
            customers.name AS "customerName",
            games.id AS "gameId",
            games.name AS "gameName",
            categories.id AS "categoryId",
            categories.name AS "categoryName"
        FROM rentals 
            JOIN customers ON rentals."customerId"=customers.id
            JOIN games ON rentals."gameId"=games.id
            JOIN categories ON games."categoryId" = categories.id
        ${filter};`;

    try {
        const result = await db.query(query);
        const rentalsResult = result.rows;
        const rentals = rentalsResult.map(r => {
            return createRentalObject(r);
        })
        res.send(rentals);
    } catch (e) {
        res.status(500).send('Não foi possível enviar rentals')
    }
}

export async function postRental(req, res) {

    const { game } = res.locals;
    const { customerId, gameId, daysRented } = req.body;

    const rental = {
        customerId: customerId,
        gameId: gameId,
        rentDate: dayjs().format('YYYY-MM-DD'),
        daysRented: daysRented,
        returnDate: null,
        originalPrice: game.pricePerDay * daysRented,       // preço total do aluguel em centavos (dias alugados vezes o preço por dia do jogo)
        delayFee: null             // multa total paga por atraso (dias que passaram do prazo vezes o preço por dia do jogo)
    }

    const columns = [
        '"customerId"',
        '"gameId"',
        '"rentDate"',
        '"daysRented"',
        '"returnDate"',
        '"originalPrice"',
        '"delayFee"'
    ].join(', ')

    const values = [
        `${rental.customerId}`,
        `${rental.gameId}`,
        `'${rental.rentDate}'`,
        `${rental.daysRented}`,
        `${rental.returnDate}`,
        `${rental.originalPrice}`,
        `${rental.delayFee}`
    ].join(', ')

    try {
        const query = `INSERT INTO rentals (${columns}) VALUES (${values});`
        const result = await db.query(query);
        res.status(201).sendStatus(201);
    } catch (e) {
        res.status(500).send('Não foi possível salvar rental')
    }
}

export async function returnRentalById(req, res) {
    const { rental } = res.locals;

    let returnDate = dayjs().format('YYYY-MM-DD');
    let totalDays = dayjs(rental.rentDate).diff(dayjs(), 'days');
    let delay = (totalDays > rental.daysRented) ? totalDays - rental.daysRented : 0;
    let delayFee = delay * rental.originalPrice / rental.daysRented;

    try {
        const query = `UPDATE rentals SET "returnDate"='${returnDate}', "delayFee"=${delayFee} WHERE id=${rental.id};`
        const result = await db.query(query);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send('Não foi possível entregar rental')
    }
}

export async function deleteRentalById(req, res) {
    const { rental } = res.locals;
    try {
        let query = `DELETE FROM rentals WHERE id=${rental.id};`
        const result = await db.query(query);
        res.sendStatus(201);
    } catch (e) {
        res.status(500).send('Não foi possível deletar rental')
    }
}

export function getRentalsMetrics(req, res) { }



// UTILS ----------

function createRentalObject(r) {
    const rental = {
        id: r.id,
        customerId: r.customerId,
        gameId: r.gameId,
        rentDate: r.rentDate,
        daysRented: r.daysRented,
        returnDate: r.returnDate, // troca pra uma data quando já devolvido
        originalPrice: r.originalPrice,
        delayFee: r.delayFee,
        customer: {
            id: r.customerId,
            name: r.customerName
        },
        game: {
            id: r.gameId,
            name: r.gameName,
            categoryId: r.categoryId,
            categoryName: r.categoryName
        }
    }
    return rental;
}

