import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BookDetails = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ratingValue, setRatingValue] = useState(5);
    const [comment, setComment] = useState('');

    const storedUser = localStorage.getItem('user');
    const userObj = storedUser ? JSON.parse(storedUser) : null;
    const currentUserId = userObj ? userObj.id : null;

    const fetchBookData = () => {
        fetch(`http://localhost:3030/api/Detabooks/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('فشل في جلب بيانات الكتاب، قد يكون المعرف غير صحيح');
                return res.json();
            })
            .then(data => {
                setBook(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchBookData();
    }, [id]);

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!currentUserId) {
            alert('عذراً، يجب عليك تسجيل الدخول أولاً لتتمكن من إضافة مراجعة.');
            return;
        }
        fetch(`http://localhost:3030/api/Detabooks/${id}/review`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUserId,
                ratingValue: ratingValue,
                comment: comment
            })
        })
        .then(res => {
            if (!res.ok) throw new Error('فشل في حفظ التقييم');
            return res.json();
        })
        .then(data => {
            alert(data.message);
            setComment(''); 
            fetchBookData(); 
        })
        .catch(err => console.error('Error submitting review:', err));
    };

    const handleReserveCopy = () => {
        if (!currentUserId) {
            alert('عذراً، يجب عليك تسجيل الدخول أولاً لتتمكن من حجز نسخة.');
            return;
        }
        fetch(`http://localhost:3030/api/Detabooks/${id}/reserve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUserId })
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(data => { throw new Error(data.message) });
            }
            return res.json();
        })
        .then(data => {
            alert(data.message); 
            fetchBookData(); 
        })
        .catch(err => {
            alert(err.message); 
        });
    };

    const handleReadNow = () => {
        if (book && book.pdf_path) {
            navigate(`/reading/${id}`, { state: { pdfPath: book.pdf_path } });
        } else {
            alert('ملف PDF غير متوفر حالياً للعرض الفوري في صفحة القراءة');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '20px' }}>جاري تحميل تفاصيل الكتاب... 📚</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '50px', color: 'red', fontSize: '18px' }}>حدث خطأ: {error}</div>;
    if (!book) return <div style={{ textAlign: 'center', padding: '50px' }}>الكتاب المطلوب غير موجود.</div>;

    const getCoverImageUrl = (path) => {
        if (!path) return "https://via.placeholder.com/350x450?text=No+Cover";
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        return `http://localhost:3030/${path.replace(/^\//, '')}`;
    };

    return (
        <div className="book-details-container" style={{ position: 'relative' }}>
            <button onClick={() => navigate(-1)} className="btn-back-home">
               العودة للصفحة الرئيسية
            </button>

            <style dangerouslySetInnerHTML={{
                __html: `
                    :root {
                        --bg-main: #FDF6E2;      
                        --card-bg: #D1A773;      
                        --btn-blue: #5D9CEC;     
                        --btn-yellow: #C2C355;   
                        --btn-green: #37BC72;    
                        --text-color: #3D2B1F;   
                    }
                    .book-details-container {
                        background-color: var(--bg-main);
                        color: var(--text-color);
                        padding: 70px 20px 50px 20px; 
                        display: flex;
                        justify-content: center;
                        width: 100%;
                        box-sizing: border-box;
                    }
                    .book-details-container * {
                        box-sizing: border-box;
                        margin: 0;
                        padding: 0;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    }
                    .btn-back-home {
                        position: absolute;
                        top: 20px;
                        right: 20px; 
                        background-color: var(  --card-bg); 
                        color: var(--bg-main); 
                        border: 1px solid rgba(0, 0, 0, 0.1);
                        padding: 10px 22px;
                        border-radius: 20px;
                        font-weight: bold;
                        cursor: pointer;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                        transition: all 0.2s ease-in-out;
                        z-index: 10;
                    }
                    .btn-back-home:hover {
                        transform: scale(1.03);
                        background-color: #553c2b;
                    }
                    .wrapper {
                        width: 100%;
                        max-width: 1050px;
                        display: flex;
                        gap: 50px;
                        align-items: flex-start;
                        direction: rtl; 
                    }
                    .sidebar-card {
                        background-color: var(--card-bg);
                        width: 360px;
                        border-radius: 15px;
                        padding: 30px 25px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
                    }
                    .book-cover-img {
                        width: 100%;
                        height: 350px;
                        border-radius: 4px;
                        margin-bottom: 20px;
                        object-fit: cover;
                        background-color: #E0E0E0;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    }
                    .status-title {
                        font-size: 20px;
                        font-weight: bold;
                        margin-bottom: 8px;
                        color: #000;
                    }
                    .status-badge {
                        padding: 6px 25px;
                        border-radius: 20px;
                        font-size: 14px;
                        font-weight: bold;
                        margin-bottom: 25px;
                    }
                    .status-available { background-color: #A3E2A4; color: #1E4620; }
                    .status-unavailable { background-color: #F8B2B2; color: #721C24; }
                    .action-buttons {
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                        margin-bottom: 25px;
                    }
                    .btn {
                        width: 100%;
                        border: 1px solid rgba(0, 0, 0, 0.2);
                        padding: 12px;
                        border-radius: 25px;
                        color: white;
                        font-weight: bold;
                        font-size: 16px;
                        cursor: pointer;
                        text-align: center;
                        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.15);
                        transition: opacity 0.2s;
                    }
                    .btn:hover { opacity: 0.9; }
                    .btn-blue { background-color: var(--btn-blue); }
                    .btn-yellow { background-color: var(--btn-yellow); }
                    .btn-green { background-color: var(--btn-green); }
                    .copies-footer {
                        font-size: 14px;
                        color: #2D1F17;
                        font-weight: bold;
                    }
                    .main-content {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                    }
                    .book-title {
                        font-size: 36px;
                        font-weight: bold;
                        margin-bottom: 5px;
                    }
                    .author-name {
                        font-size: 24px;
                        font-weight: normal;
                        color: #4A3B32;
                        margin-bottom: 5px;
                    }
                    .publish-year {
                        font-size: 16px;
                        color: #665246;
                        margin-bottom: 25px;
                    }
                    .tags-container {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        margin-bottom: 25px;
                        flex-wrap: wrap;
                    }
                    .tags-label { font-size: 14px; font-weight: bold; }
                    .tag-pill {
                        background-color: var(--card-bg);
                        padding: 4px 15px;
                        border-radius: 12px;
                        font-size: 13px;
                        font-weight: bold;
                        color: #3D2B1F;
                        border: 1px solid rgba(0,0,0,0.1);
                    }
                    .rating-summary {
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        margin-bottom: 35px;
                    }
                    .rating-label { font-size: 15px; font-weight: bold; }
                    .star-icon { color: #F1C40F; font-size: 24px; letter-spacing: 2px; }
                    .description-section h3 {
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 15px;
                    }
                    .description-text { font-size: 16px; line-height: 1.6; color: #554133; }
                    .divider {
                        border: 0;
                        border-top: 1px solid #00000030;
                        margin: 30px 0;
                    }
                    .rating-box-section {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        width: 100%;
                        max-width: 500px;
                    }
                    .rating-box-title { font-size: 18px; margin-bottom: 10px; font-weight: bold; }
                    .stars-row-interactive {
                        display: flex;
                        gap: 8px;
                        font-size: 28px;
                        color: #CCC;
                        margin-bottom: 15px;
                        cursor: pointer;
                    }
                    .stars-row-interactive .active-star { color: #F1C40F; }
                    .comment-input-box {
                        width: 100%;
                        height: 90px;
                        background-color: #FFF;
                        border: 1px solid #CCCCCC;
                        padding: 12px;
                        font-size: 14px;
                        color: #333;
                        text-align: right;
                        margin-bottom: 15px;
                        resize: none;
                        outline: none;
                        border-radius: 8px;
                    }
                    .btn-submit-review {
                        background-color: var(--btn-blue);
                        color: white;
                        padding: 8px 20px;
                        border: none;
                        border-radius: 20px;
                        font-weight: bold;
                        cursor: pointer;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    }
                    .reviews-badge {
                        background-color: var(--card-bg);
                        color: #3D2B1F;
                        font-weight: bold;
                        padding: 6px 20px;
                        border-radius: 10px 10px 0 0;
                        font-size: 14px;
                        border: 1px solid rgba(0,0,0,0.1);
                        margin-top: 30px;
                    }
                    .reviews-container {
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                        margin-top: 15px;
                    }
                    .review-card {
                        background-color: #FFF;
                        border: 1px solid #CCC;
                        border-radius: 12px;
                        padding: 15px;
                        display: flex;
                        flex-direction: column;
                        gap: 5px;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.02);
                    }
                    .review-header { display: flex; justify-content: space-between; align-items: center; }
                    .reviewer-name { font-weight: bold; font-size: 15px; }
                    .reviewer-comment { font-size: 14px; color: #555; margin-top: 5px; }
                    @media (max-width: 768px) {
                        .wrapper { flex-direction: column; align-items: center; }
                        .sidebar-card { width: 100%; }
                        .btn-back-home { position: relative; top: 0; right: 0; margin-bottom: 25px; align-self: flex-start; }
                    }
                `
            }} />
            <div className="wrapper">
                <div className="main-content">
                    <h1 className="book-title">{book.title}</h1>
                    <h2 className="author-name">{book.authorname}</h2>
                    <div className="publish-year">سنة النشر: {book.publishyear}</div>
                    <div className="tags-container">
                        <span className="tags-label">تصنيف الكتاب:</span>
                        {book.categories && book.categories.length > 0 ? (
                            book.categories.map((cat, idx) => (
                                <span key={idx} className="tag-pill">{cat.categoryname}</span>
                            ))
                        ) : (
                            <span className="tag-pill">عام</span>
                        )}
                    </div>
                    <div className="rating-summary">
                        <span className="rating-label">متوسط التقييمات:</span>
                        <span className="star-icon">
                            {Array(Math.round(Number(book.avg_rating) || 0)).fill("★").join("") || "لا توجد تقييمات بعد"}
                        </span>
                        <span>({Number(book.avg_rating).toFixed(1)})</span>
                    </div>
                    <div className="description-section">
                        <h3>وصف الكتاب</h3>
                        <p className="description-text">{book.description || "لا يوجد وصف متوفر لهذا الكتاب حالياً."}</p>
                    </div>
                    <hr className="divider" />
                    <form onSubmit={handleReviewSubmit} className="rating-box-section">
                        <div className="rating-box-title">تقييم الكتاب وإضافة مراجعة:</div>
                        <div className="stars-row-interactive">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span 
                                    key={star} 
                                    className={star <= ratingValue ? "active-star" : ""} 
                                    onClick={() => setRatingValue(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <textarea
                            className="comment-input-box"
                            placeholder="اكتب تعليقك ورأيك حول هذا الكتاب هنا..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn-submit-review">إرسال التقييم</button>
                    </form>
                    <div className="reviews-badge">المراجعات والآراء</div>
                    <div className="reviews-container">
                        {book.reviews && book.reviews.length > 0 ? (
                            book.reviews.map((rev, index) => (
                                <div key={index} className="review-card">
                                    <div className="review-header">
                                        <span className="reviewer-name">{rev.username}</span>
                                        <span className="star-icon">{Array(rev.ratingvalue).fill("★").join("")}</span>
                                    </div>
                                    <p className="reviewer-comment">{rev.comment}</p>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '20px', color: '#888', textAlign: 'center' }}>كن أول من يكتب مراجعة لهذا الكتاب!</div>
                        )}
                    </div>
                </div>
                <div className="sidebar-card">
                    <img 
                        src={getCoverImageUrl(book.cover_image || book.coverimage)} 
                        alt={book.title} 
                        className="book-cover-img" 
                    />
                    <div className="status-title">حالة النسخة</div>
                    {book.available_copies > 0 ? (
                        <div className="status-badge status-available">متاح للاستعارة ({book.available_copies} متوفرة)</div>
                    ) : (
                        <div className="status-badge status-unavailable">غير متوفر حالياً</div>
                    )}
                    <div className="action-buttons">
                        <button onClick={handleReadNow} className="btn btn-blue">اقرأ الآن (PDF)</button>
                        <button onClick={handleReserveCopy} className="btn btn-green">حجز نسخة ورقية</button>
                    </div>
                    <div className="copies-footer">النسخ المتوفرة حالياً: {book.available_copies} من أصل {book.total_copies}</div>
                </div>
            </div>
        </div>
    );
};
export default BookDetails;