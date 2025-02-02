import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_ADDRESS,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

type SqlValue = string | number | boolean | Date | null;

export async function executeQuery<T>({ query, values }: { 
  query: string; 
  values?: SqlValue[];
}) {
  try {
    const [results] = await pool.execute(query, values);
    return results as T;
  } catch (error) {
    throw new Error(`Erro na execução da query: ${error}`);
  }
}

export default pool; 