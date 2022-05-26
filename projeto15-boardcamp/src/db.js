import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();
const DB_URL = process.env.DATABASE_URL;

const { Pool } = pg;
const db = new Pool({
    connectionString: DB_URL,
});

export default db;