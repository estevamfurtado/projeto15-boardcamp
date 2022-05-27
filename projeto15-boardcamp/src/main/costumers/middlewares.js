import db from '../../db.js';
import { CostumerSchema } from './schema.js';



export async function validateCostumerBody(req, res, next) {
    const costumer = req.body;
    const { error } = CostumerSchema.validate(costumer);
    if (error) {
        return res.status(400).send({ error: error.details });
    }
    next();
}

export async function validateCostumerCPF(req, res, next) {
    try {
        const costumer = req.body;

        const result = await db.query(`SELECT * FROM customers WHERE cpf='${costumer.cpf}'`);
        if (result.rows.length > 0) {
            return res.sendStatus(409);
        }

        next();
    } catch (error) {
        return res.sendStatus(500);
    }
}

export async function validateCostumerId(req, res, next) {
    try {
        const { id } = req.params;
        const result = await db.query(`SELECT * FROM customers WHERE id=${id};`);
        if (result.rows.length === 0) {
            return res.sendStatus(404);
        }
    } catch (error) {
        return res.sendStatus(500);
    }
    next();
}
