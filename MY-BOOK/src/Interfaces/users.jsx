import  { useState } from 'react';

export default function LibraryDashboard() {
  // 1. إدارة التبويبات (Tabs State)
  const [activeTab, setActiveTab] = useState('loans-management');

  // 2. إدارة بيانات الإعارات (Loans State)
  const [loans, setLoans] = useState([
    { id: 'loan_id_123', borrower: 'فاطمة أحمد', title: 'مبادئ هندسة البرمجيات', status: 'reserved', badgeText: 'محجوزة', dateOut: '2026-05-20', dateIn: '2026-05-27', approved: false },
    { id: 'loan_id_456', borrower: 'أحمد محمد', title: 'تعلم React و JSX', status: 'borrowed', badgeText: 'مستعارة', dateOut: '2026-05-18', dateIn: '2026-05-25', approved: true },
    { id: 'loan_id_789', borrower: 'سارة علي', title: 'مقدمة في قواعد البيانات', status: 'late', badgeText: 'متأخرة', dateOut: '2026-05-10', dateIn: '2026-05-17', approved: true }
  ]);

  // 3. إدارة بيانات المستخدمين (Users State)
  const [users, setUsers] = useState([
    { id: 'user_id_001', name: 'أروى خالد', email: 'arwa@email.com', role: 'مشرف', regDate: '2025-11-12', idNum: '102030', isBlocked: false },
    { id: 'user_id_002', name: 'محمد عمر', email: 'mohamed@email.com', role: 'قارئ', regDate: '2026-01-05', idNum: '405060', isBlocked: true }
  ]);

  // دالة قبول الإعارة
  const handleApproveLoan = (loanId) => {
    setLoans(prevLoans =>
      prevLoans.map(loan =>
        loan.id === loanId
          ? { ...loan, status: 'borrowed', badgeText: 'مستعارة', approved: true }
          : loan
      )
    );
  };

  // دالة تبديل الصلاحية (مشرف / قارئ)
  const handleToggleRole = (userId, currentRole) => {
    const newRole = currentRole === 'مشرف' ? 'قارئ' : 'مشرف';
    if (window.confirm(`هل تريد تغيير صلاحية المستخدم من [${currentRole}] إلى [${newRole}]؟`)) {
      setUsers(prevUsers =>
        prevUsers.map(user => user.id === userId ? { ...user, role: newRole } : user)
      );
    }
  };

  // دالة الحظر وإلغاء الحظر
  const handleToggleBlock = (userId, isBlocked) => {
    const message = isBlocked ? "هل تريد إلغاء حظر هذا المستخدم؟" : "هل تريد حظر هذا المستخدم؟";
    if (window.confirm(message)) {
      setUsers(prevUsers =>
        prevUsers.map(user => user.id === userId ? { ...user, isBlocked: !isBlocked } : user)
      );
    }
  };

  return (
    <>
      <style>{`
        /* إعدادات الخطوط والاتجاه العام */
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');

        * {
            box-sizing: border-box;
            font-family: 'Tajawal', sans-serif;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: #FDF6E2;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
        }

        .dashboard-container {
            width: 100%;
            max-width: 1100px;
            background-color: #F5E6C4;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }

        .tabs-container {
            display: flex;
            justify-content: center;
            margin-bottom: 30px;
        }

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

        .tabs-container .tab-btn:first-child {
            border-radius: 0 10px 10px 0;
            margin-left: -1px;
        }

        .tabs-container .tab-btn:last-child {
            border-radius: 10px 0 0 10px;
        }

        .tab-btn.active {
            background-color: #A88958;
            color: #FFFFFF;
            box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .controls-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            gap: 20px;
        }

        .search-box {
            position: relative;
            flex: 1;
            max-width: 400px;
        }

        .search-box input {
            width: 100%;
            padding: 10px 40px 10px 15px;
            border: 1.5px solid #4A3B23;
            border-radius: 25px;
            font-size: 16px;
            background-color: #FFFFFF;
            text-align: center;
        }

        .search-icon {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #4A3B23;
        }

        .filter-box select {
            padding: 10px 25px;
            border: 1.5px solid #4A3B23;
            border-radius: 25px;
            font-size: 14px;
            background-color: #FFFFFF;
            cursor: pointer;
        }

        .table-wrapper {
            overflow-x: auto;
            border: 2px solid #4A3B23;
            border-radius: 12px;
        }

        .dashboard-table {
            width: 100%;
            border-collapse: collapse;
            text-align: center;
            background-color: #E6D2B1;
        }

        .dashboard-table th {
            background-color: #7A5C33;
            color: #FFFFFF;
            padding: 14px;
            font-size: 16px;
            font-weight: 500;
            border: 1px solid #4A3B23;
        }

        .dashboard-table td {
            padding: 12px;
            border: 1px solid #4A3B23;
            color: #332615;
            font-size: 15px;
            height: 55px;
        }

        .status-badge {
            padding: 6px 20px;
            border-radius: 15px;
            font-size: 14px;
            font-weight: bold;
            display: inline-block;
        }

        .status-badge.reserved {
            background-color: #A3E4AE;
            color: #1E4624;
        }

        .status-badge.borrowed {
            background-color: #F1E5A5;
            color: #5C501A;
        }

        .status-badge.late {
            background-color: #F7B1B1;
            color: #611C1C;
        }

        .status-badge.admin {
            background-color: #A3E4AE;
            color: #1E4624;
        }

        .status-badge.reader {
            background-color: #F1E5A5;
            color: #5C501A;
        }

        .clickable-badge {
            cursor: pointer;
            transition: transform 0.2s ease;
        }

        .clickable-badge:hover {
            transform: scale(1.05);
        }

        .blocked-row {
            background-color: #D6C29E !important;
            opacity: 0.7;
        }

        .action-btn {
            border: none;
            background: none;
            cursor: pointer;
            font-size: 18px;
            padding: 5px;
            transition: transform 0.2s ease;
        }

        .action-btn:hover {
            transform: scale(1.2);
        }

        .check-btn {
            color: #1E4624;
            background-color: #A3E4AE;
            border: 1px solid #1E4624;
            border-radius: 4px;
            width: 25px;
            height: 25px;
            line-height: 12px;
        }

        .checked-done {
            color: #888888;
            background-color: #CCCCCC;
            border: 1px solid #888888;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            line-height: 12px;
            cursor: not-allowed;
        }

        .delete-btn {
            color: #A62B2B;
        }

        .restore-btn {
            color: #555555;
            font-size: 13px;
            background: #CCCCCC;
            padding: 3px 6px;
            border-radius: 4px;
            border: 1px solid #777777;
        }
      `}</style>

      <div className="dashboard-container">
        {/* أزرار التبويبات بالـ React onClick */}
        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'users-management' ? 'active' : ''}`} 
            onClick={() => setActiveTab('users-management')}
          >
            ادارة المستخدمين
          </button>
          <button 
            className={`tab-btn ${activeTab === 'loans-management' ? 'active' : ''}`} 
            onClick={() => setActiveTab('loans-management')}
          >
            ادارة الاعارات
          </button>
        </div>

        {/* 1. واجهة إدارة الأعارات */}
        <div id="loans-management" className={`tab-content ${activeTab === 'loans-management' ? 'active' : ''}`}>
          <div className="controls-row">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input type="text" id="loan-search-input" placeholder="اسم الكتاب" />
            </div>
            <div className="filter-box">
              <select id="loan-status-filter">
                <option value="all">جميع الاستعارات</option>
                <option value="reserved">محجوزة</option>
                <option value="borrowed">مستعارة</option>
                <option value="late">متأخرة</option>
              </select>
            </div>
          </div>
          <div className="table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>اسم المستعير</th>
                  <th>عنوان الكتاب</th>
                  <th>حالة الاستعارة</th>
                  <th>تاريخ الاعارة</th>
                  <th>تاريخ الارجاع</th>
                  <th>ارسال اشعار</th>
                </tr>
              </thead>
              <tbody id="loans-table-body">
                {loans.map((loan) => (
                  <tr key={loan.id}>
                    <td>{loan.borrower}</td>
                    <td>{loan.title}</td>
                    <td>
                      <span className={`status-badge ${loan.status}`}>{loan.badgeText}</span>
                    </td>
                    <td>{loan.dateOut}</td>
                    <td>{loan.dateIn}</td>
                    <td>
                      {loan.approved ? (
                        <button className="action-btn checked-done" disabled>✓</button>
                      ) : (
                        <button 
                          className="action-btn check-btn" 
                          onClick={() => handleApproveLoan(loan.id)}
                        >
                          ✓
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. واجهة إدارة المستخدمين */}
        <div id="users-management" className={`tab-content ${activeTab === 'users-management' ? 'active' : ''}`}>
          <div className="controls-row">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input type="text" id="user-search-input" placeholder="البحث عن مستخدم" />
            </div>
            <div className="filter-box">
              <select id="user-role-filter">
                <option value="all">جميع المستخدمين</option>
                <option value="reader">قارئ</option>
                <option value="admin">مشرف</option>
                <option value="blocked">محظور</option>
                <option value="unblocked">غير محظور</option>
              </select>
            </div>
          </div>
          <div className="table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>اسم المستخدم</th>
                  <th>بريده الالكتروني</th>
                  <th>صلاحيات المستخدم</th>
                  <th>تاريخ التسجيل</th>
                  <th>رقم قيد المستخدم</th>
                  <th>حظر المستخدم</th>
                </tr>
              </thead>
              <tbody id="users-table-body">
                {users.map((user) => (
                  <tr key={user.id} className={user.isBlocked ? "blocked-row" : ""}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span 
                        className={`status-badge ${user.role === 'مشرف' ? 'admin' : 'reader'} clickable-badge`}
                        onClick={() => handleToggleRole(user.id, user.role)}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>{user.regDate}</td>
                    <td>{user.idNum}</td>
                    <td>
                      {user.isBlocked ? (
                        <button 
                          className="action-btn restore-btn" 
                          onClick={() => handleToggleBlock(user.id, user.isBlocked)}
                        >
                          🗑️ Crossed
                        </button>
                      ) : (
                        <button 
                          className="action-btn delete-btn" 
                          onClick={() => handleToggleBlock(user.id, user.isBlocked)}
                        >
                          🗑️
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}