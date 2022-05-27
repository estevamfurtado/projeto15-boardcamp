import db from '../db.js';
import Joi from "joi";
import dayjs from 'dayjs';

// SCHEMA

const RentalSchema = Joi.object({
    customerId: Joi.number().required(),
    gameId: Joi.number().required(),
    daysRented: Joi.number().min(1).required()
});

// MIDDLEWARES

export async function validateRentalBody(req, res, next) {
    const rental = req.body;
    const { error } = RentalSchema.validate(rental);

    if (error) {
        return res.status(400).send({ error: error.details });
    }

    const { customerId, gameId } = rental;
    const costumerResponse = await db.query(`SELECT * FROM customers WHERE id=${customerId};`);
    const gameResponse = await db.query(`SELECT * FROM games WHERE id=${gameId};`);
    const customer = costumerResponse.rows[0];
    const game = gameResponse.rows[0];

    if (!customer || !game) {
        return res.sendStatus(400);
    }

    const rentalsResponse = await db.query(`SELECT * FROM rentals WHERE "gameId"=${gameId} AND "returnDate"=null;`);
    console.log(rentalsResponse.rows.length);

    if (rentalsResponse.rows.length > game.stockTotal) {
        return res.sendStatus(400);
    }

    res.locals.game = game;

    next();
}

export async function validateRentalId(req, res, next) {
    const { id } = req.params;
    const result = await db.query(`SELECT * FROM rentals WHERE id=${id}`);
    if (result.rows.length === 0) {
        return res.sendStatus(404);
    }
    next();
}

// CONTROLLERS

export async function getRentals(req, res) {

    // Filter & Query String
    const { customerId, gameId } = req.query;

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
            JOIN categories ON games."categoryId" = categories.id;
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
    const { id } = req.params;
    try {
        let query = `SELECT * FROM rentals WHERE id=${id};`
        let result = await db.query(query);
        let rental = result.rows[0];
        let returnDate = dayjs().format('YYYY-MM-DD');

        let returnDays = dayjs(rental.rentDate).diff(dayjs(), 'days');
        let delay = (returnDays > rental.daysRented) ? returnDays - rental.daysRented : 0;
        console.log(delay);
        let delayFee = delay * 50000;
        console.log(delayFee);
        console.log(returnDate, delayFee);

        query = `UPDATE rentals SET "returnDate"='${returnDate}', "delayFee"=${delayFee} WHERE id=${id};`

        console.log(query);
        result = await db.query(query);
        console.log('feito')
        res.sendStatus(201);
    } catch (e) {
        // console.log(e);
        res.status(500).send('Não foi possível salvar rental')
    }
}

export async function deleteRentalById(req, res) {
    const { id } = req.params;
    console.log('aqui', id);
    try {
        let query = `DELETE FROM rentals WHERE id=${id};`
        result = await db.query(query);
        console.log('feito');
        res.sendStatus(201);
    } catch (e) {
        // console.log(e);
        res.status(500).send('Não foi possível deletar rental')
    }
}
export function getRentalsMetrics(req, res) { }




// UTILS

function createRentalObject(r) {
    const rental = {
        id: r.id,
        customerId: r.costumerId,
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

