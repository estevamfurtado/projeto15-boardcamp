import db from '../db.js';
import Joi from "joi";
import dayjs from 'dayjs';

const RentalSchema = Joi.object({
    customerId: Joi.number().required(),
    gameId: Joi.number().required(),
    daysRented: Joi.number().required()
});

export function validateRentalBody(req, res, next) {
    const rental = req.body;
    console.log('rental', rental);
    const { error } = RentalSchema.validate(rental);
    if (error) {
        console.log('erro: ->', error.details)
        return res.status(422).send({ error: error.details });
    }
    next();
}


export async function getRentals(req, res) {
    try {
        const result = await db.query('SELECT * FROM rentals');
        console.log('result', result.rows);
        res.send(result.rows)
    } catch (e) {
        console.log(e);
        res.status(500).send('Não foi possível enviar rentals')
    }
}

export async function postRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    const rental = {
        customerId: customerId,
        gameId: gameId,
        rentDate: dayjs().format('YYYY-MM-DD'),
        daysRented: daysRented,
        returnDate: null,
        originalPrice: daysRented * 5000,       // preço total do aluguel em centavos (dias alugados vezes o preço por dia do jogo)
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
        console.log(query);
        const result = await db.query(query);
        res.status(201).sendStatus(200);
    } catch (e) {
        res.status(500).send('Não foi possível salvar rental')
    }
}

export async function returnRentalById(req, res) {
    const { id } = req.params;
    console.log('aqui', id);
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




// -----------------------------


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



