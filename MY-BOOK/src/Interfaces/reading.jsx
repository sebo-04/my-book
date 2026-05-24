import { useState, useEffect, useRef } from 'react';

function ReadingInterface({ bookId }) {
  // 1. تعريف المتغيرات والحالات الأساسية للواجهة (تأكدي من وجودها كاملة)
  const [bookInfo, setBookInfo] = useState({ 
    title: 'رواية: في غسق المدينة', 
    author: 'علي المحمدي', 
    totalPages: 215 
  });
  
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const readerViewportRef = useRef(null);

  useEffect(() => {
    // هنا سيتم جلب البيانات الحقيقية لاحقاً بناءً على الـ bookId القادم من الباك إند
  }, [bookId]);

  // 2. دالة مراقبة التمرير العمودي لتحديث رقم الصفحة الحالية تلقائياً
  const handleScroll = () => {
    const viewport = readerViewportRef.current;
    if (!viewport) return;

    const pageElements = viewport.querySelectorAll('.book-page');
    let visiblePage = 1;

    pageElements.forEach((page) => {
      const rect = page.getBoundingClientRect();
      if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
        visiblePage = page.getAttribute('data-page');
      }
    });
    setCurrentPage(visiblePage);
  };

  // 3. دالة التحكم بنسبة التكبير والتصغير وضبط حدودها
  const handleZoomChange = (newValue) => {
    const validatedValue = Math.max(50, Math.min(150, newValue));
    setZoom(validatedValue);
  };

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>واجهة القراءة الرقمية</title>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />
      
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
                --bg-main: #f3f4f6;
                --bg-interface: #fff3dd; 
                --bg-paper: #fcfcf9;
                --text-dark: #3D2C1E;
                --text-muted: #6B5E51;
                --accent-color: #D4A373;
                --accent-hover: #b58253;
                --sidebar-width: 280px;
            }

            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
                font-family: 'Cairo', sans-serif;
            }

            body {
                background-color: var(--bg-main);
                height: 100vh;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                color: var(--text-dark);
            }

            .top-navbar {
                background-color: var(--bg-interface);
                border-bottom: 2px solid rgba(61, 44, 30, 0.1);
                padding: 12px 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 70px;
                z-index: 10;
            }

            .book-info h1 {
                font-size: 1.25rem;
                font-weight: 700;
                color: var(--text-dark);
                margin-bottom: 2px;
            }

            .book-info p {
                font-size: 0.85rem;
                color: var(--text-muted);
            }

            .nav-actions {
                display: flex;
                gap: 12px;
            }

            .btn-action {
                background-color: transparent;
                border: 1px solid var(--text-dark);
                color: var(--text-dark);
                padding: 8px 16px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s ease;
            }

            .btn-action:hover {
                background-color: var(--text-dark);
                color: #fff;
            }

            .btn-primary {
                background-color: #2b6cb0;
                color: white;
                border: none;
            }
            
            .btn-primary:hover {
                background-color: #1a446c;
            }

            .main-container {
                display: flex;
                flex: 1;
                height: calc(100vh - 130px); 
                position: relative;
            }

            .reader-viewport {
                flex: 1;
                background-color: rgba(61, 44, 30, 0.03);
                overflow-y: auto; 
                padding: 40px 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 30px;
                scroll-behavior: smooth;
            }

            .book-page {
                background-color: var(--bg-paper);
                width: 100%;
                max-width: ${800 * (zoom / 100)}px; 
                min-height: 1000px; 
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                border-radius: 4px;
                padding: 60px;
                position: relative;
                transition: max-width 0.1s ease;
                transform-origin: top center;
            }

            .page-content-placeholder {
                color: #2d3748;
                line-height: 2;
                font-size: 1.1rem;
                text-align: justify;
            }

            .page-number-indicator {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 0.85rem;
                color: var(--text-muted);
            }

            .bottom-control-bar {
                background-color: var(--bg-interface);
                border-top: 2px solid rgba(61, 44, 30, 0.1);
                height: 60px;
                padding: 0 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                z-index: 10;
            }

            .zoom-controls {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .zoom-btn {
                background: none;
                border: none;
                color: var(--text-dark);
                font-size: 1.1rem;
                cursor: pointer;
                padding: 5px;
                transition: color 0.2s;
            }

            .zoom-btn:hover {
                color: var(--accent-color);
            }

            .zoom-slider {
                -webkit-appearance: none;
                width: 150px;
                height: 6px;
                border-radius: 3px;
                background: rgba(61, 44, 30, 0.2);
                outline: none;
            }

            .zoom-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: var(--text-dark);
                cursor: pointer;
                transition: background 0.2s;
            }

            .zoom-slider::-webkit-slider-thumb:hover {
                background: var(--accent-color);
            }

            .zoom-value {
                font-size: 0.9rem;
                font-weight: 600;
                min-width: 45px;
            }

            .page-counter {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
                font-size: 0.95rem;
            }

            .page-counter span {
                color: var(--accent-color);
            }
          `
        }}
      />

      {/* شريط العنوان العلوي الفعلي */}
      <header className="top-navbar">
        <div className="book-info">
          <h1>{bookInfo.title}</h1>
          <p>الكاتب: {bookInfo.author}</p>
        </div>
        <div className="nav-actions">
          <button className="btn-action btn-primary">
            <i className="fa-solid fa-bookmark" /> حجز نسخة ورقية
          </button>
          <button className="btn-action">
            <i className="fa-solid fa-arrow-left" /> العودة للمكتبة
          </button>
        </div>
      </header>

      {/* منطقة عرض الصفحات (المحتوى التخيلي الحالي) */}
      <div className="main-container">
        <main className="reader-viewport" id="readerViewport" ref={readerViewportRef} onScroll={handleScroll}>
          <div className="book-page" data-page={1}>
            <div className="page-content-placeholder">
              <p>
                هنا يتم عرض نص الصفحة الأولى من ملف الـ PDF المسترجع من الخادم
                (Node.js)... هذا النص يحاكي محتوى الكتاب الفعلي حيث تتدفق الأسطر
                بشكل عمودي مريح للعين لتسهيل القراءة والمتابعة السلسة دون انقطاع.
              </p>
            </div>
            <div className="page-number-indicator">صفحة 1</div>
          </div>
          <div className="book-page" data-page={2}>
            <div className="page-content-placeholder">
              <p>
                هنا يظهر محتوى الصفحة الثانية. عند الاستمرار في التمرير لأسفل
                (Scrolling), يتحرك القارئ كأنه يقرأ قائمة متصلة، وهو النمط الأفضل
                لسرعة التصفح والبحث داخل النصوص الطويلة والروايات.
              </p>
            </div>
            <div className="page-number-indicator">صفحة 2</div>
          </div>
          <div className="book-page" data-page={3}>
            <div className="page-content-placeholder">
              <p>
                هنا يظهر محتوى الصفحة الثالثة. يمكنك إضافة أي عدد من الصفحات
                ديناميكياً باستخدام الـ Backend لتقوم بتحميل الصفحات تلو الأخرى
                (Lazy Loading) لضمان سرعة فائقة في الأداء وعدم ثقل المتصفح.
              </p>
            </div>
            <div className="page-number-indicator">صفحة 3</div>
          </div>
        </main>
      </div>

      {/* شريط التحكم السفلي بعد ربط المتغيرات بالكامل */}
      <footer className="bottom-control-bar">
        <div className="zoom-controls">
          <button className="zoom-btn" onClick={() => handleZoomChange(zoom - 10)}>
            <i className="fa-solid fa-minus" />
          </button>
          <input
            type="range"
            className="zoom-slider"
            min={50}
            max={150}
            value={zoom}
            onChange={(e) => handleZoomChange(Number(e.target.value))}
          />
          <button className="zoom-btn" onClick={() => handleZoomChange(zoom + 10)}>
            <i className="fa-solid fa-plus" />
          </button>
          <span className="zoom-value">
            {zoom}%
          </span>
        </div>
        <div className="page-counter">
          المنظر الحالي: صفحة <span>{currentPage}</span> من إجمالي{" "}
          <span>{bookInfo.totalPages}</span>
        </div>
      </footer>
    </>
  );
}

export default ReadingInterface;