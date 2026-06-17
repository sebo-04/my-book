const pool = require('../config/db');
const getBookDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const bookQuery = `
            SELECT b.*, COALESCE(AVG(r.ratingvalue), 0) as avg_rating
            FROM books b
            LEFT JOIN ratings r ON b.bookid = r.bookid
            WHERE b.bookid = $1
            GROUP BY b.bookid;
        `;
        const bookResult = await pool.query(bookQuery, [id]);
        if (bookResult.rows.length === 0) {
            return res.status(404).json({ message: 'الكتاب غير موجود' });
        }
        const bookDetails = bookResult.rows[0];
        const categoriesQuery = `
            SELECT c.categoryname 
            FROM categories c
            INNER JOIN book_categories bc ON c.categoryid = bc.categoryid
            WHERE bc.bookid = $1;
        `;
        const categoriesResult = await pool.query(categoriesQuery, [id]);

        const reviewsQuery = `
            SELECT r.ratingvalue, r.comment, r.createdat, u.username
            FROM ratings r
            INNER JOIN users u ON r.userid = u.userid
            WHERE r.bookid = $1
            ORDER BY r.createdat DESC;
        `;
        const reviewsResult = await pool.query(reviewsQuery, [id]);
        const copiesQuery = `
            SELECT 
                COUNT(*) as total_copies,
                COUNT(CASE WHEN availabilitystatus = 'Available' THEN 1 END) as available_copies
            FROM copies
            WHERE bookid = $1;
        `;
        const copiesResult = await pool.query(copiesQuery, [id]);
        return res.status(200).json({
            ...bookDetails,
            categories: categoriesResult.rows,
            reviews: reviewsResult.rows,
            total_copies: parseInt(copiesResult.rows[0].total_copies) || 0,
            available_copies: parseInt(copiesResult.rows[0].available_copies) || 0
        });
    } catch (error) {
        console.error('Error fetching book details:', error);
        return res.status(500).json({ message: 'خطأ في خادم الخلفية عند جلب تفاصيل الكتاب' });
    }
};
const addReview = async (req, res) => {
    const { id } = req.params;
    const { userId, ratingValue, comment } = req.body;
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
        return res.status(400).json({ message: 'يرجى تحديد تقييم صحيح بين 1 و 5 نجوم' });
    }
    try {
        const query = `
            INSERT INTO ratings (bookid, userid, ratingvalue, comment)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (bookid, userid) 
            DO UPDATE SET ratingvalue = EXCLUDED.ratingvalue, comment = EXCLUDED.comment
            RETURNING *;
        `;
        await pool.query(query, [id, userId, ratingValue, comment]);
        return res.status(200).json({ message: 'تم حفظ تقييمك ومراجعتك بنجاح' });
    } catch (error) {
        console.error('Error adding review:', error);
        return res.status(500).json({ message: 'حدث خطأ أثناء حفظ التقييم في الخادم' });
    }
};
const reserveCopy = async (req, res) => {
    const { id } = req.params; 
    const { userId } = req.body; 
    try {
        const checkExistingReservationQuery = `
            SELECT 1 FROM loans l
            INNER JOIN copies c ON l.copyid = c.copyid
            WHERE c.bookid::text = $1::text 
              AND l.userid::text = $2::text 
              AND l.status ILIKE 'Active';
        `;
        const existingReservationResult = await pool.query(checkExistingReservationQuery, [id, userId]);
        if (existingReservationResult.rows.length > 0) {
            return res.status(400).json({ 
                message: 'عذراً، لقد قمت بحجز نسخة من هذا الكتاب سابقاً ولا يمكنك حجز أكثر من نسخة واحدة منه في نفس الوقت.' 
            });
        }
        const findCopyQuery = `
            SELECT copyid FROM copies 
            WHERE bookid::text = $1::text AND availabilitystatus ILIKE 'Available' 
            LIMIT 1;
        `;
        const findCopyResult = await pool.query(findCopyQuery, [id]);
        if (findCopyResult.rows.length === 0) {
            return res.status(400).json({ message: 'نأسف، لا تتوفر أي نسخة ورقية متاحة للاستعارة حالياً' });
        }
        const copyId = findCopyResult.rows[0].copyid;
        await pool.query(`UPDATE copies SET availabilitystatus = 'Reserved' WHERE copyid = $1`, [copyId]);
        const expectedReturn = new Date();
        expectedReturn.setDate(expectedReturn.getDate() + 14); 
        const insertLoanQuery = `
            INSERT INTO loans (copyid, userid, expectedreturndate, status)
            VALUES ($1, $2, $3, 'Active');
        `;
        await pool.query(insertLoanQuery, [copyId, userId, expectedReturn]);
        return res.status(200).json({ message: 'تم حجز النسخة الورقية لك بنجاح! يمكنك استلامها من المكتبة.' });
    } catch (error) {
        console.error('Error reserving copy:', error);
        return res.status(500).json({ message: 'حدث خطأ في الخادم أثناء محاولة حجز النسخة الورقية' });
    }
};
module.exports = {
    getBookDetails,
    addReview,
    reserveCopy
};