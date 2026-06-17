import { useState, useEffect } from 'react';
const API_BASE_URL = 'http://localhost:3030/api/library';
export default function LibraryManager() {
  const [activeTab, setActiveTab] = useState('books-panel');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [copies, setCopies] = useState([]);
  const [bookForm, setBookForm] = useState({
    id: '', title: '', author: '', year: '', desc: '', selectedCats: [], pdf: null, cover: null
  });
  const [copyForm, setCopyForm] = useState({ id: '', bookTitle: '', condition: 'جديد' });
  const [catForm, setCatForm] = useState({ name: '' });
  const [selectedCatsToDelete, setSelectedCatsToDelete] = useState([]);
  const [bookSearch, setBookSearch] = useState('');
  const [copySearch, setCopySearch] = useState('');
  const translateConditionToArabic = (engCondition) => {
    switch (engCondition) {
      case 'Excellent': return 'جديد';
      case 'Good': return 'جيد';
      case 'Poor': return 'يحتاج صيانة';
      default: return engCondition || 'جديد';
    }
  };
  const translateConditionToEnglish = (arabicCondition) => {
    switch (arabicCondition) {
      case 'جديد': return 'Excellent';
      case 'جيد': return 'Good';
      case 'يحتاج صيانة': return 'Poor';
      default: return 'Excellent';
    }
  };
  const translateStatusToArabic = (engStatus) => {
    switch (engStatus) {
      case 'Available': return 'متاح';
      case 'Reserved': return 'محجوز';
      case 'Borrowed': return 'مستعارة'; 
      default: return engStatus || 'متاح';
    }
  };
  useEffect(() => {
    fetchBooksAndCategories();
  }, []);
  const fetchBooksAndCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const [bookRes, catRes] = await Promise.all([
        fetch(`${API_BASE_URL}/books`),
        fetch(`${API_BASE_URL}/categories`)
      ]);
      if (bookRes.ok) setBooks(await bookRes.json());
      if (catRes.ok) setCategories(await catRes.json());
    } catch (err) {
      setError('فشل الاتصال بالسيرفر، تأكدي من تشغيل السيرفر على منفذ 3030.');
    } finally {
      setLoading(false);
    }
  };
  const handleSearchCopies = async () => {
    if (!copySearch.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/copies?bookTitle=${encodeURIComponent(copySearch.trim())}`);
      if (res.ok) {
        setCopies(await res.json());
      } else {
        setCopies([]);
      }
    } catch (err) {
      alert('خطأ أثناء جلب النسخ');
    } finally {
      setLoading(false);
    }
  };
  const handleAddCategory = async (e) => {
    e.preventDefault(); 
    if (!catForm.name.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: catForm.name.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        setCatForm({ name: '' });
        fetchBooksAndCategories();
      } else {
        alert(data.error || 'خطأ في إضافة التصنيف');
      }
    } catch (err) {
      alert('فشل الاتصال بالسيرفر');
    }
  };
  const handleDeleteSelectedCategories = async () => {
    if (selectedCatsToDelete.length === 0) return;
    if (!window.confirm('هل تريدين حذف التصنيفات المحددة؟')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/categories/bulk`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names: selectedCatsToDelete })
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedCatsToDelete([]);
        fetchBooksAndCategories();
      } else {
        alert(data.error || 'فشل الحذف');
      }
    } catch (err) {
      alert('خطأ في الشبكة');
    }
  };
  const handleBookSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', bookForm.title);
    formData.append('author', bookForm.author);
    formData.append('year', bookForm.year);
    formData.append('desc', bookForm.desc);
    formData.append('selectedCats', JSON.stringify(bookForm.selectedCats));
    if (bookForm.pdf) formData.append('pdf', bookForm.pdf);
    if (bookForm.cover) formData.append('cover', bookForm.cover);
    try {
      let res;
      if (bookForm.id) {
        res = await fetch(`${API_BASE_URL}/books/${bookForm.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: bookForm.title, author: bookForm.author })
        });
      } else {
        res = await fetch(`${API_BASE_URL}/books`, { method: 'POST', body: formData });
      }
      const data = await res.json();
      if (res.ok) {
        setBookForm({ id: '', title: '', author: '', year: '', desc: '', selectedCats: [], pdf: null, cover: null });
        fetchBooksAndCategories();
      } else {
        alert(data.error || 'حدث خطأ أثناء حفظ الكتاب');
      }
    } catch (err) {
      alert('خطأ في الاتصال بالشبكة');
    }
  };
  const handleDeleteBook = async (id) => {
    if (!window.confirm('هل أنتِ متأكدة من حذف هذا الكتاب نهائياً؟')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/books/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        fetchBooksAndCategories();
      } else {
        alert(data.error || 'فشل حذف الكتاب');
      }
    } catch (err) {
      alert('خطأ اتصال بالسيرفر');
    }
  };
  const handleCopySubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      const cleanCondition = translateConditionToEnglish(copyForm.condition);
      if (copyForm.id) {
        res = await fetch(`${API_BASE_URL}/copies/${copyForm.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ condition: cleanCondition })
        });
      } else {
        res = await fetch(`${API_BASE_URL}/copies`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookTitle: copyForm.bookTitle, condition: cleanCondition })
        });
      }
      const data = await res.json();
      if (res.ok) {
        setCopyForm({ id: '', bookTitle: '', condition: 'جديد' });
        if (copySearch) handleSearchCopies();
      } else {
        alert(data.error || 'فشل حفظ النسخة، يرجى التثبت من مطابقة اسم الكتاب.');
      }
    } catch (err) {
      alert('خطأ شبكة');
    }
  };
  const handleDeleteCopy = async (id) => {
    if (!window.confirm('هل تريدين حذف هذه النسخة؟')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/copies/${id}`, { method: 'DELETE' });
      if (res.ok) {
        handleSearchCopies();
      }
    } catch (err) {
      alert('خطأ حذف النسخة');
    }
  };
  const filteredBooks = books.filter(b => 
    (b.title && b.title.toLowerCase().includes(bookSearch.toLowerCase())) ||
    (b.author && b.author.toLowerCase().includes(bookSearch.toLowerCase()))
  );
  return (
    <div className="container" dir="rtl">
      <style>{`
        .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FDF4DB; min-height: 100vh; padding: 30px 20px; color: #5A4531; box-sizing: border-box; }
        .tabs-header { display: flex; justify-content: flex-start; margin-bottom: 0; padding-right: 40px; }
        .tab-btn { background: #C4A47A; color: #FDF4DB; border: 1px solid #A88960; border-bottom: none; padding: 10px 35px; font-size: 16px; font-weight: bold; cursor: pointer; transform: skewX(-20deg); margin-left: -10px; border-top-left-radius: 8px; border-top-right-radius: 8px; transition: all 0.2s ease; }
        .tab-btn > * { transform: skewX(20deg); }
        .tab-btn.active { background: #E4CBB4; color: #5A4531; z-index: 2; border-color: #5A4531; }
        .form-container { background-color: #E4CBB4; border: 2px solid #5A4531; border-radius: 15px; padding: 25px; box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.15); margin-bottom: 30px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .form-group { display: flex; align-items: center; margin-bottom: 15px; justify-content: flex-end; }
        .form-group label { font-size: 16px; font-weight: bold; width: 140px; text-align: right; margin-left: 15px; }
        .form-control { flex: 1; background-color: #FFFFFF; border: 2px solid #5A4531; border-radius: 25px; padding: 8px 20px; font-size: 14px; outline: none; }
        .checkbox-container-box { flex: 1; display: flex; flex-direction: column; gap: 8px; max-height: 120px; overflow-y: auto; }
        .checkbox-label { display: flex; align-items: center; gap: 10px; font-size: 15px; cursor: pointer; }
        .btn-custom { background: linear-gradient(to bottom, #A47644, #875A2E); color: #FFF; border: 2px solid #5A4531; border-radius: 12px; padding: 10px 24px; font-size: 15px; font-weight: bold; cursor: pointer; }
        .btn-action-group { display: flex; gap: 15px; margin-top: 20px; }
        .search-container { position: relative; margin-bottom: 20px; display: flex; gap: 10px; align-items: center; }
        .search-control { width: 100%; background-color: #FFFFFF; border: 2px solid #5A4531; border-radius: 25px; padding: 10px 25px; font-size: 15px; outline: none; }
        .custom-table { width: 100%; border-collapse: collapse; background-color: #ECCBB3; border: 2px solid #5A4531; text-align: center; }
        .custom-table th { background-color: #936433; color: #FFFFFF; padding: 12px; border: 1px solid #5A4531; }
        .custom-table td { padding: 10px; border: 1px solid #5A4531; color: #4A3622; }
        .status-badge { padding: 4px 15px; border-radius: 15px; font-weight: bold; }
        .status-available { background-color: #C3E6CB; color: #155724; } 
        .status-reserved { background-color: #FFEBAA; color: #856404; }  
        .status-borrowed { background-color: #F8D7DA; color: #721C24; }
        .status-bar { background-color: #936433; color: white; padding: 10px; border-radius: 8px; margin-bottom: 15px; text-align: center; }
        .btn-table { background: linear-gradient(to bottom, #A17646, #80572F); color: #FFF; border: 1px solid #5A4531; border-radius: 10px; padding: 3px 15px; cursor: pointer; }
      `}</style>
      {loading && <div className="status-bar">جاري التحديث والمزامنة مع قاعدة البيانات النشطة...</div>}
      {error && <div className="status-bar" style={{ backgroundColor: '#721C24' }}>{error}</div>}
      <nav className="tabs-header">
        <button className={`tab-btn ${activeTab === 'books-panel' ? 'active' : ''}`} onClick={() => setActiveTab('books-panel')}>
          <div>إدارة الكتب</div>
        </button>
        <button className={`tab-btn ${activeTab === 'copies-panel' ? 'active' : ''}`} onClick={() => setActiveTab('copies-panel')}>
          <div>إدارة النسخ</div>
        </button>
        <button className={`tab-btn ${activeTab === 'categories-panel' ? 'active' : ''}`} onClick={() => setActiveTab('categories-panel')}>
          <div>إدارة التصنيفات</div>
        </button>
      </nav>
      <div className="tabs-content">
        {activeTab === 'books-panel' && (
          <section>
            <div className="form-container">
              <form onSubmit={handleBookSubmit}>
                <div className="form-grid">
                  <div>
                    <div className="form-group">
                      <label>اسم الكتاب</label>
                      <input type="text" className="form-control" required value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>اسم الكاتب</label>
                      <input type="text" className="form-control" required value={bookForm.author} onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>سنة النشر</label>
                      <input type="number" className="form-control" value={bookForm.year} onChange={(e) => setBookForm({ ...bookForm, year: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>الوصف</label>
                      <textarea className="form-control" value={bookForm.desc} onChange={(e) => setBookForm({ ...bookForm, desc: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <div className="form-group">
                      <label>اختيار التصنيف</label>
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
                    {!bookForm.id && (
                      <div className="form-group" style={{ flexDirection: 'column', gap: '10px' }}>
                        <input type="file" accept=".pdf" onChange={(e) => setBookForm({ ...bookForm, pdf: e.target.files[0] })} />
                        <input type="file" accept="image/*" onChange={(e) => setBookForm({ ...bookForm, cover: e.target.files[0] })} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="btn-action-group">
                  <button type="submit" className="btn-custom">{bookForm.id ? 'تعديل الكتاب (العنوان والكاتب)' : 'حفظ الكتاب بالداتابيز'}</button>
                  <button type="button" className="btn-custom" style={{ background: '#721C1C' }} onClick={() => setBookForm({ id: '', title: '', author: '', year: '', desc: '', selectedCats: [], pdf: null, cover: null })}>إلغاء</button>
                </div>
              </form>
            </div>
            <div className="search-container">
              <input type="text" className="search-control" placeholder="بحث فوري باسم الكتاب أو الكاتب..." value={bookSearch} onChange={(e) => setBookSearch(e.target.value)} />
            </div>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>إجراءات</th>
                  <th>ID الكتاب</th>
                  <th>اسم الكتاب</th>
                  <th>الكاتب</th>
                  <th>السنة</th>
                  <th>التصنيفات</th>
                  <th>عدد النسخ الحالي</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map(book => (
                  <tr key={book.id}>
                    <td>
                      <button className="btn-table" onClick={() => setBookForm({ ...bookForm, id: book.id, title: book.title, author: book.author })}>تعديل</button>
                      <button className="btn-table" style={{ background: '#721C1C', marginRight: '5px' }} onClick={() => handleDeleteBook(book.id)}>حذف</button>
                    </td>
                    <td>{book.id}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.year}</td>
                    <td>{Array.isArray(book.categories) ? book.categories.join('، ') : 'بدون تصنيف'}</td>
                    <td>{book.copiesCount || 0} نسخة</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
        {activeTab === 'copies-panel' && (
          <section>
            <div className="form-container" style={{ maxWidth: 500, margin: '0 auto 20px auto' }}>
              <form onSubmit={handleCopySubmit}>
                <div className="form-group">
                  <label>اسم الكتاب </label>
                  <input type="text" className="form-control" required disabled={!!copyForm.id} placeholder="يجب أن يطابق اسم كتاب موجود في النظام" value={copyForm.bookTitle} onChange={(e) => setCopyForm({ ...copyForm, bookTitle: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>حالة النسخة</label>
                  <select className="form-control" value={copyForm.condition} onChange={(e) => setCopyForm({ ...copyForm, condition: e.target.value })}>
                    <option>جديد</option>
                    <option>جيد</option>
                    <option>يحتاج صيانة</option>
                  </select>
                </div>
                <button type="submit" className="btn-custom" style={{ width: '100%' }}>{copyForm.id ? 'تحديث حالة النسخة' : 'إضافة نسخة جديدة للكتاب'}</button>
              </form>
            </div>
            <div className="search-container" style={{ maxWidth: 500, margin: '20px auto' }}>
              <input type="text" className="search-control" placeholder="اكتبي اسم الكتاب للبحث عن نسخه..." value={copySearch} onChange={(e) => setCopySearch(e.target.value)} />
              <button type="button" className="btn-custom" onClick={handleSearchCopies}>بحث عن النسخ</button>
            </div>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>إجراءات</th>
                  <th>ID النسخة</th>
                  <th>اسم الكتاب</th>
                  <th>الجودة الفنية</th>
                  <th>حالة التوفر</th>
                </tr>
              </thead>
              <tbody>
                {copies.map(copy => (
                  <tr key={copy.id}>
                    <td>
                       <button className="btn-table" onClick={() => setCopyForm({ id: copy.id, bookTitle: copy.bookTitle, condition: translateConditionToArabic(copy.condition) })}>تعديل النسخة</button>
                      <button className="btn-table" style={{ background: '#721C1C', marginRight: '5px' }} onClick={() => handleDeleteCopy(copy.id)}>حذف</button>
                    </td>
                    <td>{copy.id}</td>
                    <td>{copy.bookTitle}</td>
                    <td>{translateConditionToArabic(copy.condition)}</td>
                    <td>
                      <span className={`status-badge ${
                        copy.status === 'Available' ? 'status-available' : 
                        copy.status === 'Reserved' ? 'status-reserved' : 
                        copy.status === 'Borrowed' ? 'status-borrowed' : 'status-available'
                      }`}>
                        {translateStatusToArabic(copy.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
        {activeTab === 'categories-panel' && (
          <section>
            <div className="form-container" style={{ maxWidth: 500, margin: '0 auto 20px auto' }}>
              <form onSubmit={handleAddCategory}>
                <div className="form-group">
                  <label>اسم التصنيف</label>
                  <input type="text" className="form-control" required placeholder="مثال: هندسة برمجيات" value={catForm.name} onChange={(e) => setCatForm({ name: e.target.value })} />
                </div>
                <button type="submit" className="btn-custom" style={{ width: '100%' }}>إضافة التصنيف</button>
              </form>
            </div>
            <div className="form-container" style={{ maxWidth: 500, margin: '20px auto', border: '2px dashed #5A4531' }}>
              <h3 style={{ fontSize: 16, marginBottom: 10, textAlign: 'center' }}>حذف تصنيفات محددة دفعة واحدة:</h3>
              <div className="checkbox-container-box">
                {categories.map(cat => (
                  <label key={cat.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedCatsToDelete.includes(cat.name)}
                      onChange={() => {
                        const updated = selectedCatsToDelete.includes(cat.name)
                          ? selectedCatsToDelete.filter(c => c !== cat.name)
                          : [...selectedCatsToDelete, cat.name];
                        setSelectedCatsToDelete(updated);
                      }}
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
              <button type="button" className="btn-custom" style={{ width: '100%', marginTop: '15px', background: '#721C1C' }} onClick={handleDeleteSelectedCategories} disabled={selectedCatsToDelete.length === 0}>
                حذف المحدد نهائياً ({selectedCatsToDelete.length})
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}