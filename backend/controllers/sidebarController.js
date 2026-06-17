const pool = require('../config/db'); 
exports.getUserRole = async (req, res) => {
    try {
        const userId = req.headers['userid']; 
        if (!userId) {
            return res.status(400).json({ message: 'معرف المستخدم مطلوب!' });
        }
        const userQuery = await pool.query('SELECT usertype FROM users WHERE userid = $1', [userId]);
        if (userQuery.rows.length === 0) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }
        return res.status(200).json({ userType: userQuery.rows[0].usertype });
    } catch (error) {
        console.error('خطأ في جلب صلاحية المستخدم:', error.message);
        return res.status(500).json({ message: 'حدث خطأ في السيرفر' });
    }
};