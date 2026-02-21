import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'u802251718_mgfilms',
    password: process.env.DB_PASSWORD || 'Nitesh@123#12',
    database: process.env.DB_NAME || 'u802251718_mgfilms',
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
};

// TiDB Cloud requires SSL
if (process.env.DB_SSL === 'true') {
    poolConfig.ssl = {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
    };
}

const pool = mysql.createPool(poolConfig);

export default pool;
