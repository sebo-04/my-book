<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>الملف الشخصي والكتب المستعارة</title>
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n        /* استيراد خط متناسق يدعم العربية */\n        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght=400;500;700&display=swap');\n\n        * {\n            box-sizing: border-box;\n            margin: 0;\n            padding: 0;\n            font-family: 'Tajawal', sans-serif;\n        }\n\n        body {\n            background-color: #f7eed0; /* لون الخلفية البيج الخارجي */\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            min-height: 100vh;\n            padding: 20px;\n        }\n\n        /* الحاوية الرئيسية */\n        .dashboard-container {\n            background-color: #fffde9; /* لون لوحة العرض الداخلية */\n            width: 100%;\n            max-width: 800px;\n            padding: 40px;\n            border-radius: 8px;\n            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);\n            display: flex;\n            flex-direction: column;\n            gap: 35px;\n        }\n\n        /* العناوين الرئيسية للأقسام */\n        .section-title {\n            color: #8c6239;\n            font-size: 1.3rem;\n            font-weight: 700;\n            margin-bottom: 12px;\n            text-align: right;\n        }\n\n        /* ==================== قسم الملف الشخصي ==================== */\n        .profile-card {\n            background-color: #cca474; /* اللون البني الفاتح للبطاقة */\n            border-radius: 15px;\n            padding: 25px 30px;\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n            box-shadow: inset 0 0 10px rgba(0,0,0,0.05);\n        }\n\n        .profile-info {\n            flex: 1;\n            display: flex;\n            flex-direction: column;\n            gap: 15px;\n        }\n\n        .info-row {\n            display: flex;\n            align-items: center;\n            gap: 15px;\n        }\n\n        .info-row label {\n            color: #5c3a21;\n            font-weight: 700;\n            font-size: 1rem;\n            min-width: 60px;\n            text-align: right;\n        }\n\n        .info-value {\n            background-color: #ffffff;\n            color: #333;\n            width: 100%;\n            max-width: 300px;\n            padding: 8px 15px;\n            border-radius: 8px;\n            min-height: 38px;\n            font-size: 0.95rem;\n            border: 1px solid #bfa280;\n            box-shadow: inset 0 2px 4px rgba(0,0,0,0.08);\n            display: flex;\n            align-items: center;\n        }\n\n        .user-role {\n            color: #5c3a21;\n            font-weight: 700;\n            font-size: 1rem;\n            margin-top: 5px;\n            text-align: right;\n        }\n\n        .profile-avatar-wrapper {\n            margin-right: 20px;\n        }\n\n        .profile-avatar {\n            width: 110px;\n            height: 110px;\n            background-color: #ffffff;\n            border-radius: 50%;\n            border: 2px solid #5c3a21;\n            object-fit: cover;\n            display: block;\n        }\n\n        /* ==================== قسم الجدول ==================== */\n        .table-container {\n            border: 1.5px solid #4a2f1b;\n            border-radius: 8px;\n            overflow: hidden;\n            background-color: #dfc49f;\n        }\n\n        table {\n            width: 100%;\n            border-collapse: collapse;\n            text-align: center;\n        }\n\n        th {\n            background-color: #8c6239;\n            color: #ffffff;\n            padding: 12px;\n            font-weight: 700;\n            font-size: 1rem;\n            border-bottom: 1.5px solid #4a2f1b;\n        }\n\n        th:not(:last-child), td:not(:last-child) {\n            border-left: 1.5px solid #4a2f1b;\n        }\n\n        td {\n            padding: 12px;\n            height: 45px;\n            color: #4a2f1b;\n            font-weight: 500;\n            border-bottom: 1.5px solid #4a2f1b;\n        }\n\n        tr:last-child td {\n            border-bottom: none;\n        }\n\n        /* ==================== قسم الحالة الفارغة (حين لا توجد كتب) ==================== */\n        .empty-state-container {\n            display: flex;\n            flex-direction: column;\n            align-items: center;\n            justify-content: center;\n            padding: 30px;\n            background-color: #dfc49f; /* نفس لون خلفية الجدول لتوحيد الهوية */\n            border: 1.5px dashed #4a2f1b; /* إطار متقطع لإعطاء مظهر جمالي */\n            border-radius: 8px;\n            text-align: center;\n            gap: 15px;\n        }\n\n        .empty-state-text {\n            color: #4a2f1b;\n            font-size: 1.1rem;\n            font-weight: 700;\n        }\n\n        .empty-state-img {\n            max-width: 150px;\n            height: auto;\n            object-fit: contain;\n            display: block;\n        }\n\n        /* استجابة الشاشات الصغيرة */\n        @media (max-width: 600px) {\n            .profile-card {\n                flex-direction: column-reverse;\n                gap: 20px;\n            }\n            .info-row {\n                flex-direction: column;\n                align-items: flex-start;\n                gap: 5px;\n            }\n            .info-value {\n                max-width: 100%;\n            }\n            .profile-avatar-wrapper {\n                margin-right: 0;\n            }\n        }\n    "
    }}
  />
  <div className="dashboard-container">
    <div className="profile-section">
      <h2 className="section-title">الملف الشخصي</h2>
      <div className="profile-card">
        <div className="profile-info">
          <div className="info-row">
            <label>الاسم</label>
            <div className="info-value" />
          </div>
          <div className="info-row">
            <label>الايميل</label>
            <div className="info-value" dir="ltr" />
          </div>
          <div className="user-role">
            دور المستخدم: <span className="role-text" />
          </div>
        </div>
        <div className="profile-avatar-wrapper">
          <img
            src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235c3a21' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='8' r='4'/><path d='M20 21a8 8 0 0 0-16 0'/></svg>"
            alt="User Avatar"
            className="profile-avatar"
          />
        </div>
      </div>
    </div>
    <div className="borrowed-books-section">
      <h2 className="section-title">الكتب المستعارة</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>تاريخ الارجاع</th>
              <th>تاريخ الاستعارة</th>
              <th>عنوان الكتاب</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td />
              <td />
              <td />
            </tr>
          </tbody>
        </table>
      </div>
      <div className="empty-state-container">
        <p className="empty-state-text">لا يوجد كتب مستعارة حالياً</p>
        <img
          src="رابط_الصورة_القادمة_من_الداتابيس.png"
          alt="No Borrowed Books"
          className="empty-state-img"
        />
      </div>
    </div>
  </div>
</>
