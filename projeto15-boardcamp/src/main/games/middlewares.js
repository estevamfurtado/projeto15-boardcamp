import db from '../../db.js';
import { GameSchema } from './schema.js';

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
