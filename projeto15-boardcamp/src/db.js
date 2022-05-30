import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();
const DB_URL = process.env.DATABASE_URL;

const { Pool } = pg;

const databaseConfig = {
    connectionString: DB_URL,
};
if (process.env.MODE === "PROD") {
    databaseConfig.ssl = { rejectUnauthorized: false }
}

const db = new Pool(databaseConfig);


export default db;