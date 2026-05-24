import { Link } from 'react-router-dom';

const LibraryLanding = () => {
  return (
    <>
      {/* تاغ الـ style المدمج لـ CSS */}
      <style>{`
        /* إجبار الصفحة على البدء من الصفر المطلق */
        html, body, #root, .App {
            margin: 0;
            padding: 0;
            height: auto !important; /* السماح للطول بالتمدد */
            min-height: 100%;
            overflow-y: auto; /* التأكد من تفعيل التمرير */
        }

        .main-container {
            direction: rtl;
            font-family: 'system-ui', -apple-system, sans-serif;
            background-color: #d8c3a5;
            min-height: 100vh;
            width: 100vw; /* عرض كامل الشاشة */
            margin: 0;
            padding: 0;
            overflow-x: hidden;
        }

        /* قسم الـ Hero */
        .hero-section {
            position: relative;
            min-height: 100vh; /* سيأخذ طول الشاشة بالكامل ويزيد إذا احتاج */
            display: flex;
            align-items: center; /* يوسط المحتوى عمودياً */
            justify-content: center;
            text-align: center;
            color: white;
            background-size: cover;
            background-position: center;
            width: 100%;
            background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/img/img.jpg');
        }

        .hero-content {
            max-width: 850px;
            padding: 0 20px;
        }

        .hero-title {
            font-size: 3.5rem;
            margin-bottom: 24px;
            font-weight: 800;
        }

        .hero-subtitle {
            font-size: 1.3rem;
            margin-bottom: 35px;
            line-height: 1.8;
            font-weight: 300;
        }

        /* الزر */
        .cta-button {
            background-color: #a67c52;
            color: white;
            padding: 14px 45px;
            border: none;
            border-radius: 10px;
            font-size: 1.25rem;
            cursor: pointer;
            margin-top: 25px;
            font-weight: bold;
            transition: 0.3s ease;
            display: inline-block;
            text-decoration: none; 
            text-align: center;
        }

        .cta-button:hover {
            background-color: #8b6542;
        }

        /* قسم المميزات */
        .features-section {
            display: flex;
            justify-content: space-around;
            align-items: flex-start;
            padding: 60px 20px;
            max-width: 1200px;
            margin: 0 auto;
            flex-wrap: wrap;
            gap: 20px;
        }

        .feature-item {
            flex: 1;
            min-width: 220px;
            text-align: center;
            padding: 15px;
        }

        .icon {
            width: 100px;
            height: 100px;
            margin-bottom: 20px;
            object-fit: contain;
        }

        .feature-title {
            color: #4e342e;
            font-size: 1.4rem;
            margin-bottom: 12px;
        }

        .feature-desc {
            color: #5d4037;
            font-size: 1rem;
        }

        /* تحسينات للشاشات الصغيرة */
        @media (max-width: 768px) {
            .hero-title {
                font-size: 2.5rem;
            }
            
            .hero-section {
                height: 500px;
            }
        }
      `}</style>

      <div className="main-container">
        {/* Hero Section */}
        <header className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              عالمك المعرفي بين يديك ...
              <span style={{ display: 'block', marginTop: '20px' }}>من الورق للشاشة</span>
            </h1>
            <h2 className="hero-subtitle">
              اكتشف آلاف العناوين، اقرأ رقمياً، أو استعر نسختك الورقية،<br/>
              مجتمع معرفي متكامل لجميع القراء
            </h2>
            <Link to="/login" className="cta-button">
              ابدأ رحلتك الآن
            </Link>
          </div>
        </header>

        {/* Features Section */}
        <section className="features-section">
          <div className="feature-item">
            <img
              src="/img/star.png"
              alt="star"
              className="icon"
            />
            <h3 className="feature-title">تقييمات المستخدمين</h3>
            <p className="feature-desc">
              شارك تجربتك <br /> ساهم في التقييم
            </p>
          </div>

          <div className="feature-item">
            <img src="/img/بدون اسم12_20260513194808.png" alt="تحميل ملفات" className="icon" />
            <h3 className="feature-title">قراءة وتحميل الملفات PDF</h3>
            <p className="feature-desc">
              احجز كتابك المفضل <br /> قبل الجميع
            </p>
          </div>

          <div className="feature-item">
            <img src="/img/بدون اسم12_20260513195200.png" alt="التقويم" className="icon" />
            <h3 className="feature-title">نظام الحجز</h3>
            <p className="feature-desc">
              نسخة ورقية <br /> فورية من أجلك
            </p>
          </div>

          <div className="feature-item">
            <img
              src="/img/بدون اسم13_20260513195258.png"
              alt="الكتب الورقية"
              className="icon"
            />
            <h3 className="feature-title">استعارة الكتب الورقية</h3>
            <p className="feature-desc">
              استعارة سهلة ومريحة <br /> من فروعنا
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default LibraryLanding;