import db from '../db.js';
import Joi from "joi";

const GameSchema = Joi.object({
    name: Joi.string().required().messages({
        "name": "Not a valid game name",
    }),
    image: Joi.string().uri().required().messages({
        "image": "Not a valid email format",
    }),
    stockTotal: Joi.number().required().messages({
        "stockTotal": "Email is required",
    }),
    categoryId: Joi.number().required().messages({
        "categoryId": "Email is required",
    }),
    pricePerDay: Joi.number().required().messages({
        "pricePerDay": "Not a valid email format",
    })
});


export function validateGameBody(req, res, next) {
    const game = req.body;
    const { error } = GameSchema.validate(game);
    if (error) {
        return res.status(422).send({ error: error.details });
    }
    next();
}

export async function getGames(req, res) {
    try {
        const result = await db.query('SELECT * FROM games');
        res.send(result.rows)
    } catch (e) {
        console.log(e);
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
        console.log(query);
        const result = await db.query(query);
        res.sendStatus(200);
    } catch (e) {
        // console.log(e);
        res.status(500).send('Não foi possível salvar jogo')
    }
}
