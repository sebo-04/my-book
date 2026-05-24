import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

const Book = ({ bookId }) => { // نمرر معرف الكتاب كـ prop لجلب بياناته محددة
  // الأقسام الخاصة بالـ States
  const [bookData, setBookData] = useState(null);      // لتخزين بيانات الكتاب القادمة من القاعدة
  const [reviews, setReviews] = useState([]);          // قائمة التعليقات (تبدأ فارغة وتتحدث من الباك)
  const [userRating, setUserRating] = useState(0);     // التقييم الذي يختاره المستخدم الحالي
  const [hoverRating, setHoverRating] = useState(0);   // تأثير حركة الماوس فوق النجوم
  const [commentText, setCommentText] = useState("");  // نص التعليق الجديد
  const [loading, setLoading] = useState(true);        // حالة التحميل لحين وصول البيانات

  // 1. جلب بيانات الكتاب والتعليقات عند فتح الصفحة
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        // استبدلي هذه الروابط بروابط الـ API الحقيقية الخاصة بـ مشروعك
        const response = await fetch(`/api/books/${bookId}`);
        const data = await response.json();
        
        setBookData(data.book);
        setReviews(data.reviews || []); // إذا لم تكن هناك تعليقات، نضع مصفوفة فارغة
        setLoading(false);
      } catch (error) {
        console.error("خطأ في جلب بيانات الكتاب:", error);
        setLoading(false);
      }
    };

    if (bookId) fetchBookDetails();
  }, [bookId]);

  // 2. إرسال التقييم للباك إند وحساب المتوسط الجديد
  const handleRatingSubmit = async (ratingValue) => {
    setUserRating(ratingValue);
    try {
      const response = await fetch(`/api/books/${bookId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: ratingValue })
      });
      const data = await response.json();
      
      // الباك إند يعيد المتوسط الجديد (averageRating) ونقوم بتحديث الـ state فوراً
      setBookData(prev => ({ ...prev, averageRating: data.newAverage }));
    } catch (error) {
      console.error("خطأ في إرسال التقييم:", error);
    }
  };

  // 3. إرسال التعليق الجديد للباك إند وعرضه فوراً
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return; // منع إرسال تعليق فارغ

    try {
      const response = await fetch(`/api/books/${bookId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: commentText,
          rating: userRating // إرسال التقييم المرتبط بالتعليق إن وجد
        })
      });
      const newComment = await response.json();

      // إضافة التعليق الجديد الراجع من الباك إند إلى قائمة التعليقات المعروضة فوراً
      setReviews(prev => [newComment, ...prev]);
      setCommentText(""); // تفريغ صندوق الكتابة
    } catch (error) {
      console.error("خطأ في إرسال التعليق:", error);
    }
  };

  if (loading) {
    return <div style={{ textAlignment: 'center', padding: '50px', direction: 'rtl' }}>جاري تحميل تفاصيل الكتاب...</div>;
  }

  if (!bookData) {
    return <div style={{ textAlignment: 'center', padding: '50px', direction: 'rtl' }}>لم يتم العثور على الكتاب المطلوب.</div>;
  }

  return (
    <>
      {/* تاغ الـ style المدمج كما هو بدون تغيير للتنسيق */}
      <style>{`
        :root {
            --bg-main: #FDF6E2;
            --card-bg: #D1A773;
            --btn-blue: #4A90E2;
            --btn-yellow: #B8C244;
            --btn-green: #27AE60;
            --table-bg1: #E6D5BC;
            --table-bg2: #D1A773;
            --text-dark: #333333;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        body { background-color: var(--bg-main); color: var(--text-dark); padding: 40px 20px; line-height: 1.6; }
        .container { max-width: 1100px; margin: 0 auto; direction: rtl; }
        .main-section { display: flex; gap: 40px; align-items: flex-start; margin-bottom: 30px; }
        .info-section { flex: 1; }
        .book-title { font-size: 32px; font-weight: bold; margin-bottom: 5px; }
        .author-name { font-size: 20px; color: #555; margin-bottom: 15px; }
        .tags-container { display: flex; gap: 8px; align-items: center; margin-bottom: 15px; }
        .tags-label { font-size: 13px; font-weight: bold; }
        .tag { background-color: var(--card-bg); color: white; padding: 4px 12px; border-radius: 15px; font-size: 12px; }
        .rating-average { display: flex; align-items: center; gap: 8px; color: #F1C40F; font-weight: bold; margin-bottom: 25px; }
        .rating-average span { color: #333; font-size: 14px; }
        .description-box { margin-bottom: 30px; }
        .description-title { font-size: 18px; font-weight: bold; border-bottom: 1px solid #999; padding-bottom: 5px; margin-bottom: 10px; }
        .description-text { color: #444; text-align: justify; }
        .book-specs-table { width: 100%; max-width: 450px; border: 1px solid #999; border-radius: 8px; overflow: hidden; border-collapse: collapse; }
        .table-row { display: flex; padding: 12px; border-bottom: 1px solid #999; }
        .table-row:last-child { border-bottom: none; }
        .table-row.light { background-color: var(--table-bg1); color: #333; }
        .table-row.dark { background-color: var(--table-bg2); color: white; }
        .cell-label { width: 50%; font-weight: bold; }
        .cell-value { width: 50%; }
        .sidebar-card { background-color: var(--card-bg); width: 320px; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .book-cover { width: 100%; height: 340px; background-color: #D9D9D9; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #666; font-size: 14px; margin-bottom: 20px; overflow: hidden; }
        .book-cover img { width: 100%; height: 100%; object-fit: cover; }
        .status-container { text-align: center; margin-bottom: 20px; }
        .status-label { font-size: 14px; font-weight: bold; display: block; margin-bottom: 5px; }
        .status-badge { background-color: #A3E2A4; color: #1e4620; padding: 6px 20px; border-radius: 20px; font-size: 14px; font-weight: bold; display: inline-block; }
        .action-buttons { width: 100%; display: flex; flex-direction: column; gap: 12px; }
        .btn { width: 100%; border: none; padding: 12px; border-radius: 25px; color: white; font-weight: bold; font-size: 15px; cursor: pointer; transition: background 0.2s; text-align: center; }
        .btn-blue { background-color: var(--btn-blue); }
        .btn-yellow { background-color: var(--btn-yellow); }
        .btn-green { background-color: var(--btn-green); }
        .copies-count { font-size: 12px; color: #444; margin-top: 12px; }
        hr.separator { border: 0; border-top: 1px solid #999; margin: 40px 0; }
        .bottom-section { display: grid; grid-template-columns: 2fr 1fr; gap: 40px; }
        .reviews-container { display: flex; flex-direction: column; }
        .reviews-header { background-color: var(--card-bg); color: white; padding: 6px 24px; border-radius: 8px 8px 0 0; font-weight: bold; font-size: 14px; align-self: flex-start; }
        .reviews-list { display: flex; flex-direction: column; gap: 15px; }
        .review-item { background-color: #ffffff90; border: 1px solid #ccc; border-radius: 12px; padding: 15px; display: flex; gap: 15px; }
        .user-avatar { width: 48px; height: 48px; background-color: #D9D9D9; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #666; flex-shrink: 0; overflow: hidden; }
        .user-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .review-content { flex: 1; }
        .review-meta { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .user-name { font-weight: bold; font-size: 14px; }
        .user-rating { color: #F1C40F; font-size: 13px; }
        .review-text { font-size: 14px; color: #444; }
        .add-rating-box { display: flex; flex-direction: column; }
        .add-rating-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
        .stars-input { display: flex; gap: 5px; font-size: 24px; color: #ccc; margin-bottom: 15px; }
        .stars-input i { cursor: pointer; transition: color 0.2s; }
        .stars-input i.active { color: #F1C40F; }
        .comment-input-container { background-color: white; border: 1px solid #ccc; border-radius: 8px; padding: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .comment-textarea { width: 100%; border: none; resize: none; outline: none; font-size: 14px; padding: 5px; }
        .submit-btn-wrapper { text-align: left; margin-top: 5px; }
        .btn-submit { background-color: var(--card-bg); color: white; border: none; padding: 6px 16px; border-radius: 4px; cursor: pointer; font-size: 13px; }
        @media (max-width: 768px) {
            .main-section { flex-direction: column; align-items: center; }
            .sidebar-card { width: 100%; order: -1; }
            .bottom-section { grid-template-columns: 1fr; }
            .add-rating-box { order: -1; margin-bottom: 20px; }
        }
      `}</style>

      <div className="container">
        <div className="main-section">
          
          {/* قسم البيانات الأساسية الأيمن المستدعى ديناميكياً */}
          <div className="info-section">
            <h1 className="book-title">{bookData.title}</h1>
            <h2 className="author-name">{bookData.author}</h2>
            
            <div className="tags-container">
              <span className="tags-label">تصنيف الكتاب:</span>
              {bookData.categories && bookData.categories.map((cat, index) => (
                <span key={index} className="tag">{cat}</span>
              ))}
            </div>

            {/* عرض متوسط التقييم المسترجع والمحدث ديناميكياً */}
            <div className="rating-average">
              <i className="fas fa-star" />
              <span>
                متوسط التقييمات الإجمالي: <b>{Number(bookData.averageRating).toFixed(1)} / 5</b>
              </span>
            </div>

            <div className="description-box">
              <div className="description-title">وصف الكتاب</div>
              <p className="description-text">{bookData.description}</p>
            </div>

            <table className="book-specs-table">
              <tbody>
                <tr className="table-row light">
                  <td className="cell-label">سنة النشر</td>
                  <td className="cell-value">{bookData.publishYear}</td>
                </tr>
                <tr className="table-row dark">
                  <td className="cell-label">عدد الصفحات</td>
                  <td className="cell-value">{bookData.pagesCount} صفحة</td>
                </tr>
                <tr className="table-row light">
                  <td className="cell-label">لغة الكتاب</td>
                  <td className="cell-value">{bookData.language}</td>
                </tr>
                <tr className="table-row dark">
                  <td className="cell-label">رمز الكتاب</td>
                  <td className="cell-value">{bookData.isbn}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* الكارد الجانبي الأيسر */}
          <div className="sidebar-card">
            <div className="book-cover">
              {bookData.coverUrl ? (
                <img src={bookData.coverUrl} alt={bookData.title} />
              ) : (
                <span>لا توجد صورة غلاف</span>
              )}
            </div>
            <div className="status-container">
              <span className="status-label">حالة النسخة</span>
              <span className="status-badge" style={{ 
                backgroundColor: bookData.availableCopies > 0 ? '#A3E2A4' : '#E6B0AA',
                color: bookData.availableCopies > 0 ? '#1e4620' : '#78281F'
              }}>
                {bookData.availableCopies > 0 ? 'متاح للإعارة' : 'غير متاح حالياً'}
              </span>
            </div>
            <div className="action-buttons">
              <button className="btn btn-blue">اقرأ الآن (PDF)</button>
              <button className="btn btn-yellow">تحميل الكتاب</button>
              <button className="btn btn-green" disabled={bookData.availableCopies === 0}>حجز نسخة ورقية</button>
            </div>
            <div className="copies-count">
              عدد النسخ المتبقية: <b>{bookData.availableCopies}</b>
            </div>
          </div>
        </div>

        <hr className="separator" />

        {/* القسم السفلي: التعليقات والتقييم */}
        <div className="bottom-section">
          
          {/* قسم المراجعات: لا يعرض شيئاً إذا كانت المصفوفة فارغة حتى يضيف مستخدم تعليقاً */}
          <div className="reviews-container">
            <div className="reviews-header">المراجعات ({reviews.length})</div>
            <div className="reviews-list">
              {reviews.length === 0 ? (
                <p style={{ padding: '20px', color: '#666', fontSize: '14px' }}>لا توجد مراجعات بعد. كن أول من يعلق!</p>
              ) : (
                reviews.map((review) => (
                  <div className="review-item" key={review.id}>
                    <div className="user-avatar">
                      {review.userAvatar ? <img src={review.userAvatar} alt={review.userName} /> : "صورة"}
                    </div>
                    <div className="review-content">
                      <div className="review-meta">
                        <span className="user-name">{review.userName}</span>
                        <span className="user-rating">
                          <i className="fas fa-star" /> {review.rating}/5
                        </span>
                      </div>
                      <p className="review-text">{review.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* صندوق إضافة تقييم وتعليق جديد يرسل البيانات للباك إند */}
          <div className="add-rating-box">
            <div className="add-rating-title">تقييم الكتاب</div>
            
            {/* إدخال النجوم بشكل تفاعلي */}
            <div className="stars-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={(hoverRating || userRating) >= star ? "fas fa-star active" : "far fa-star"}
                  onClick={() => handleRatingSubmit(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>

            <form onSubmit={handleCommentSubmit} className="comment-input-container">
              <textarea
                className="comment-textarea"
                rows={4}
                placeholder="اضافة تعليق..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div className="submit-btn-wrapper">
                <button type="submit" className="btn-submit">إرسال</button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </>
  );
};

export default Book;