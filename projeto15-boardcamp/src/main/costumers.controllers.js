import db from '../db.js';
import Joi from "joi";

const CostumerSchema = Joi.object({
    name: Joi.string().required().messages({
        "name": "Not a valid name",
    }),
    phone: Joi.string().required().messages({
        "phone": "Not a valid phone",
    }),
    cpf: Joi.string().required().messages({
        "cpf": "Not a valid cpf",
    }),
    birthday: Joi.string().required().messages({
        "birthday": "Not a valid birthday",
    })
});

export function validateCostumerBody(req, res, next) {
    const costumer = req.body;
    console.log(costumer);
    const { error } = CostumerSchema.validate(costumer);
    if (error) {
        return res.status(422).send({ error: error.details });
    }
    next();
}



export async function getCostumers(req, res) {
    try {
        const result = await db.query('SELECT * FROM customers');
        res.send(result.rows)
    } catch (e) {
        console.log(e);
        res.status(500).send('Não foi possível enviar customers')
    }
}
export async function getCostumerById(req, res) {
    const { id } = req.params;
    try {
        const result = await db.query(`SELECT * FROM customers WHERE id=${id}`);
        res.send(result.rows[0]);
    } catch (e) {
        console.log(e);
        res.status(500).send(`Não foi possível enviar customer com id${id}`)
    }
}

export async function postCostumer(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    const columns = ['name', 'phone', 'cpf', 'birthday'].join(', ')
    const values = [
        `'${name}'`,
        `'${phone}'`,
        `'${cpf}'`,
        `'${birthday}'`
    ].join(', ')

    try {
        const query = `INSERT INTO customers (${columns}) VALUES (${values});`
        const result = await db.query(query);
        res.sendStatus(200);
    } catch (e) {
        // console.log(e);
        res.status(500).send('Não foi possível salvar customers')
    }
}
export async function updateCostumerById(req, res) {

    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    const values = [
        `name='${name}'`,
        `phone='${phone}'`,
        `cpf='${cpf}'`,
        `birthday='${birthday}'`
    ].join(', ')

    try {
        const query = `UPDATE customers SET ${values} WHERE id=${id};`
        const result = await db.query(query);
        res.sendStatus(200);
    } catch (e) {
        // console.log(e);
        res.status(500).send('Não foi possível salvar customers')
    }
}



