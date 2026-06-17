const pool = require('../config/db');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const pdfParse = require('pdf-parse'); 
const getCleanLocalPath = (rawPath) => {
    if (!rawPath) return '';
    if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
        const fileName = rawPath.split('/').pop();
        return path.resolve(__dirname, '../../uploads', fileName);
    }
    return path.resolve(__dirname, '../../', rawPath);
};
const getBookDetailsForReading = async (req, res) => {
    const { id } = req.params;
    try {
        const bookQuery = `SELECT bookid, title, authorname, pdf_path FROM books WHERE bookid = $1`;
        const bookResult = await pool.query(bookQuery, [id]);
        if (bookResult.rows.length === 0) {
            return res.status(404).json({ message: 'الكتاب المطلوب غير موجود' });
        }
        const book = bookResult.rows[0];
        let totalPages = 1; 
        if (book.pdf_path) {
            const fullPdfPath = getCleanLocalPath(book.pdf_path);
            if (fs.existsSync(fullPdfPath)) {
                try {
                    const existingPdfBytes = fs.readFileSync(fullPdfPath);
                    const pdfDoc = await PDFDocument.load(existingPdfBytes, { 
                        updateMetadata: false,
                        ignoreEncryption: true 
                    });
                    totalPages = pdfDoc.getPageCount();
                } catch (pdfError) {
                    console.log("جاري استخراج عدد الصفحات الحقيقي عبر pdf-parse البديلة...");
                    try {
                        // المحاولة البديلة الحتمية لقراءة الـ Metadata الفعلي للملف
                        const dataBuffer = fs.readFileSync(fullPdfPath);
                        const parsedData = await pdfParse(dataBuffer);
                        totalPages = parsedData.numpages || 100;
                    } catch (parseErr) {
                        console.error("فشلت الواجهتان، تعيين قيمة افتراضية آمنة:", parseErr.message);
                        totalPages = 100; 
                    }
                }
            }
        }
        return res.status(200).json({
            bookid: book.bookid,
            title: book.title,
            author: book.authorname,
            totalPages: totalPages
        });
    } catch (error) {
        console.error('Error in getBookDetailsForReading:', error);
        return res.status(500).json({ message: 'خطأ خادم داخلي' });
    }
};
const getBookPageFile = async (req, res) => {
    const { id } = req.params;
    try {
        const bookQuery = `SELECT pdf_path FROM books WHERE bookid = $1`;
        const bookResult = await pool.query(bookQuery, [id]);
        if (bookResult.rows.length === 0 || !bookResult.rows[0].pdf_path) {
            return res.status(404).json({ message: 'ملف الكتاب غير متوفر' });
        }
        const fullPdfPath = getCleanLocalPath(bookResult.rows[0].pdf_path);
        if (!fs.existsSync(fullPdfPath)) {
            return res.status(404).json({ message: 'الملف غير موجود' });
        }
        res.contentType("application/pdf");
        return res.sendFile(fullPdfPath);
    } catch (error) {
        console.error('Error rendering pdf stream:', error);
        return res.status(500).json({ message: 'خطأ أثناء تحميل مستند القراءة' });
    }
};
const reserveBookCopy = async (req, res) => {
    const { id } = req.params; 
    const { userId } = req.body; 
    try {
        const checkAvailableCopyQuery = `SELECT copyid FROM copies WHERE bookid = $1 AND availabilitystatus = 'Available' LIMIT 1`;
        const copyCheck = await pool.query(checkAvailableCopyQuery, [id]);
        if (copyCheck.rows.length === 0) {
            return res.status(400).json({ message: 'عذراً، نفدت النسخ الورقية.' });
        }
        const availableCopyId = copyCheck.rows[0].copyid;
        await pool.query('BEGIN');
        await pool.query(`UPDATE copies SET availabilitystatus = 'Reserved' WHERE copyid = $1`, [availableCopyId]);
        const expectedReturnDate = new Date();
        expectedReturnDate.setDate(expectedReturnDate.getDate() + 7);
        await pool.query(`INSERT INTO loans (copyid, userid, expectedreturndate, status) VALUES ($1, $2, $3, 'Active')`, [availableCopyId, userId, expectedReturnDate]);
        await pool.query('COMMIT');
        return res.status(200).json({ message: 'تم حجز النسخة الورقية بنجاح!' });
    } catch (error) {
        await pool.query('ROLLBACK');
        return res.status(500).json({ message: 'حدث خطأ أثناء عملية الحجز' });
    }
};
module.exports = { getBookDetailsForReading, getBookPageFile, reserveBookCopy };