const pool = require('../config/db');
exports.getUsers = async (req, res) => {
    try {
        const { search, filter } = req.query;
        let query = `SELECT UserID, RegistrationNumber, UserName, Email, UserType, IsBanned, CreatedAt FROM Users WHERE 1=1`;
        let params = [];
        let paramIndex = 1;
        if (search && search.trim() !== '') {
            query += ` AND UserName ILIKE $${paramIndex}`;
            params.push(`%${search}%`);
            paramIndex++;
        }
        if (filter === 'banned') {
            query += ` AND IsBanned = TRUE`;
        } else if (filter === 'active') {
            query += ` AND IsBanned = FALSE`;
        }
        query += ` ORDER BY CreatedAt DESC`;
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error("Error in getUsers:", error);
        res.status(500).json({ message: 'حدث خطأ في السيرفر أثناء جلب المستخدمين' });
    }
};
exports.toggleUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentRole } = req.body;
        const newRole = currentRole === 'Admin' ? 'Reader' : 'Admin';
        await pool.query('UPDATE Users SET UserType = $1 WHERE UserID = $2', [newRole, id]);
        res.json({ newRole });
    } catch (error) {
        console.error("Error in toggleUserRole:", error);
        res.status(500).json({ message: 'فشل تحديث صلاحية المستخدم' });
    }
};
exports.toggleUserBan = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentStatus } = req.body;
        const newStatus = !currentStatus; 
        await pool.query('UPDATE Users SET IsBanned = $1 WHERE UserID = $2', [newStatus, id]);
        res.json({ newStatus });
    } catch (error) {
        console.error("Error in toggleUserBan:", error);
        res.status(500).json({ message: 'فشل تحديث حالة حظر المستخدم' });
    }
};
exports.getLoans = async (req, res) => {
    try {
        const { search, filter } = req.query;
        let query = `
            SELECT 
                l.LoanID AS id,
                u.UserName AS borrower,
                b.Title AS title,
                l.LoanDate AS dateout,
                l.ExpectedReturnDate AS datein,
                c.AvailabilityStatus AS copy_status,
                l.Status AS loan_status,
                c.CopyID
            FROM Loans l
            JOIN Copies c ON l.CopyID = c.CopyID
            JOIN Books b ON c.BookID = b.BookID
            JOIN Users u ON l.UserID = u.UserID
            WHERE l.Status IN ('Active', 'Overdue', 'Pending', 'Reserved')
        `;
        let params = [];
        let paramIndex = 1;
        if (search && search.trim() !== '') {
            query += ` AND b.Title ILIKE $${paramIndex}`;
            params.push(`%${search}%`);
            paramIndex++;
        }
        const result = await pool.query(query, params);
        const mappedLoans = result.rows.map(row => {
            let status = 'borrowed';
            let badgeText = 'مستعارة';
            let approved = true;
            if (new Date(row.datein) < new Date() && row.copy_status === 'Borrowed') {
                status = 'late';
                badgeText = 'متأخرة';
            } 
            else if (row.copy_status === 'Richmond' || row.copy_status === 'Reserved' || row.loan_status === 'Pending' || row.loan_status === 'Reserved') {
                status = 'reserved';
                badgeText = 'محجوزة';
                approved = false;
            }
            return {
                id: row.id,
                borrower: row.borrower,
                title: row.title,
                status: status,
                badgeText: badgeText,
                dateOut: row.dateout,
                dateIn: row.datein,
                approved: approved
              };
        });
        let filteredLoans = mappedLoans;
        if (filter === 'reserved') {
            filteredLoans = mappedLoans.filter(l => l.status === 'reserved');
        } else if (filter === 'borrowed') {
            filteredLoans = mappedLoans.filter(l => l.status === 'borrowed');
        } else if (filter === 'late') {
            filteredLoans = mappedLoans.filter(l => l.status === 'late');
        }
        res.json(filteredLoans);
    } catch (error) {
        console.error("Error in getLoans:", error);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب سجلات الإعارة' });
    }
};
exports.approveLoan = async (req, res) => {
    try {
        const { id } = req.params;
        const loanCheck = await pool.query('SELECT CopyID FROM Loans WHERE LoanID = $1', [id]);
        if (loanCheck.rows.length === 0) {
            return res.status(404).json({ message: 'سجل الإعارة غير موجود' });
        }
        const copyId = loanCheck.rows[0].copyid;
        await pool.query('BEGIN');
        await pool.query("UPDATE Copies SET AvailabilityStatus = 'Borrowed' WHERE CopyID = $1", [copyId]);
        await pool.query("UPDATE Loans SET Status = 'Active' WHERE LoanID = $1", [id]);
        await pool.query('COMMIT');
        res.json({ message: 'تمت الموافقة وتغيير حالة الكتاب بنجاح إلى مستعار' });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("Error in approveLoan:", error);
        res.status(500).json({ message: 'فشل تأكيد عملية الإعارة بسبب خطأ في السيرفر' });
    }
};
exports.deleteLoan = async (req, res) => {
    try {
        const { id } = req.params;
        const loanCheck = await pool.query('SELECT CopyID FROM Loans WHERE LoanID = $1', [id]);
        if (loanCheck.rows.length === 0) {
            return res.status(404).json({ message: 'سجل الإعارة غير موجود مسبقاً' });
        }
        const copyId = loanCheck.rows[0].copyid;
        await pool.query('BEGIN');
        await pool.query('DELETE FROM Loans WHERE LoanID = $1', [id]);
        await pool.query("UPDATE Copies SET AvailabilityStatus = 'Available' WHERE CopyID = $1", [copyId]);
        await pool.query('COMMIT');
        res.json({ message: 'تم استلام الكتاب وحذف العملية وإتاحة النسخة بنجاح' });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("Error in deleteLoan:", error);
        res.status(500).json({ message: 'فشل حذف الإعارة وإتاحة الكتاب' });
    }
};