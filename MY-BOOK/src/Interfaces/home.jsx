import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const API_URL = 'http://localhost:3030';
const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [latestBooks, setLatestBooks] = useState([]);
  const [topRatedBooks, setTopRatedBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('newest'); 
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  useEffect(() => {
    fetch(`${API_URL}/api/books/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Error fetching categories:', err));
    fetch(`${API_URL}/api/books/latest`)
      .then(res => res.json())
      .then(data => setLatestBooks(data))
      .catch(err => console.error('Error fetching latest books:', err));
    fetch(`${API_URL}/api/books/top-rated`)
      .then(res => res.json())
      .then(data => setTopRatedBooks(data))
      .catch(err => console.error('Error fetching top rated books:', err));
  }, []);
  useEffect(() => {
    if (searchQuery.trim() === '' && !selectedCategory) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    let url = `${API_URL}/api/books/search?query=${encodeURIComponent(searchQuery)}&sort=${sortBy}`;
    if (selectedCategory) {
      url += `&categoryId=${selectedCategory}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => setSearchResults(data))
      .catch(err => console.error('Error during search:', err));
  }, [searchQuery, selectedCategory, sortBy]);

  const getBookCover = (book) => {
    const coverPath = book.cover_image || book.coverimage;
    if (!coverPath) {
      return "https://via.placeholder.com/200"; 
    }
    if (coverPath.startsWith('http://') || coverPath.startsWith('https://')) {
      return coverPath;
    }
    return `${API_URL}${coverPath.startsWith('/') ? '' : '/'}${coverPath}`;
  };
  return (
    <div className="home-container">
      <style>{`
        *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            overflow-x: hidden;
            width: 100%;
        }
        :root {
            --bg-color: #fdf5e6;
            --main-brown: #bc986a;
            --light-beige: #e2cca8;
            --dark-text: #3d2b1f;
        }
        .home-container {
            background-color: var(--bg-color);
            width: 100%;
            max-width: 100vw;
            min-height: 100vh;
            color: var(--dark-text);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            overflow-x: hidden; 
            padding-bottom: 40px;
        }
        .search-section {
            display: flex;
            justify-content: center;
            padding: 20px;
            direction: rtl;
            width: 100%;
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
        .search-box-container h2 { color: white; margin-bottom: 15px; }         
        .search-input-wrapper {
            position: relative;
            width: 80%; 
            max-width: 600px;
            margin: 0 auto;
        }
        .search-input-wrapper input {
            width: 100%;
            padding: 12px 45px 12px 20px;
            border-radius: 25px;
            border: none;
            outline: none;
            font-size: 15px;
        }
        .search-input-wrapper i {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--main-brown);
            font-size: 18px;
        }
        .categories {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin: 20px auto;
            direction: rtl;
            flex-wrap: wrap;
            width: 90%;
        }
        .cat-tag {
            background: var(--light-beige);
            padding: 8px 25px;
            border-radius: 20px;
            border: 1px solid var(--dark-text);
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.2s;
        }
        .cat-tag:hover, .cat-tag.active {
            background: var(--main-brown);
            color: white;
        }
        .book-row-container {
            background: #fffdf9;
            margin: 20px auto;
            width: 90%;
            padding: 20px;
            border-radius: 20px;
            border: 1px solid #ddd;
            direction: rtl;
        }
        .results-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            border-right: 4px solid var(--main-brown);
            padding-right: 10px;
        }
        .results-header h3 { margin: 0; }
        .sort-dropdown {
            padding: 8px 15px;
            border-radius: 20px;
            border: 1px solid var(--main-brown);
            background-color: white;
            color: var(--dark-text);
            font-size: 13px;
            font-weight: bold;
            outline: none;
            cursor: pointer;
        }
        .book-row-container h3 { margin-bottom: 15px; border-right: 4px solid var(--main-brown); padding-right: 10px; }
        .books-grid {
            display: flex;
            gap: 20px;
            overflow-x: auto; 
            width: 100%;
            padding: 10px 5px;
            -webkit-overflow-scrolling: touch; 
        }   
        .book-card {
            min-width: 160px;
            max-width: 160px;
            background: var(--light-beige);
            border: 1px solid #ccc;
            padding: 12px;
            text-align: center;
            border-radius: 10px;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .book-card:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .book-cover {
            width: 100%;
            height: 200px;
            background: #d9d9d9;
            margin-bottom: 8px;
            object-fit: cover;
            border-radius: 6px;
        }
        .card-title { font-size: 14px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .card-author { font-size: 12px; color: #555; margin: 3px 0; }
        .stars { color: #d4af37; font-size: 12px; margin-top: 5px; }
        .no-books-msg { text-align: center; padding: 30px; font-weight: bold; color: #cc0000; font-size: 16px; }
      `}</style>
      <section className="search-section">
        <div className="search-box-container">
          <h2>ماذا سنقرأ اليوم؟</h2>
          <div className="search-input-wrapper">
            <input 
              type="text" 
              placeholder="ابحث عن كتابك المفضل أو اسم الكاتب..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <i className="fas fa-search" />
          </div>
        </div>
      </section>
      <nav className="categories">
        {categories.length > 0 && (
          <span 
            className={`cat-tag ${selectedCategory === null ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            الكل
          </span>
        )}
        {categories.map((cat) => (
          <span 
            key={cat.categoryid} 
            className={`cat-tag ${selectedCategory === cat.categoryid ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.categoryid)}
          >
            {cat.categoryname}
          </span>
        ))}
      </nav>
      {isSearching ? (
        <section className="book-row-container">
          <div className="results-header">
            <h3>نتائج البحث والتصفية</h3>
            <select 
              className="sort-dropdown" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">الأحدث</option>
              <option value="oldest">الأقدم</option>
            </select>
          </div>
          {searchResults.length === 0 ? (
            <div className="no-books-msg">لا يوجد كتاب متوافق مع خيارات البحث</div>
          ) : (
            <div className="books-grid">
              {searchResults.map((book) => (
                <div className="book-card" key={book.bookid} onClick={() => navigate(`/book/${book.bookid}`)}>
                  <img src={getBookCover(book)} alt={book.title} className="book-cover" />
                  <div className="card-title">{book.title}</div>
                  <div className="card-author">{book.authorname}</div>
                  <div className="stars">
                    {Array(Math.round(Number(book.avg_rating) || 0)).fill("★").join("") || "لا توجد تقييمات"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          <section className="book-row-container" id="latest-section">
            <h3>أحدث الكتب المضافة</h3>
            <div className="books-grid">
              {latestBooks.map((book) => (
                <div className="book-card" key={book.bookid} onClick={() => navigate(`/book/${book.bookid}`)}>
                  <img src={getBookCover(book)} alt={book.title} className="book-cover" />
                  <div className="card-title">{book.title}</div>
                  <div className="card-author">{book.authorname}</div>
                  <div className="stars">
                    {Array(Math.round(Number(book.avg_rating) || 0)).fill("★").join("") || "لا توجد تقييمات"}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="book-row-container" id="top-rated-section">
            <h3>الكتب الأعلى تقييماً</h3>
            <div className="books-grid">
              {topRatedBooks.map((book) => (
                <div className="book-card" key={book.bookid} onClick={() => navigate(`/book/${book.bookid}`)}>
                  <img src={getBookCover(book)} alt={book.title} className="book-cover" />
                  <div className="card-title">{book.title}</div>
                  <div className="card-author">{book.authorname}</div>
                  <div className="stars">
                    {Array(Math.round(Number(book.avg_rating) || 5)).fill("★").join("")}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};
export default Home;