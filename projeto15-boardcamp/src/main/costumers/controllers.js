import db from '../../db.js';
import dayjs from 'dayjs';


export async function getCostumers(req, res) {

    const { cpf, offset, limit, order, desc } = req.query;
    const offsetQuery = offset ? `OFFSET ${offset}` : '';
    const limitQuery = limit ? `LIMIT ${limit}` : '';
    const orderQuery = order ? `ORDER BY "${limit}" ${desc ? ` DESC ` : ''}` : '';


    const filter = cpf ? `WHERE cpf LIKE '%${cpf}%'` : ``;
    try {
        const result = await db.query(`SELECT * FROM customers ${filter} ${offsetQuery} ${limitQuery} ${orderQuery};`);
        res.send(result.rows)
    } catch (e) {
        res.status(500).send('Não foi possível enviar customers')
    }
}

export async function getCostumerById(req, res) {
    const { id } = req.params;
    try {
        const result = await db.query(`SELECT * FROM customers WHERE id=${id};`);
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
        console.log(query)
        const result = await db.query(query);
        res.sendStatus(200);
    } catch (e) {
        res.status(500).send('Não foi possível salvar customers')
    }
}



