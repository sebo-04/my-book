import { useState, useEffect } from 'react';
export default function LibraryDashboard() {
  const [activeTab, setActiveTab] = useState('users-management');
  const [users, setUsers] = useState([]); 
  const [userSearch, setUserSearch] = useState(''); 
  const [userFilter, setUserFilter] = useState('all'); 
  const [loadingUsers, setLoadingUsers] = useState(true); 
  const [loans, setLoans] = useState([]);
  const [loanSearch, setLoanSearch] = useState('');
  const [loanFilter, setLoanFilter] = useState('all'); 
  const [loadingLoans, setLoadingLoans] = useState(true);
  const fetchUsers = async (searchTerm = '', filterType = 'all') => {
    try {
      setLoadingUsers(true);
      const response = await fetch(`http://localhost:3030/api/dashboard/users?search=${searchTerm}&filter=${filterType}`);
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };
  const fetchLoans = async (searchTerm = '', filterType = 'all') => {
    try {
      setLoadingLoans(true);
      const response = await fetch(`http://localhost:3030/api/dashboard/loans?search=${searchTerm}&filter=${filterType}`);
      const data = await response.json();
      if (response.ok) {
        setLoans(data);
      }
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      setLoadingLoans(false);
    }
  };
  useEffect(() => {
    fetchUsers(userSearch, userFilter);
    fetchLoans(loanSearch, loanFilter);
  }, []);
  const handleUserSearchChange = (e) => {
    const value = e.target.value;
    setUserSearch(value);
    fetchUsers(value, userFilter); 
  };
  const handleUserFilterChange = (e) => {
    const value = e.target.value;
    setUserFilter(value);
    fetchUsers(userSearch, value);
  };
  const handleLoanSearchChange = (e) => {
    const value = e.target.value;
    setLoanSearch(value); 
    fetchLoans(value, loanFilter);
  };
  const handleLoanFilterChange = (e) => {
    const value = e.target.value;
    setLoanFilter(value);
    fetchLoans(loanSearch, value);
  };
  const handleToggleRole = async (userId, currentRole) => {
    try {
      const response = await fetch(`http://localhost:3030/api/dashboard/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentRole })
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(prevUsers => 
          prevUsers.map(u => u.userid === userId ? { ...u, usertype: data.newRole } : u)
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error changing role:", error);
    }
  };
  const handleToggleBlock = async (userId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:3030/api/dashboard/users/${userId}/ban`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentStatus })
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(prevUsers => 
          prevUsers.map(u => u.userid === userId ? { ...u, isbanned: data.newStatus } : u)
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error toggling ban:", error);
    }
  };
  const handleApproveLoan = async (loanId) => {
    try {
      const response = await fetch(`http://localhost:3030/api/dashboard/loans/${loanId}/approve`, {
        method: 'PUT'
      });
      if (response.ok) {
        fetchLoans(loanSearch, loanFilter);
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error("Error approving loan:", error);
    }
  };
  const handleDeleteLoan = async (loanId) => {
    if(!window.confirm("هل تأكدت من استلام الكتاب وتريد إتاحة النسخة مجدداً وحذف السجل؟")) return;
    try {
      const response = await fetch(`http://localhost:3030/api/dashboard/loans/${loanId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setLoans(prevLoans => prevLoans.filter(loan => loan.id !== loanId));
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error("Error deleting loan:", error);
    }
  };
  const formatDate = (isoString) => {
    if (!isoString) return '---';
    const date = new Date(isoString);
    return date.toISOString().split('T')[0];
  };
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
        .dashboard-outer-wrapper {
            width: 100%;
            min-height: 100vh;
            background-color: #FDF6E2;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
            box-sizing: border-box;
            direction: rtl;
            font-family: 'Tajawal', sans-serif;
        }
        .dashboard-container { 
            width: 100%; 
            max-width: 1100px; 
            background-color: #F5E6C4; 
            border-radius: 12px; 
            padding: 30px; 
            box-shadow: 0 8px 24px rgba(0,0,0,0.12); 
            box-sizing: border-box;
        }
        .tabs-container { display: flex; justify-content: center; margin-bottom: 30px; }
        .tab-btn { 
            padding: 12px 35px; 
            font-size: 18px; 
            font-weight: bold; 
            border: 1px solid #A88958; 
            background-color: #CDB38B; 
            color: #4A3B23; 
            cursor: pointer; 
            transition: all 0.3s ease; 
        }
        .tabs-container .tab-btn:first-child { border-radius: 0 10px 10px 0; margin-left: -1px; }
        .tabs-container .tab-btn:last-child { border-radius: 10px 0 0 10px; }
        .tab-btn.active { background-color: #A88958; color: #FFFFFF; box-shadow: inset 0 2px 5px rgba(0,0,0,0.2); }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        .controls-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 20px; }
        .search-box { position: relative; flex: 1; max-width: 400px; }
        .search-box input { width: 100%; padding: 10px 45px 10px 15px; border: 1.5px solid #4A3B23; border-radius: 25px; font-size: 16px; background-color: #FFFFFF; }
        .search-icon { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); color: #4A3B23; }
        .filter-select {
            padding: 10px 20px;
            border: 1.5px solid #4A3B23;
            border-radius: 25px;
            font-size: 16px;
            background-color: #FFFFFF;
            color: #4A3B23;
            cursor: pointer;
            font-family: 'Tajawal', sans-serif;
            outline: none;
        }
        .table-wrapper { overflow-x: auto; border: 2px solid #4A3B23; border-radius: 12px; background-color: #E6D2B1; }
        .dashboard-table { width: 100%; border-collapse: collapse; text-align: center; min-width: 800px; }
        .dashboard-table th { background-color: #7A5C33; color: #FFFFFF; padding: 14px; font-size: 16px; font-weight: 500; border: 1px solid #4A3B23; }
        .dashboard-table td { padding: 12px; border: 1px solid #4A3B23; color: #332615; font-size: 15px; height: 55px; vertical-align: middle; }
        .status-badge { padding: 6px 20px; border-radius: 15px; font-size: 14px; font-weight: bold; display: inline-block; }
        .status-badge.reserved { background-color: #A3E4AE; color: #1E4624; }
        .status-badge.borrowed { background-color: #F1E5A5; color: #5C501A; }
        .status-badge.late { background-color: #F7B1B1; color: #611C1C; }
        .status-badge.admin { background-color: #A3E4AE; color: #1E4624; }
        .status-badge.reader { background-color: #F1E5A5; color: #5C501A; }
        .clickable-badge { cursor: pointer; transition: transform 0.2s ease; user-select: none; }
        .clickable-badge:hover { transform: scale(1.05); }
        .blocked-row { background-color: #CDB38B !important; opacity: 0.65; }
        .action-btn { border: none; background: none; cursor: pointer; font-size: 16px; padding: 5px 15px; transition: transform 0.2s ease; font-weight: bold; }
        .check-btn { color: #1E4624; background-color: #A3E4AE; border: 1px solid #1E4624; border-radius: 6px; }
        .check-btn:hover { transform: scale(1.05); background-color: #8cd499; }
        .delete-btn { color: #FFFFFF; background-color: #A62B2B; border-radius: 6px; border: none; font-size: 14px; padding: 6px 12px; }
        .delete-btn:hover { background-color: #851e1e; transform: scale(1.05); }
        .restore-btn { color: #FFFFFF; background-color: #4A3B23; border-radius: 6px; border: none; font-size: 14px; padding: 6px 12px; }
        .restore-btn:hover { background-color: #332818; }
        .no-data-msg { text-align: center; padding: 40px; font-size: 18px; font-weight: bold; color: #614c2e; }
      `}</style>
      <div className="dashboard-outer-wrapper">
        <div className="dashboard-container">
          <div className="tabs-container">
            <button className={`tab-btn ${activeTab === 'users-management' ? 'active' : ''}`} onClick={() => setActiveTab('users-management')}>إدارة المستخدمين</button>
            <button className={`tab-btn ${activeTab === 'loans-management' ? 'active' : ''}`} onClick={() => setActiveTab('loans-management')}>إدارة الإعارات</button>
          </div>
          <div id="loans-management" className={`tab-content ${activeTab === 'loans-management' ? 'active' : ''}`}>
            <div className="controls-row">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input 
                  type="text" 
                  placeholder="البحث عن كتاب بالاسم..." 
                  value={loanSearch}
                  onChange={handleLoanSearchChange}
                />
              </div>
              <div>
                <select className="filter-select" value={loanFilter} onChange={handleLoanFilterChange}>
                  <option value="all">جميع الاستعارات</option>
                  <option value="reserved">الاستعارات المحجوزة</option>
                  <option value="borrowed">الاستعارات المستعارة</option>
                  <option value="late">الاستعارات المتأخرة</option>
                </select>
              </div>
            </div>
            {loadingLoans ? (
              <div className="no-data-msg">جاري تحميل سجلات الإعارات...</div>
            ) : loans.length === 0 ? (
              <div className="no-data-msg">لا توجد عمليات إعارة مسجلة حالياً تماثل البحث.</div>
            ) : (
              <div className="table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>اسم المستعير</th>
                      <th>عنوان الكتاب</th>
                      <th>حالة الاستعارة</th>
                      <th>تاريخ الإعارة</th>
                      <th>تاريخ الإرجاع المتوقع</th>
                      <th>التحكم والاستلام</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.map((loan) => (
                      <tr key={loan.id}>
                        <td>{loan.borrower}</td>
                        <td>{loan.title}</td>
                        <td><span className={`status-badge ${loan.status}`}>{loan.badgeText}</span></td>
                        <td>{formatDate(loan.dateOut)}</td>
                        <td>{formatDate(loan.dateIn)}</td>
                        <td>
                          {loan.approved ? (
                            <button className="action-btn delete-btn" onClick={() => handleDeleteLoan(loan.id)}>🗑️ إرجاع وإتاحة</button>
                          ) : (
                            <button className="action-btn check-btn" onClick={() => handleApproveLoan(loan.id)}>✓ تأكيد التسليم</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div id="users-management" className={`tab-content ${activeTab === 'users-management' ? 'active' : ''}`}>
            <div className="controls-row">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input 
                  type="text" 
                  placeholder="البحث عن مستخدم بالاسم..." 
                  value={userSearch} 
                  onChange={handleUserSearchChange} 
                />
              </div>
              <div>
                <select className="filter-select" value={userFilter} onChange={handleUserFilterChange}>
                  <option value="all">الجميع</option>
                  <option value="banned">المحظورون</option>
                  <option value="active">غير المحظورين</option>
                </select>
              </div>
            </div>
            {loadingUsers ? (
              <div className="no-data-msg">جاري تحميل بيانات المستخدمين...</div>
            ) : users.length === 0 ? (
              <div className="no-data-msg">لا يوجد مستخدمين مسجلين في النظام حالياً.</div>
            ) : (
              <div className="table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>اسم المستخدم</th>
                      <th>بريده الإلكتروني</th>
                      <th>صلاحيات المستخدم</th>
                      <th>تاريخ التسجيل</th>
                      <th>إدارة الحساب</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => {
                      const uId = user.userid;
                      const uName = user.username;
                      const uEmail = user.email;
                      const uType = user.usertype;
                      const uCreatedAt = user.createdat;
                      const uIsBanned = user.isbanned;
                      return (
                        <tr key={uId} className={uIsBanned ? "blocked-row" : ""}>
                          <td>{uName}</td>
                          <td>{uEmail}</td>
                          <td>
                            <span 
                              className={`status-badge ${uType === 'Admin' ? 'admin' : 'reader'} clickable-badge`}
                              onClick={() => handleToggleRole(uId, uType)}
                              title="اضغطي لتغيير الصلاحية مابين مشرف وقارئ"
                            >
                              {uType === 'Admin' ? 'مشرف' : 'قارئ'}
                            </span>
                          </td>
                          <td>{formatDate(uCreatedAt)}</td>
                          <td>
                            {uIsBanned ? (
                              <button className="action-btn restore-btn" onClick={() => handleToggleBlock(uId, uIsBanned)}>
                                🔓 إلغاء الحظر
                              </button>
                            ) : (
                              <button className="action-btn delete-btn" onClick={() => handleToggleBlock(uId, uIsBanned)}>
                                🗑️ حظر
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}