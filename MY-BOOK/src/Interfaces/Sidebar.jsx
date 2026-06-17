import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(''); 
  const location = useLocation();
  const navigate = useNavigate();
  const excludedPaths = ['/', '/login'];
  const isExcluded = excludedPaths.includes(location.pathname) || location.pathname.startsWith('/reading');
  useEffect(() => {
    const userRaw = localStorage.getItem('user');
    console.log("كائن المستخدم بالكامل من localStorage:", userRaw);
    let userId = null;
    if (userRaw) {
      try {
        const userObj = JSON.parse(userRaw);
        userId = userObj.userid || userObj.UserID || userObj.id || userObj.userId;
      } catch (err) {
        console.error("خطأ في تحليل كائن المستخدم:", err);
      }
    }
    console.log("المعرف المستخرج النهائي هو:", userId);
    if (userId && !isExcluded) {
      fetch('http://localhost:3030/api/sidebar/user-role', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'userid': userId 
        }
      })
      .then(res => res.json())
      .then(data => {
        console.log("البيانات القادمة من السيرفر للصلاحية الحالية:", data);
        if (data.userType) {
          setUserRole(data.userType); 
        }
      })
      .catch(err => console.error("خطأ أثناء جلب صلاحية المستخدم من السيرفر:", err));
    }
  }, [location.pathname, isExcluded]);
  if (isExcluded) return null;
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = () => {
    localStorage.removeItem('user'); 
    localStorage.removeItem('token');  
    toggleSidebar();
    navigate('/login'); 
  };
  const icons = {
    profile: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
    home: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
    books: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
    users: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    stats: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>,
    logout: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
  };
  return (
    <>
      <style>{`
        .sidebar-toggle-btn {
          position: fixed; top: 25px; left: 25px; z-index: 1000;
          background-color: #CBB084; color: #2D2D2D; border: 1.5px solid #2D2D2D;
          border-radius: 50%; width: 55px; height: 55px; cursor: pointer;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center;
          transition: transform 0.2s, background-color 0.2s;
        }
        .sidebar-toggle-btn:hover { transform: scale(1.05); background-color: #BCA278; }
        .sidebar-container {
          position: fixed; top: 0; left: -290px; width: 280px; height: 100vh;
          background: linear-gradient(162deg, #CDB286 50%, #E6D4B6 50%);
          box-shadow: 5px 0 25px rgba(0,0,0,0.15); z-index: 999;
          transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1); padding: 50px 25px 30px 20px;
          box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;
        }
        .sidebar-container.open { left: 0; }
        .sidebar-menu { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; width: 100%; }
        .sidebar-menu a, .sidebar-logout-btn {
          display: flex; flex-direction: row-reverse; align-items: center; justify-content: flex-end;
          gap: 14px; padding: 12px 16px; color: #1A1A1A; text-decoration: none; font-weight: 500;
          font-size: 16px; border-radius: 8px; transition: background-color 0.2s, transform 0.2s;
          direction: rtl; background: none; border: none; width: 100%; cursor: pointer; box-sizing: border-box;
        }
        .sidebar-menu a svg, .sidebar-logout-btn svg { flex-shrink: 0; stroke: #1A1A1A; }
        .sidebar-menu a:hover, .sidebar-logout-btn:hover { background-color: rgba(255, 255, 255, 0.25); transform: translateX(-3px); }
        .sidebar-menu a.active-link { background-color: rgba(255, 255, 255, 0.4); font-weight: 700; }
        .sidebar-footer { width: 100%; margin-top: auto; }
        .sidebar-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.15); z-index: 998; backdrop-filter: blur(1px); }
      `}</style>
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        {icons.profile}
      </button>
      <div className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>
        <ul className="sidebar-menu">
          <li>
            <Link to="/profile" className={location.pathname === '/profile' ? 'active-link' : ''} onClick={toggleSidebar}>
              {icons.profile}
              <span>الملف الشخصي</span>
            </Link>
          </li>
          <li>
            <Link to="/home" className={location.pathname === '/home' ? 'active-link' : ''} onClick={toggleSidebar}>
              {icons.home}
              <span>الصفحة الرئيسية</span>
            </Link>
          </li>
          {userRole && userRole.toLowerCase() === 'admin' && (
            <>
              <li>
                <Link to="/management" className={location.pathname === '/management' ? 'active-link' : ''} onClick={toggleSidebar}>
                  {icons.books}
                  <span>ادارة الكتب</span>
                </Link>
              </li>
              <li>
                <Link to="/users" className={location.pathname === '/users' ? 'active-link' : ''} onClick={toggleSidebar}>
                  {icons.users}
                  <span>ادارة المستخدمين</span>
                </Link>
              </li>
              <li>
                <Link to="/statistics" className={location.pathname === '/statistics' ? 'active-link' : ''} onClick={toggleSidebar}>
                  {icons.stats}
                  <span>الاحصاءات</span>
                </Link>
              </li>
            </>
          )}
        </ul>
        <div className="sidebar-footer">
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            {icons.logout}
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
};
export default Sidebar;