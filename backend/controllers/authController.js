const pool = require('../config/db');
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
            const checkEmailQuery = 'SELECT * FROM users WHERE email = $1';
        const emailCheckResult = await pool.query(checkEmailQuery, [email]);
        if (emailCheckResult.rows.length > 0) {
            return res.status(400).json({ message: 'البريد الإلكتروني مسجل بالفعل بحساب آخر' });
        }
      const countQuery = 'SELECT COALESCE(MAX(registrationnumber), -1) + 1 AS next_reg FROM users';
        const countResult = await pool.query(countQuery);
        const nextRegistrationNumber = countResult.rows[0].next_reg;
         const insertUserQuery = `
            INSERT INTO users (username, email, password, usertype, registrationnumber)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING userid, username, email, usertype, registrationnumber;
        `;
        const values = [username, email, password, 'Reader', nextRegistrationNumber];
        const newUserResult = await pool.query(insertUserQuery, values);
        return res.status(201).json({
            message: 'تم إنشاء الحساب بنجاح!',
            user: newUserResult.rows[0]
        });
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ message: 'حدث خطأ في الخادم أثناء إنشاء الحساب' });
    }
};
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const findUserQuery = 'SELECT * FROM users WHERE email = $1 AND password = $2';
        const result = await pool.query(findUserQuery, [email, password]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }
        const user = result.rows[0];
        if (user.isbanned) {
            return res.status(403).json({ message: 'هذا الحساب محظور من قبل الإدارة' });
        }
        return res.status(200).json({
            message: 'تم تسجيل الدخول بنجاح',
            user: {
                id: user.userid,
                username: user.username,
                email: user.email,
                role: user.usertype
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'حدث خطأ في الخادم أثناء تسجيل الدخول' });
    }
};