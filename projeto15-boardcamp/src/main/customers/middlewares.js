import db from '../../db.js';
import { customerSchema } from './schema.js';



export async function validatecustomerBody(req, res, next) {
    const customer = req.body;
    const { error } = customerSchema.validate(customer);
    if (error) {
        return res.status(400).send({ error: error.details });
    }
    next();
}

export async function validatecustomerCPF(req, res, next) {
    try {
        const customer = req.body;

        const result = await db.query(`SELECT * FROM customers WHERE cpf='${customer.cpf}'`);
        if (result.rows.length > 0) {
            return res.sendStatus(409);
        }

        next();
    } catch (error) {
        return res.sendStatus(500);
    }
}

export async function validatecustomerId(req, res, next) {
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
