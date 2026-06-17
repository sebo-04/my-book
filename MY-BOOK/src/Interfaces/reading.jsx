import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
function ReadingInterface() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [bookInfo, setBookInfo] = useState({ title: '', author: '', totalPages: 0 });
    const [loading, setLoading] = useState(true);
    const storedUser = localStorage.getItem('user');
    const userObj = storedUser ? JSON.parse(storedUser) : null;
    const currentUserId = userObj ? userObj.id : null;
    useEffect(() => {
        if (!id) return;
        let isMounted = true;
        fetch(`http://localhost:3030/api/read/book-info/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('فشل السيرفر في جلب معلومات الكتاب');
                return res.json();
            })
            .then(data => {
                if (isMounted) {
                    setBookInfo({
                        title: data.title || 'عنوان غير معروف',
                        author: data.author || 'كاتب غير معروف',
                        totalPages: data.totalPages || 'غير محدد'
                    });
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error("خطأ استرداد البيانات:", err);
                if (isMounted) {
                    setBookInfo({ title: 'معاينة الكتاب الإلكتروني', author: 'تحميل مباشر', totalPages: 'تلقائي' });
                    setLoading(false);
                }
            });
        return () => { isMounted = false; };
    }, [id]);
    const handleReserveCopy = () => {
        if (!currentUserId) {
            alert('يجب تسجيل الدخول أولاً.');
            return;
        }
        fetch(`http://localhost:3030/api/read/reserve-copy/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUserId })
        })
        .then(res => res.json())
        .then(data => alert(data.message))
        .catch(err => console.error(err));
    };
    if (loading) {
        return <div style={{ textAlign: 'center', padding: '100px', fontSize: '20px', color: '#3D2C1E' }}>جاري فتح ملف الكتاب الإلكتروني بأعلى جودة...</div>;
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', overflow: 'hidden' }}>
            <style dangerouslySetInnerHTML={{
                __html: `
                    :root { --bg-interface: #fff3dd; --bg-paper: #fcfcf9; --text-dark: #3D2C1E; --text-muted: #6B5E51; }
                    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Cairo', sans-serif; }
                    .top-navbar { background-color: var(--bg-interface); border-bottom: 2px solid rgba(61, 44, 30, 0.1); padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; height: 70px; direction: rtl; }
                    .book-info h1 { font-size: 1.25rem; font-weight: 700; color: var(--text-dark); }
                    .book-info p { font-size: 0.85rem; color: var(--text-muted); }
                    .nav-actions { display: flex; gap: 12px; }
                    .btn-action { border: 1px solid var(--text-dark); padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; background-color: transparent; color: var(--text-dark); }
                    .main-container { flex: 1; height: calc(100vh - 130px); position: relative; background-color: #525659; }
                    .pdf-embed-view { width: 100%; height: 100%; border: none; }
                    .bottom-control-bar { background-color: var(--bg-interface); border-top: 2px solid rgba(61, 44, 30, 0.1); height: 60px; padding: 0 24px; display: flex; justify-content: center; align-items: center; direction: rtl; font-weight: bold; color: var(--text-dark); }
                `
            }} />
            <header className="top-navbar">
                <div className="book-info">
                    <h1>{bookInfo.title}</h1>
                    <p>الكاتب: {bookInfo.author}</p>
                </div>
                <div className="nav-actions">
                    <button className="btn-action" style={{ backgroundColor: '#27ae60', color: 'white', border: 'none' }} onClick={handleReserveCopy}>حجز نسخة ورقية</button>
                    <button className="btn-action" onClick={() => navigate(-1)}>العودة</button>
                </div>
            </header>
            <div className="main-container">
                <object 
                    data={`http://localhost:3030/api/read/book-page/${id}#toolbar=1&navpanes=0`} 
                    type="application/pdf" 
                    className="pdf-embed-view"
                >
                    <div style={{ textAlign: 'center', padding: '50px', color: '#fff' }}>
                        <p>يتعذر على المتصفح عرض الـ PDF مباشرة.</p>
                        <a href={`http://localhost:3030/api/read/book-page/${id}`} target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'underline' }}>اضغط هنا لفتح الملف في علامة تبويب جديدة</a>
                    </div>
                </object>
            </div>
            <footer className="bottom-control-bar">  </footer>
        </div>
    );
}
export default ReadingInterface;