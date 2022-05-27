import db from '../db.js';
import Joi from "joi";
import dayjs from 'dayjs';

// MODELS

const CostumerSchema = Joi.object({
    name: Joi.string().required().messages({
        "name": "Not a valid name",
    }),
    phone: Joi.string().min(10).max(11).pattern(/^[0-9]+$/).required().messages({
        "phone": "Not a valid phone",
    }),
    cpf: Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({
        "cpf": "Not a valid cpf",
    }),
    birthday: Joi.date().iso().required().messages({
        "birthday": "Not a valid birthday",
    })
});

// MIDDLEWARES

export async function validateCostumerBody(req, res, next) {
    const costumer = req.body;
    const { error } = CostumerSchema.validate(costumer);
    if (error) {
        console.log(error.details);
        return res.status(400).send({ error: error.details });
    }
    const result = await db.query(`SELECT * FROM customers WHERE cpf='${costumer.cpf}'`);
    if (result.rows.length > 0) {
        return res.sendStatus(409);
    }
    next();
}

export async function validateCostumerId(req, res, next) {
    const { id } = req.params;
    const result = await db.query(`SELECT * FROM customers WHERE id=${id};`);
    if (result.rows.length === 0) {
        return res.sendStatus(404);
    }
    next();
}

// CONTROLLERS

export async function getCostumers(req, res) {
    const { cpf } = req.query;
    const filter = cpf ? `WHERE cpf LIKE '%${cpf}%'` : ``;
    try {
        const result = await db.query(`SELECT * FROM customers ${filter};`);
        res.send(result.rows)
    } catch (e) {
        res.status(500).send('Não foi possível enviar customers')
    }
}

export async function getCostumerById(req, res) {
    const { id } = req.params;
    try {
        const result = await db.query(`SELECT * FROM customers WHERE id=${id}`);
        res.send(result.rows[0]);
    } catch (e) {
        res.status(500).send(`Não foi possível enviar customer com id${id}`)
    }
}

export async function postCostumer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    const columns = [
        'name',
        'phone',
        'cpf',
        'birthday'].join(', ');

    const values = [
        `'${name}'`,
        `'${phone}'`,
        `'${cpf}'`,
        `'${dayjs(birthday).format('YYYY-MM-DD')}'`
    ].join(', ');

    try {
        const query = `INSERT INTO customers (${columns}) VALUES (${values});`
        const result = await db.query(query);
        res.sendStatus(201);
    } catch (e) {
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
        `birthday='${dayjs(birthday).format('YYYY-MM-DD')}'`
    ].join(', ')

    try {
        const query = `UPDATE customers SET ${values} WHERE id=${id};`
        const result = await db.query(query);
        res.sendStatus(200);
    } catch (e) {
        res.status(500).send('Não foi possível salvar customers')
    }
}



