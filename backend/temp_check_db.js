import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'task_manager'
    });
    const [tables] = await connection.query('SHOW TABLES');
    console.log('TABLES:', JSON.stringify(tables, null, 2));
    const [commentRows] = await connection.query('SHOW COLUMNS FROM comments');
    console.log('COMMENTS_COLUMNS:', JSON.stringify(commentRows, null, 2));
    await connection.end();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
