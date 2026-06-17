const pool = require('../config/db');
const getCategories = async (req, res) => {
    try {
        const result = await pool.query('SELECT categoryid, categoryname FROM categories ORDER BY categoryname ASC');
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ message: 'خطأ في جلب التصنيفات' });
    }
};
const getLatestBooks = async (req, res) => {
    try {
        const query = `
            SELECT b.*, COALESCE(AVG(r.ratingvalue), 0) as avg_rating
            FROM books b
            LEFT JOIN ratings r ON b.bookid = r.bookid
            GROUP BY b.bookid
            ORDER BY b.createdat DESC
            LIMIT 10;
        `;
        const result = await pool.query(query);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching latest books:', error);
        return res.status(500).json({ message: 'خطأ في جلب أحدث الكتب' });
    }
};
const getTopRatedBooks = async (req, res) => {
    try {
        const query = `
            SELECT b.*, AVG(r.ratingvalue) as avg_rating
            FROM books b
            INNER JOIN ratings r ON b.bookid = r.bookid
            GROUP BY b.bookid
            ORDER BY avg_rating DESC
            LIMIT 10;
        `;
        const result = await pool.query(query);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching top rated books:', error);
        return res.status(500).json({ message: 'خطأ في جلب الكتب الأعلى تقييماً' });
    }
};
const searchBooks = async (req, res) => {
    const { query, categoryId, sort } = req.query;
    try {
        let sqlQuery = `
            SELECT b.*, COALESCE(AVG(r.ratingvalue), 0) as avg_rating
            FROM books b
            LEFT JOIN ratings r ON b.bookid = r.bookid
            LEFT JOIN book_categories bc ON b.bookid = bc.bookid
            WHERE 1=1
        `;
        const params = [];
        let paramIndex = 1;
  if (query && query.trim() !== '') {
            sqlQuery += ` AND (b.title ILIKE $${paramIndex} OR b.authorname ILIKE $${paramIndex})`;
            params.push(`%${query}%`);
            paramIndex++;
        }
  if (categoryId) {
            sqlQuery += ` AND bc.categoryid = $${paramIndex}`;
            params.push(categoryId);
            paramIndex++;
        }
        sqlQuery += ` GROUP BY b.bookid`;
  if (sort === 'oldest') {
            sqlQuery += ` ORDER BY b.publishyear ASC, b.createdat ASC`;
        } else {
            sqlQuery += ` ORDER BY b.publishyear DESC, b.createdat DESC`;
        }
        const result = await pool.query(sqlQuery, params);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error during book search:', error);
        return res.status(500).json({ message: 'حدث خطأ في الخادم أثناء معالجة البحث' });
    }
};
module.exports = {
    getCategories,
    getLatestBooks,
    getTopRatedBooks,
    searchBooks
};