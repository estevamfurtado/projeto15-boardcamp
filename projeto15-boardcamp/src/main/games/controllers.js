import db from '../../db.js';

export async function getGames(req, res) {

    const { name, offset, limit, order, desc } = req.query;
    const offsetQuery = offset ? `OFFSET ${offset}` : '';
    const limitQuery = limit ? `LIMIT ${limit}` : '';
    const orderQuery = order ? `ORDER BY "${limit}" ${desc ? ` DESC ` : ''}` : '';

    const filter = name ? `WHERE upper(name) LIKE '%${name.toUpperCase()}%'` : ``;

    try {
        const query = `
            SELECT games.*, categories.name AS "categoryName"
            FROM games
            JOIN categories ON games."categoryId"=categories.id
            ${filter} ${offsetQuery} ${limitQuery} ${orderQuery};
        `;
        const result = await db.query(query);
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
