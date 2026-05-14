import './style.css';
import { Link } from 'react-router-dom';
const LibraryLanding = () => {
  return(
<>
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
);};
export default LibraryLanding;