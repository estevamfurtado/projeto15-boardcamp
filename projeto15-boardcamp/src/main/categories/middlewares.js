import db from '../../db.js';

export async function validateCategoryBody(req, res, next) {
    const { name } = req.body;
    if (!name || name === "") {
        return res.sendStatus(400);
    }
    const result = await db.query(`SELECT * FROM categories WHERE name='${name}'`);
    if (result.rows.length > 0) {
        return res.sendStatus(409);
    }
    next();
}