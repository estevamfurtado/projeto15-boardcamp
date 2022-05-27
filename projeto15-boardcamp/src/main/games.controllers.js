import db from '../db.js';
import Joi from "joi";

const GameSchema = Joi.object({
    name: Joi.string().required().messages({
        "name": "Not a valid game name",
    }),
    image: Joi.string().uri().required().messages({
        "image": "Not a valid email format",
    }),
    stockTotal: Joi.number().integer().min(1).required().messages({
        "stockTotal": "Email is required",
    }),
    categoryId: Joi.number().required().messages({
        "categoryId": "Email is required",
    }),
    pricePerDay: Joi.number().integer().min(1).required().messages({
        "pricePerDay": "Not a valid email format",
    })
});


export async function validateGameBody(req, res, next) {
    const game = req.body;
    const { error } = GameSchema.validate(game);
    if (error) {
        return res.status(400).send({ error: error.details });
    }
    const result = await db.query(`SELECT * FROM games WHERE name='${game.name}'`);
    if (result.rows.length > 0) {
        return res.sendStatus(409);
    }
    next();
}

export async function getGames(req, res) {

    const { name } = req.query;
    const filter = name ? `WHERE upper(name) LIKE '%${name.toUpperCase()}%'` : ``;

    try {
        const result = await db.query(`SELECT * FROM games ${filter};`);
        res.send(result.rows)
    } catch (e) {
        res.status(500).send('Não foi possível enviar games')
    }
}

export async function postGame(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
    const columns = ['name', 'image', '"stockTotal"', '"categoryId"', '"pricePerDay"'].join(', ')
    const values = [
        `'${name}'`,
        `'${image}'`,
        stockTotal,
        categoryId,
        pricePerDay
    ].join(', ')

    try {
        const query = `INSERT INTO games (${columns}) VALUES (${values});`
        const result = await db.query(query);
        res.sendStatus(201);
    } catch (e) {
        res.status(500).send('Não foi possível salvar jogo')
    }
}
