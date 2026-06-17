const pool = require('../config/db');
exports.getAllBooks = async (req, res) => {
  try {
    const { search } = req.query;
    let queryParams = [];
    let sql = `
      SELECT 
        b."bookid" AS id,
        b."title",
        b."authorname" AS author,
        b."publishyear" AS year,
        b."description" AS desc,
        b."cover_image" AS "coverUrl",
        b."pdf_path" AS "pdfName",
        b."createdat",
        COALESCE(JSON_AGG(DISTINCT c."categoryname") FILTER (WHERE c."categoryname" IS NOT NULL), '[]') AS categories,
        COUNT(DISTINCT cp."copyid")::int AS "copiesCount",
        (ROW_NUMBER() OVER (ORDER BY b."createdat" ASC)) - 1 AS "displayId"
      FROM Books b
      LEFT JOIN Book_Categories bc ON b."bookid" = bc."bookid"
      LEFT JOIN Categories c ON bc."categoryid" = c."categoryid"
      LEFT JOIN Copies cp ON b."bookid" = cp."bookid"
    `;
    if (search) {
      sql += ` WHERE b."title" ILIKE $1 OR b."authorname" ILIKE $1`;
      queryParams.push(`%${search}%`);
    }
    sql += ` GROUP BY b."bookid" ORDER BY b."createdat" ASC`;
    const result = await pool.query(sql, queryParams);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الكتب' });
  }
};
exports.createBook = async (req, res) => {
  const { title, author, year, desc, selectedCats } = req.body;
  const cover_image = req.files && req.files['cover'] ? `http://localhost:3030/uploads/${req.files['cover'][0].filename}` : 'https://via.placeholder.com/45x60';
  const pdf_path = req.files && req.files['pdf'] ? `http://localhost:3030/uploads/${req.files['pdf'][0].filename}` : null;
  const validatedYear = year && !isNaN(parseInt(year)) ? parseInt(year) : 2026;
  try {
    const checkDuplicate = await pool.query(
      `SELECT * FROM Books WHERE LOWER("title") = LOWER($1) AND LOWER("authorname") = LOWER($2)`,
      [title, author]
    );
    if (checkDuplicate.rows.length > 0) {
      return res.status(400).json({ error: 'هذا الكتاب موجود مسبقاً لنفس الكاتب!' });
    }
    const newBookResult = await pool.query(
      `INSERT INTO Books ("title", "authorname", "publishyear", "description", "pdf_path", "cover_image") 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, author, validatedYear, desc, pdf_path, cover_image]
    );
    const newBook = newBookResult.rows[0];
    if (selectedCats) {
      const parsedCats = typeof selectedCats === 'string' ? JSON.parse(selectedCats) : selectedCats;
      for (const catName of parsedCats) {
        const catResult = await pool.query(`SELECT "categoryid" FROM Categories WHERE "categoryname" = $1`, [catName]);
        if (catResult.rows.length > 0) {
          await pool.query(
            `INSERT INTO Book_Categories ("bookid", "categoryid") VALUES ($1, $2)`,
            [newBook.bookid, catResult.rows[0].categoryid]
          );
        }
      }
    }
    res.status(201).json({ message: 'تم إضافة الكتاب بنجاح' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'حدث خطأ أثناء إضافة الكتاب' });
  }
};
exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author } = req.body;
  try {
    const result = await pool.query(
      `UPDATE Books SET "title" = $1, "authorname" = $2, "updatedat" = CURRENT_TIMESTAMP WHERE "bookid" = $3 RETURNING *`,
      [title, author, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'الكتاب غير موجود' });
    res.status(200).json({ message: 'تم تعديل الكتاب بنجاح' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'حدث خطأ أثناء تعديل الكتاب' });
  }
};
exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`DELETE FROM Books WHERE "bookid" = $1 RETURNING *`, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'الكتاب غير موجود' });
    res.status(200).json({ message: 'تم حذف الكتاب بنجاح' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'حدث خطأ أثناء حذف الكتاب' });
  }
};
exports.getAllCategories = async (req, res) => {
  try {
    const result = await pool.query(`SELECT "categoryid" AS id, "categoryname" AS name FROM Categories ORDER BY "createdat" DESC`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب التصنيفات' });
  }
};
exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const checkDuplicate = await pool.query(`SELECT * FROM Categories WHERE LOWER("categoryname") = LOWER($1)`, [name]);
    if (checkDuplicate.rows.length > 0) return res.status(400).json({ error: 'التصنيف موجود مسبقاً!' });
    const result = await pool.query(`INSERT INTO Categories ("categoryname") VALUES ($1) RETURNING *`, [name]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'حدث خطأ أثناء إضافة التصنيف' });
  }
};
exports.deleteCategories = async (req, res) => {
  const { names } = req.body;
  try {
    await pool.query(`DELETE FROM Categories WHERE "categoryname" = ANY($1)`, [names]);
    res.status(200).json({ message: 'تم حذف التصنيفات بنجاح' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'حدث خطأ أثناء حذف التصنيفات' });
  }
};
exports.getCopiesByBook = async (req, res) => {
  const { bookTitle } = req.query;
  try {
    if (!bookTitle) return res.status(200).json([]);
    const sql = `
      SELECT c."copyid" AS id, b."title" AS "bookTitle", c."copycondition" AS condition, c."availabilitystatus" AS status
      FROM Copies c JOIN Books b ON c."bookid" = b."bookid"
      WHERE b."title" ILIKE $1
    `;
    const result = await pool.query(sql, [`%${bookTitle}%`]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب النسخ' });
  }
};
exports.createCopy = async (req, res) => {
  const { bookTitle, condition } = req.body;
  try {
    const bookResult = await pool.query(`SELECT "bookid" FROM Books WHERE LOWER("title") = LOWER($1)`, [bookTitle]);
    if (bookResult.rows.length === 0) return res.status(404).json({ error: 'اسم الكتاب غير موجود!' });
    await pool.query(`INSERT INTO Copies ("bookid", "copycondition") VALUES ($1, $2)`, [bookResult.rows[0].bookid, condition]);
    res.status(201).json({ message: 'تم إضافة النسخة بنجاح' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'حدث خطأ أثناء إضافة النسخة' });
  }
};
exports.updateCopy = async (req, res) => {
  const { id } = req.params;
  const { condition } = req.body;
  try {
    await pool.query(`UPDATE Copies SET "copycondition" = $1 WHERE "copyid" = $2`, [condition, id]);
    res.status(200).json({ message: 'تم تحديل النسخة' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'خطأ في التعديل' });
  }
};
exports.deleteCopy = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM Copies WHERE "copyid" = $1`, [id]);
    res.status(200).json({ message: 'تم الحذف' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'خطأ في الحذف' });
  }
};