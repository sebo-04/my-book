const home = () => {
  return (
    <>
      <style>{`
        :root {
            --bg-color: #fdf5e6;
            --main-brown: #bc986a;
            --light-beige: #e2cca8;
            --dark-text: #3d2b1f;
        }

        body {
            background-color: var(--bg-color);
            margin: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: var(--dark-text);
        }

        .navbar {
            display: flex;
            justify-content: space-between;
            padding: 15px 5%;
            align-items: center;
        }

        .logo { font-size: 24px; font-weight: bold; }
        .user-icon { font-size: 35px; color: var(--main-brown); }

        .search-section {
            display: flex;
            justify-content: center;
            padding: 20px;
        }

        .search-box-container {
            background-color: var(--main-brown);
            width: 90%;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            background: linear-gradient(135deg, var(--main-brown) 70%, var(--light-beige) 70%);
        }

        .search-input-wrapper {
            position: relative;
            width: 60%;
            margin: 0 auto;
        }

        .search-input-wrapper input {
            width: 100%;
            padding: 12px 40px;
            border-radius: 25px;
            border: none;
            outline: none;
        }

        .search-input-wrapper i {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--main-brown);
        }

        .categories {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin: 20px 0;
        }

        .cat-tag {
            background: var(--light-beige);
            padding: 8px 25px;
            border-radius: 20px;
            border: 1px solid #000;
            cursor: pointer;
            font-size: 14px;
        }

        .filter-bar {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
            background-color: var(--light-beige);
            padding: 10px 20px;
            border-radius: 10px;
            border: 1px solid var(--dark-text);
        }

        .filter-item {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: bold;
        }

        .filter-item select {
            padding: 5px 10px;
            border-radius: 5px;
            border: 1px solid var(--dark-text);
            background-color: #fff;
        }

        .book-row-container {
            background: #fffdf9;
            margin: 20px auto;
            width: 95%;
            padding: 20px;
            border-radius: 30px;
            border: 1px solid #333;
            /* تم تعديلها لتظهر، يمكنك تعديلها برمجياً لـ none لاحقاً عند الحاجة */
            display: block; 
        }

        .books-grid, .results-grid {
            display: flex;
            gap: 15px;
            overflow-x: auto;
            padding: 10px;
        }

        /* بطاقة الكتاب */
        .book-card {
            min-width: 120px;
            background: var(--light-beige);
            border: 1px solid #555;
            padding: 10px;
            text-align: center;
            border-radius: 5px;
        }

        .book-cover {
            width: 100%;
            height: 140px;
            background: #ccc;
            margin-bottom: 5px;
            object-fit: cover;
        }

        .stars { color: #d4af37; font-size: 10px; margin-top: 5px; }
      `}
      </style>

      <meta charSet="UTF-8" />
      <title>My Books - الرئيسية</title>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />

      {/* الهيدر (الشعار والملف الشخصي) */}
      <header className="navbar">
        <div className="user-icon">
          <i className="fas fa-user-circle" />
        </div>
        <div className="logo">
          My Books <i className="fas fa-book-open" />
        </div>
      </header>

      {/* منطقة البحث الكبيرة */}
      <section className="search-section">
        <div className="search-box-container">
          <h2>ماذا سنقرأ اليوم؟</h2>
          <div className="search-input-wrapper">
            <input type="text" placeholder="ابحث عن كتابك المفضل..." />
            <i className="fas fa-search" />
          </div>
        </div>
      </section>

      {/* تصنيفات الكتب (الفئات) */}
      <nav className="categories">
        <span className="cat-tag">تقنية</span>
        <span className="cat-tag">علوم</span>
        <span className="cat-tag">روايات</span>
        <span className="cat-tag">تاريخ</span>
        <span className="cat-tag">أدب</span>
        <span className="cat-tag">دينية</span>
      </nav>

      {/* قسم "نتائج البحث" */}
      <section
        id="search-results-page"
        style={{ display: "none", padding: "20px 5%" }}
      >
        {/* خيارات التصفية والترتيب */}
        <div className="filter-bar">
          <div className="filter-item">
            <label>Availability:</label>
            <select id="filter-status">
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
          <div className="filter-item">
            <label>Sort by:</label>
            <select id="sort-order">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
        
        {/* شبكة عرض نتائج البحث */}
        <div className="results-grid" id="results-container">
          {/* البطاقات ستظهر هنا برمجياً */}
        </div>
      </section>

      {/* قسم "أحدث الكتب" */}
      <section className="book-row-container" id="latest-section">
        <h3>أحدث الكتب</h3>
        <div className="books-grid" id="latest-books">
          {/* ستظهر البطاقات هنا برمجياً */}
        </div>
      </section>

      {/* قسم "الأعلى تقييماً" */}
      <section className="book-row-container" id="top-rated-section">
        <h3>الكتب الأعلى تقييماً</h3>
        <div className="books-grid" id="top-rated-books">
          {/* ستظهر البطاقات هنا برمجياً */}
        </div>
      </section>
    </>
  );
};

export default home;