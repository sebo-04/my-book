const express = require('express');
const path = require('path');
const { Pool } = require('pg'); 

const app = express();
const port = 3030;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  user: 'postgres',        
  host: 'localhost',        
  database: 'my_book_db',    
  password: '57401',
  port: 5432,               
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Database connection error:', err.stack);
  }
  console.log('Connected to PostgreSQL database successfully! 🐘');
  release();
});

app.get('/', (req, res) => {
  res.send('Welcome! The my-book project server is running successfully on port 3030. 🚀');
});

app.listen(port, () => {
  console.log(`Server is now running on: http://localhost:${port}`);
});
