const pool = require('../config/db');
exports.getDashboardStatistics = async (req, res) => {
    try {
        const totalBooksResult = await pool.query('SELECT COUNT(*) AS total FROM Books;');
        const totalBooks = parseInt(totalBooksResult.rows[0].total) || 0;
        const totalUsersResult = await pool.query('SELECT COUNT(*) AS total FROM Users;');
        const totalUsers = parseInt(totalUsersResult.rows[0].total) || 0;
        const activeLoansResult = await pool.query(
            "SELECT COUNT(*) AS total FROM Copies WHERE AvailabilityStatus = 'Borrowed';"
        );
        const activeLoans = parseInt(activeLoansResult.rows[0].total) || 0;
        const lateLoansResult = await pool.query(
            "SELECT COUNT(*) AS total FROM Loans WHERE Status = 'Overdue';"
        );
        const lateLoans = parseInt(lateLoansResult.rows[0].total) || 0;
        const currentYear = new Date().getFullYear();
        const chartQuery = `
            SELECT EXTRACT(MONTH FROM LoanDate) AS month_num, COUNT(*) AS loan_count
            FROM Loans
            WHERE EXTRACT(YEAR FROM LoanDate) = $1
            GROUP BY month_num
            ORDER BY month_num;
        `;
        const chartResult = await pool.query(chartQuery, [currentYear]);
        const chartData = Array(12).fill(0);
        chartResult.rows.forEach(row => {
            const monthIndex = parseInt(row.month_num) - 1; 
            if (monthIndex >= 0 && monthIndex < 12) {
                chartData[monthIndex] = parseInt(row.loan_count);
            }
        });
        return res.status(200).json({
            success: true,
            statsData: {
                lateLoans,
                activeLoans,
                totalUsers,
                totalBooks
            },
            chartData
        });
    } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
        return res.status(500).json({
            success: false,
            message: 'حدث خطأ في السيرفر أثناء جلب الإحصائيات.'
        });
    }
};