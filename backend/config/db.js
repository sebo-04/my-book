const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',        
  host: 'localhost',        
  database: 'my-book',    
  password: 'sebo2004',
  port: 5432,               
});
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Database connection error:', err.stack);
  }
  console.log('Connected to PostgreSQL database successfully! 🐘');
  release();
});
module.exports = pool;