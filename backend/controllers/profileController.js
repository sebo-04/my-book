const pool = require('../config/db'); 
exports.getProfileData = async (req, res) => {
    try {
        const userEmail = req.headers['user-email'];
        if (!userEmail) {
            return res.status(400).json({ 
                success: false, 
                message: 'يرجى تزويد البريد الإلكتروني للمطلب.' 
            });
        }
        const userQuery = `
            SELECT userid, username, email, usertype 
            FROM users 
            WHERE email = $1
        `;
        const userResult = await pool.query(userQuery, [userEmail]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'المستخدم غير موجود في النظام.' });
        }
        const userData = userResult.rows[0];
        const loansQuery = `
            SELECT b.title, l.loandate, l.expectedreturndate 
            FROM loans l
            JOIN copies c ON l.copyid = c.copyid
            JOIN books b ON c.bookid = b.bookid
            WHERE l.userid = $1 AND l.status = 'Active'
        `;
        const loansResult = await pool.query(loansQuery, [userData.userid]);
        res.status(200).json({
            success: true,
            user: {
                name: userData.username,   
                email: userData.email,     
                role: userData.usertype    
            },
            borrowedBooks: loansResult.rows.map((loan, index) => ({
                id: index + 1, 
                title: loan.title,         
                borrowDate: new Date(loan.loandate).toISOString().split('T')[0],
                returnDate: new Date(loan.expectedreturndate).toISOString().split('T')[0]
            }))
        });
    } catch (error) {
        console.error('خطأ في جلب بيانات الملف الشخصي:', error);
        res.status(500).json({ success: false, message: 'حدث خطأ داخلي في خادم الباك إند.' });
    }
};