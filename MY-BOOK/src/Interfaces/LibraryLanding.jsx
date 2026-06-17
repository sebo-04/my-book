import { Link } from 'react-router-dom';
const LibraryLanding = () => {
  const features = [
    {
      id: 1,
      icon: "/img/star.png",
      title: "تقييمات المستخدمين",
      desc: "شاركي تجربتكِ واقرئي مراجعات المجتمع لترشيحات الكتب"
    },
    {
      id: 2,
      icon: "/img/بدون اسم12_20260513194808.png",
      title: "قراءة وتحميل ملفات PDF",
      desc: "وصول فوري للنسخ الرقمية والكتب الإلكترونية بجودة عالية"
    },
    {
      id: 3,
      icon: "/img/بدون اسم12_20260513195200.png",
      title: "نظام الحجز الذكي",
      desc: "احجزي كتابكِ المفضل عبر المنصة قبل زيارة المكتبة لضمان توفره"
    },
    {
      id: 4,
      icon: "/img/بدون اسم13_20260513195258.png",
      title: "استعارة الكتب الورقية",
      desc: "إدارة مرنة لفترات الاستعارة ومواعيد التسليم من الفروع"
    }
  ];
  return (
    <>
      <style>{`
        html, body, #root, .App {
            margin: 0 !important;
            padding: 0 !important;
            min-height: 100vh !important;
            background-color: #d8c3a5 !important;
            overflow-y: auto !important;
        }
        .main-container {
            direction: rtl;
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            background-color: #d8c3a5;
            min-height: 100vh;
            width: 100%;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
        }
 .hero-section {
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: white;
            width: 100%;
            background-image: linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('/img/img.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            padding: 40px 20px;
            box-sizing: border-box;
        }
        .hero-content {
            max-width: 850px;
            width: 100%;
            z-index: 2;
        }
        .hero-title {
            font-size: calc(2rem + 1.5vw); 
            margin-bottom: 24px;
            font-weight: 800;
            color: #ffffff;
            line-height: 1.4;
        }
        .hero-subtitle {
            font-size: calc(1rem + 0.3vw);
            margin-bottom: 35px;
            line-height: 1.8;
            font-weight: 400;
            color: #f5eee0;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
        }
 .cta-button {
            background-color: #a67c52;
            color: white;
            padding: 14px 45px;
            border: none;
            border-radius: 10px;
            font-size: 1.2rem;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
            display: inline-block;
            text-decoration: none; 
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
 .cta-button:hover {
            background-color: #8b6542;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
 .features-section {
            display: flex;
            justify-content: space-around;
            align-items: flex-start;
            padding: 40px 4%;
            max-width: 1200px;
            margin: 0 auto 40px auto;
            flex-wrap: wrap;
            gap: 20px;
            background-color: #d8c3a5;
            width: 100%;
            box-sizing: border-box;
        }
 .feature-item {
            flex: 1;
            min-width: 220px;
            max-width: 260px;
            background: transparent; 
            text-align: center;
            padding: 10px;
            border-radius: 0;
            box-shadow: none;
            border: none;
            transition: transform 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
      .feature-item:hover {
            transform: translateY(-5px);
        }
  .icon {
            width: 90px;
            height: 90px;
            margin-bottom: 15px;
            object-fit: contain;
        }
  .feature-title {
            color: #5a3811;
            font-size: 1.3rem;
            margin: 0 0 10px 0;
            font-weight: 800; 
        }
        .feature-desc {
            color: #3e270f; 
            font-size: 1rem;
            line-height: 1.5;
            margin: 0;
            font-weight: 500;
            max-width: 90%;
        }
  @media (max-width: 768px) {
            .hero-section {
                min-height: 80vh;
            }
            .features-section {
                padding: 30px 10px;
                gap: 35px;
            }
            .feature-item {
                max-width: 100%;
                min-width: 200px;
            }
        }
      `}</style>
      <div className="main-container">
        <header className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              عالمكِ المعرفي بين يديكِ ...
              <span style={{ display: 'block', marginTop: '10px' }}>من الورق للشاشة</span>
            </h1>
            <h2 className="hero-subtitle">
              اكتشفي آلاف العناوين، اقرئي رقمياً، أو استعيري نسختكِ الورقية؛
              مجتمع معرفي متكامل مصمم خصيصاً لجميع القراء وشغوفي المعرفة.
            </h2>
            <Link to="/login" className="cta-button">
              ابدئ رحلتكِ الآن
            </Link>
          </div>
        </header>
        <section className="features-section">
          {features.map((feature) => (
            <div className="feature-item" key={feature.id}>
              <img
                src={feature.icon}
                alt={feature.title}
                className="icon"
                loading="lazy"
              />
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </>
  );
};
export default LibraryLanding;