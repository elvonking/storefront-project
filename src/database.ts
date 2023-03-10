import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const {
    ENV,
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_NAME_TEST,
    DATABASE_USER,
    DATABASE_PASSWORD
} = process.env;

let client = new Pool();
if (ENV === 'dev') {
    client = new Pool({
        host: DATABASE_HOST,
        database: DATABASE_NAME,
        user: DATABASE_USER,
        password: DATABASE_PASSWORD
    });
}

if (ENV === 'test') {
    client = new Pool({
        host: DATABASE_HOST,
        database: DATABASE_NAME_TEST,
        user: DATABASE_USER,
        password: DATABASE_PASSWORD
    });
}

export default client;