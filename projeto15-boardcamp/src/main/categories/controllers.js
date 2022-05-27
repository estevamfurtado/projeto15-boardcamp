import db from '../../db.js';

export async function getCategories(req, res) {
    try {
        const result = await db.query('SELECT * FROM categories');
        res.send(result.rows)
    } catch (e) {
        console.log(e);
        res.status(500).send('Não foi possível enviar categorias')
    }
}

export async function postCategory(req, res) {
    const { name } = req.body;
    try {
        const result = await db.query(`INSERT INTO categories (name) VALUES ('${name}')`);
        res.sendStatus(201);
    } catch (e) {
        console.log(e);
        res.status(500).send('Não foi possível salvar categoria')
    }
}