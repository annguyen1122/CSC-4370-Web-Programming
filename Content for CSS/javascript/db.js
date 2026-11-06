
const mysql = require('mysql2/promise');

async function main() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'anan4394',
            database: 'DummyUserTable',
            port: 3306
        });

        console.log('connected successfully');

        const [rows] = await connection.query('SELECT * FROM users');

        console.table(rows);

        await connection.end();
    } catch (error) {
        console.error('Connection failed:', error.message);
    }
}

main();
