import db from '../../db.js';
import { RentalSchema } from './schema.js';


// MIDDLEWARES

export async function validateRentalBody(req, res, next) {
    const rental = req.body;
    const { error } = RentalSchema.validate(rental);

    if (error) {
        return res.status(400).send({ error: error.details });
    }

    try {
        const { customerId, gameId } = rental;
        const customerResponse = await db.query(`SELECT * FROM customers WHERE id=${customerId};`);
        const gameResponse = await db.query(`SELECT * FROM games WHERE id=${gameId};`);
        const customer = customerResponse.rows[0];
        const game = gameResponse.rows[0];

        if ((customerId || gameId) && !customer || !game) {
            return res.sendStatus(400);
        }

        const rentalsResponse = await db.query(`SELECT * FROM rentals WHERE "gameId"=${gameId} AND "returnDate" IS NULL;`);
        console.log(`stockTotal ${game.stockTotal} -- rent ${rentalsResponse.rows.length}`);

        if (rentalsResponse.rows.length >= game.stockTotal) {
            return res.sendStatus(400);
        }

        res.locals.game = game;
    } catch (error) {
        return res.sendStatud(500);
    }

    next();
}

export async function validateRentalId(req, res, next) {
    const { id } = req.params;

    try {
        const result = await db.query(`SELECT * FROM rentals WHERE id=${id}`);
        if (result.rows.length === 0) {
            return res.sendStatus(404);
        }
        res.locals.rental = result.rows[0];
    } catch (e) {
        return res.sendStatus(500);
    }

    next();
}

export async function validateRentalIsNotReturned(req, res, next) {
    const { rental } = res.locals;
    if (rental.returnDate) {
        return res.sendStatus(400);
    }
    next();
}

