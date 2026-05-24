import { useState } from 'react';

export default function LibraryManager() {
  // 1. حالات التحكم بالتبويبات والواجهة (UI States)
  const [activeTab, setActiveTab] = useState('books-panel');

  // 2. البيانات التجريبية الابتدائية (Initial Mock Data)
  const [categories, setCategories] = useState([
    { id: 'CAT-01', name: 'روايات' },
    { id: 'CAT-02', name: 'ادبيات' },
    { id: 'CAT-03', name: 'دينية' }
  ]);

  const [books, setBooks] = useState([
    {
      id: 1,
      title: 'مقدمة في هندسة البرمجيات',
      author: 'د. أحمد خالد',
      year: 2023,
      desc: 'كتاب يشرح أساسيات الـ SRS ودورة حياة النظام.',
      categories: ['هندسة البرمجيات'],
      pdfName: 'software_eng.pdf',
      coverUrl: 'https://via.placeholder.com/45x60'
    }
  ]);

  const [copies, setCopies] = useState([
    { id: 'C-101', bookTitle: 'مقدمة في هندسة البرمجيات', condition: 'جديد', status: 'متاح' }
  ]);

  // 3. حالات النماذج (Form States)
  const [bookForm, setBookForm] = useState({
    id: '', title: '', author: '', year: '', desc: '', selectedCats: [], pdf: null, cover: null
  });
  const [copyForm, setCopyForm] = useState({ id: '', bookTitle: '', condition: 'جديد' });
  const [catForm, setCatForm] = useState({ id: '', name: '' });
  const [selectedCatsToDelete, setSelectedCatsToDelete] = useState([]);

  // حالات البحث للتصفية الفورية
  const [bookSearch, setBookSearch] = useState('');
  const [copySearch, setCopySearch] = useState('');

  // 4. معالجة أحداث النماذج (Form Handlers)
  
  // إدارة التصنيفات
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!catForm.id || !catForm.name) return;
    setCategories([...categories, { id: catForm.id, name: catForm.name }]);
    setCatForm({ id: '', name: '' });
  };

  const handleToggleCatDelete = (catName) => {
    if (selectedCatsToDelete.includes(catName)) {
      setSelectedCatsToDelete(selectedCatsToDelete.filter(c => c !== catName));
    } else {
      setSelectedCatsToDelete([...selectedCatsToDelete, catName]);
    }
  };

  const handleDeleteSelectedCategories = () => {
    setCategories(categories.filter(cat => !selectedCatsToDelete.includes(cat.name)));
    setSelectedCatsToDelete([]);
  };

  // دالة تنظيف نموذج الكتب
  const resetBookForm = () => {
    setBookForm({ id: '', title: '', author: '', year: '', desc: '', selectedCats: [], pdf: null, cover: null });
  };

  // إدارة الكتب (إضافة / تعديل)
  const handleBookSubmit = (e) => {
    e.preventDefault();
    if (bookForm.id) {
      // وضع التعديل (Edit Mode)
      setBooks(books.map(b => b.id === bookForm.id ? { ...bookForm } : b));
    } else {
      // وضع الإضافة الجديد - قمنا بفصل الـ Id هنا لتفادي مشكلة الـ Impure Function
      const generatedId = Date.now();
      
      const newBook = {
        id: generatedId,
        title: bookForm.title,
        author: bookForm.author,
        year: bookForm.year,
        desc: bookForm.desc,
        categories: bookForm.selectedCats, 
        coverUrl: bookForm.cover ? URL.createObjectURL(bookForm.cover) : 'https://via.placeholder.com/45x60',
        pdfName: bookForm.pdf ? bookForm.pdf.name : 'لم يتم رفع ملف'
      };
      setBooks([...books, newBook]);
    }
    resetBookForm(); // تنظيف الحقول فوراً بعد الإضافة أو التعديل
  };

  const handleEditBook = (book) => {
    setBookForm({
      id: book.id,
      title: book.title,
      author: book.author,
      year: book.year,
      desc: book.desc,
      selectedCats: book.categories || [],
      pdf: null,
      cover: null
    });
  };

  const handleDeleteBook = (id) => {
    setBooks(books.filter(b => b.id !== id));
  };

  // إدارة النسخ
  const handleCopySubmit = (e) => {
    e.preventDefault();
    if (!copyForm.id || !copyForm.bookTitle) return;
    
    // التحقق إذا كنا في حالة تعديل للنسخة أو إضافة
    const exists = copies.some(c => c.id === copyForm.id);
    if (exists) {
      setCopies(copies.map(c => c.id === copyForm.id ? { ...c, bookTitle: copyForm.bookTitle, condition: copyForm.condition } : c));
    } else {
      setCopies([...copies, { id: copyForm.id, bookTitle: copyForm.bookTitle, condition: copyForm.condition, status: 'متاح' }]);
    }
    setCopyForm({ id: '', bookTitle: '', condition: 'جديد' });
  };

  // تصفية المصفوفات بناءً على مدخلات البحث
  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(bookSearch.toLowerCase()) || 
    b.author.toLowerCase().includes(bookSearch.toLowerCase())
  );

  const filteredCopies = copies.filter(c => 
    c.bookTitle.toLowerCase().includes(copySearch.toLowerCase())
  );

  return (
    <div className="container" dir="rtl">
      {/* شريط التبويبات العلوي */}
      <nav className="tabs-header">
        <button
          className={`tab-btn ${activeTab === 'books-panel' ? 'active' : ''}`}
          onClick={() => setActiveTab('books-panel')}
        >
          إدارة الكتب
        </button>
        <button
          className={`tab-btn ${activeTab === 'copies-panel' ? 'active' : ''}`}
          onClick={() => setActiveTab('copies-panel')}
        >
          إدارة النسخ
        </button>
        <button
          className={`tab-btn ${activeTab === 'categories-panel' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories-panel')}
        >
          إدارة التصنيفات
        </button>
      </nav>

      <div className="tabs-content">
        
        {/* --- لوحة إدارة الكتب --- */}
        {activeTab === 'books-panel' && (
          <section id="books-panel" className="tab-panel active">
            <div className="form-container">
              <form onSubmit={handleBookSubmit}>
                <div className="form-grid">
                  <div>
                    <div className="form-group">
                      <label>اسم الكتاب</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="أدخل اسم الكتاب"
                        value={bookForm.title}
                        onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>اسم الكاتب</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="أدخل اسم الكاتب"
                        value={bookForm.author}
                        onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>تاريخ النشر (السنة)</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        placeholder="مثال: 2024"
                        value={bookForm.year}
                        onChange={(e) => setBookForm({ ...bookForm, year: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>الوصف</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="أكتب وصفاً مختصراً للكتاب..."
                        value={bookForm.desc}
                        onChange={(e) => setBookForm({ ...bookForm, desc: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="form-group">
                      <label>اختيار التصنيف (مستدعى من الداتابيس)</label>
                      <div className="checkbox-container-box">
                        {categories.map(cat => (
                          <label key={cat.id} className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={bookForm.selectedCats.includes(cat.name)}
                              onChange={() => {
                                const updated = bookForm.selectedCats.includes(cat.name)
                                  ? bookForm.selectedCats.filter(c => c !== cat.name)
                                  : [...bookForm.selectedCats, cat.name];
                                setBookForm({ ...bookForm, selectedCats: updated });
                              }}
                            />
                            {cat.name}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>ملف الكتاب (PDF)</label>
                      <div className="file-input-wrapper">
                        <button type="button" className="btn-custom btn-save" style={{ backgroundColor: "#A0713C" }}>
                          📄 اختر ملف PDF
                        </button>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setBookForm({ ...bookForm, pdf: e.target.files[0] })}
                        />
                      </div>
                      <span style={{ fontSize: 12, color: "#5A4531" }}>
                        {bookForm.pdf ? bookForm.pdf.name : (bookForm.id ? 'الملف الحالي محفوظ' : 'لم يتم اختيار ملف')}
                      </span>
                    </div>
                    <div className="form-group">
                      <label>صورة الغلاف</label>
                      <div className="file-input-wrapper">
                        <button type="button" className="btn-custom btn-save" style={{ backgroundColor: "#A0713C" }}>
                          📁 اختر صورة الغلاف
                        </button>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setBookForm({ ...bookForm, cover: e.target.files[0] })}
                        />
                      </div>
                      <span style={{ fontSize: 12, color: "#5A4531" }}>
                        {bookForm.cover ? bookForm.cover.name : 'لم يتم اختيار صورة'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="btn-action-group">
                  <button type="submit" className="btn-custom btn-save">
                    {bookForm.id ? 'تحديث الكتاب' : 'حفظ الكتاب'}
                  </button>
                  <button type="button" className="btn-custom btn-cancel" onClick={resetBookForm}>
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
            
            {/* شريط البحث عن الكتب */}
            <div className="search-container">
              <input
                type="text"
                className="search-control"
                placeholder="🔍 ابحث هنا باسم الكتاب أو الكاتب للتصفية الفورية المباشرة..."
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
              />
            </div>

            {/* جدول عرض الكتب الديناميكي */}
            <div className="table-responsive">
              {filteredBooks.length === 0 ? (
                <div className="no-data-msg">لا يوجد كتب تطابق بحثك حالياً</div>
              ) : (
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>الغلاف</th>
                      <th>اسم الكتاب</th>
                      <th>الكاتب</th>
                      <th>السنة</th>
                      <th>التصنيفات</th>
                      <th>ملف الـ PDF</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBooks.map(book => (
                      <tr key={book.id}>
                        <td><img src={book.coverUrl} alt="cover" className="table-img" /></td>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.year}</td>
                        <td>{book.categories ? book.categories.join('، ') : 'بدون تصنيف'}</td>
                        <td><span style={{ fontSize: 12 }}>{book.pdfName}</span></td>
                        <td>
                          <div className="table-actions">
                            <button className="btn-table btn-table-edit" onClick={() => handleEditBook(book)}>تعديل</button>
                            <button className="btn-table btn-table-delete" onClick={() => handleDeleteBook(book.id)}>حذف</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* --- لوحة إدارة النسخ --- */}
        {activeTab === 'copies-panel' && (
          <section id="copies-panel" className="tab-panel active">
            <div className="form-container" style={{ maxWidth: 500, margin: "0 auto 25px auto" }}>
              <form onSubmit={handleCopySubmit}>
                <div className="form-group">
                  <label>اسم الكتاب المرتبط بالنسخة</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="أدخل اسم الكتاب بدقة"
                    value={copyForm.bookTitle}
                    onChange={(e) => setCopyForm({ ...copyForm, bookTitle: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>رقم النسخة (ID / Barcode)</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="مثال: C-101"
                    value={copyForm.id}
                    onChange={(e) => setCopyForm({ ...copyForm, id: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>حالة جودة النسخة</label>
                  <select
                    className="form-control"
                    value={copyForm.condition}
                    onChange={(e) => setCopyForm({ ...copyForm, condition: e.target.value })}
                  >
                    <option>جديد</option>
                    <option>جيد</option>
                    <option>يحتاج صيانة</option>
                  </select>
                </div>
                <button type="submit" className="btn-custom btn-save" style={{ width: "100%", marginTop: 10 }}>
                  حفظ / إضافة نسخة
                </button>
              </form>
            </div>

            <div className="search-container">
              <input
                type="text"
                className="search-control"
                placeholder="🔍 اكتب اسم الكتاب هنا بدقة للبحث وعرض نسخه المتاحة..."
                value={copySearch}
                onChange={(e) => setCopySearch(e.target.value)}
              />
            </div>

            {/* جدول النسخ الديناميكي */}
            <div className="table-responsive">
              {filteredCopies.length === 0 ? (
                <div className="no-data-msg">لا توجد نسخ مضافة لهذا الكتاب حالياً</div>
              ) : (
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>رقم النسخة (Barcode)</th>
                      <th>الكتاب المرتبط</th>
                      <th>حالة جودة النسخة</th>
                      <th>التوافر في المخزن</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCopies.map(copy => (
                      <tr key={copy.id}>
                        <td>{copy.id}</td>
                        <td>{copy.bookTitle}</td>
                        <td>{copy.condition}</td>
                        <td><span className="status-badge status-available">{copy.status}</span></td>
                        <td>
                          <div className="table-actions">
                            <button className="btn-table btn-table-edit" onClick={() => setCopyForm({ id: copy.id, bookTitle: copy.bookTitle, condition: copy.condition })}>تعديل</button>
                            <button className="btn-table btn-table-delete" onClick={() => setCopies(copies.filter(c => c.id !== copy.id))}>حذف</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* --- لوحة إدارة التصنيفات --- */}
        {activeTab === 'categories-panel' && (
          <section id="categories-panel" className="tab-panel active">
            <div className="form-container" style={{ maxWidth: 500, margin: "0 auto 25px auto" }}>
              <form onSubmit={handleAddCategory}>
                <div className="form-group">
                  <label>رقم التصنيف</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="مثال: CAT-05"
                    value={catForm.id}
                    onChange={(e) => setCatForm({ ...catForm, id: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>اسم التصنيف</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="مثال: ذكاء اصطناعي"
                    value={catForm.name}
                    onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn-custom btn-save" style={{ width: "100%", marginTop: 10 }}>
                  اضافة التصنيف
                </button>
              </form>
            </div>

            <div className="form-container" style={{ maxWidth: 600, margin: "20px auto", border: "1px dashed #5A4531" }}>
              <h3 style={{ fontSize: 16, marginBottom: 15, textAlign: "center" }}>
                اختر التصنيفات التي ترغب في حذفها نهائياً:
              </h3>
              <div className="checkbox-container-box" style={{ maxHeight: 200 }}>
                {categories.map(cat => (
                  <label key={cat.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedCatsToDelete.includes(cat.name)}
                      onChange={() => handleToggleCatDelete(cat.name)}
                    />
                    {cat.name} ({cat.id})
                  </label>
                ))}
              </div>
              <button
                type="button"
                className="btn-custom btn-table-delete"
                style={{ width: "100%", marginTop: 15, padding: 12 }}
                onClick={handleDeleteSelectedCategories}
                disabled={selectedCatsToDelete.length === 0}
              >
                🗑️ حذف التصنيفات المحددة ({selectedCatsToDelete.length})
              </button>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}