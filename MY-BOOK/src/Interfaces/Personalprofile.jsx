import { useState, useEffect } from 'react';
const PersonalProfile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          throw new Error('لم يتم العثور على بيانات تسجيل الدخول. يرجى تسجيل الدخول أولاً.');
        }
        const currentUser = JSON.parse(storedUser);
        const userEmail = currentUser.email; 
        const response = await fetch('http://localhost:3030/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'user-email': userEmail 
          }
        });

        if (!response.ok) {
          throw new Error('فشل في جلب البيانات من السيرفر');
        }
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          setBorrowedBooks(data.borrowedBooks);
        }
      } catch (err) {
        console.error("خطأ في جلب بيانات الملف الشخصي:", err);
        setError(err.message || "تعذر تحميل بيانات الملف الشخصي حالياً.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#8c6239', fontFamily: 'Tajawal, sans-serif' }}>
        <h3>جاري تحميل بيانات حسابك بدقة... 🚀</h3>
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'red', fontFamily: 'Tajawal, sans-serif' }}>
        <h3>{error}</h3>
      </div>
    );
  }
  const displayRoleName = (role) => {
    if (role === 'Admin') return 'مشرف النظام';
    if (role === 'Reader') return 'قارئ منصة';
    return role;
  };
  const avatarStyle = {
    width: '110px',
    height: '110px',
    borderRadius: '50%',
    border: '2px solid #5c3a21',
    objectFit: 'cover',
    display: 'block',
    filter: user.role === 'Admin' ? 'sepia(0.6) saturate(1.5) hue-rotate(10deg)' : 'none',
    backgroundColor: user.role === 'Admin' ? '#dfc49f' : '#ffffff'
  };
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght=400;500;700&display=swap');
          * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              font-family: 'Tajawal', sans-serif;
          }
          body {
              background-color: #f7eed0; 
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              padding: 20px;
          }
          .dashboard-container {
              background-color: #fffde9; 
              width: 100%;
              max-width: 800px;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
              display: flex;
              flex-direction: column;
              gap: 35px;
              direction: rtl;
          }
          .section-title {
              color: #8c6239;
              font-size: 1.3rem;
              font-weight: 700;
              margin-bottom: 12px;
              text-align: right;
          }
          .profile-card {
              background-color: #cca474; 
              border-radius: 15px;
              padding: 25px 30px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
          }
          .profile-info {
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 15px;
          }
          .info-row {
              display: flex;
              align-items: center;
              gap: 15px;
          }
          .info-row label {
              color: #5c3a21;
              font-weight: 700;
              font-size: 1rem;
              min-width: 60px;
              text-align: right;
          }
          .info-value {
              background-color: #ffffff;
              color: #333;
              width: 100%;
              max-width: 300px;
              padding: 8px 15px;
              border-radius: 8px;
              min-height: 38px;
              font-size: 0.95rem;
              border: 1px solid #bfa280;
              box-shadow: inset 0 2px 4px rgba(0,0,0,0.08);
              display: flex;
              align-items: center;
          }
          .user-role {
              color: #5c3a21;
              font-weight: 700;
              font-size: 1rem;
              margin-top: 5px;
              text-align: right;
          }
          .profile-avatar-wrapper {
              margin-left: 20px;
          }
          .table-container {
              border: 1.5px solid #4a2f1b;
              border-radius: 8px;
              overflow: hidden;
              background-color: #dfc49f;
          }
          table {
              width: 100%;
              border-collapse: collapse;
              text-align: center;
          }
          th {
              background-color: #8c6239;
              color: #ffffff;
              padding: 12px;
              font-weight: 700;
              font-size: 1rem;
              border-bottom: 1.5px solid #4a2f1b;
          }
          th:not(:last-child), td:not(:last-child) {
              border-left: 1.5px solid #4a2f1b;
          }
          td {
              padding: 12px;
              height: 45px;
              color: #4a2f1b;
              font-weight: 500;
              border-bottom: 1.5px solid #4a2f1b;
          }
          tr:last-child td {
              border-bottom: none;
          }
          .empty-state-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 30px;
              background-color: #dfc49f; 
              border: 1.5px dashed #4a2f1b; 
              border-radius: 8px;
              text-align: center;
              gap: 15px;
          }
          .empty-state-text {
              color: #4a2f1b;
              font-size: 1.1rem;
              font-weight: 700;
          }
          .empty-state-img {
              max-width: 150px;
              height: auto;
              object-fit: contain;
              display: block;
          }
          @media (max-width: 600px) {
              .profile-card {
                  flex-direction: column-reverse;
                  gap: 20px;
              }
              .info-row {
                  flex-direction: column;
                  align-items: flex-start;
                  gap: 5px;
              }
              .info-value {
                  max-width: 100%;
              }
              .profile-avatar-wrapper {
                  margin-left: 0;
              }
          }
        `
      }} />
      <div className="dashboard-container">
        <div className="profile-section">
          <h2 className="section-title">الملف الشخصي</h2>
          <div className="profile-card">
            <div className="profile-info">
              <div className="info-row">
                <label>الاسم</label>
                <div className="info-value">{user.name}</div>
              </div>
              <div className="info-row">
                <label>الإيميل</label>
                <div className="info-value" dir="ltr" style={{ justifyContent: 'flex-end' }}>{user.email}</div>
              </div>
              <div className="user-role">
                دور المستخدم: <span className="role-text" style={{ fontWeight: 'bold', color: user.role === 'Admin' ? '#4a2f1b' : '#5c3a21' }}>{displayRoleName(user.role)}</span>
              </div>
            </div>
            <div className="profile-avatar-wrapper">
              <img
                src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235c3a21' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='8' r='4'/><path d='M20 21a8 8 0 0 0-16 0'/></svg>"
                alt="User Avatar"
                style={avatarStyle}
              />
            </div>
          </div>
        </div>
        <div className="borrowed-books-section">
          <h2 className="section-title">الكتب المستعارة حالياً</h2>
          {borrowedBooks.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>تاريخ الإرجاع المتوقع</th>
                    <th>تاريخ الاستعارة</th>
                    <th>عنوان الكتاب المستعار</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowedBooks.map((book) => (
                    <tr key={book.id}>
                      <td>{book.returnDate}</td>
                      <td>{book.borrowDate}</td>
                      <td style={{ fontWeight: 'bold' }}>{book.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state-container">
              <p className="empty-state-text">لا توجد كتب مستعارة في الوقت الراهن</p>
              <img
                src="https://cdn-icons-png.flaticon.com/512/242/242452.png" 
                alt="No Borrowed Books"
                className="empty-state-img"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default PersonalProfile;