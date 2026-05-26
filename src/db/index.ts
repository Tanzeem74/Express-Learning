import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
    connectionString: config.connection_string
});

export const initDB = async () => {
    try {

        //user table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(30),
            email VARCHAR(30) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            is_active BOOLEAN DEFAULT true,
            age INT,
            role VARCHAR(10) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
        `);

        //profile table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS profiles(
            id SERIAL PRIMARY KEY,
            user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
            bio TEXT,
            address TEXT,
            phone VARCHAR(15),
            gender VARCHAR(6),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `)


        console.log("database connected sucessfully");
    } catch (error) {
        console.log(error);
    }
}