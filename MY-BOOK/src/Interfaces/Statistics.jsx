import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

// تسجيل المكونات الأساسية لـ Chart.js لتعمل في بيئة التصدير
Chart.register(...registerables);

const Dashboard = ({ statsData, chartData }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // قيم افتراضية في حال لم يتم تمرير بيانات من الباك اند بعد
  const stats = statsData || { lateLoans: 5, activeLoans: 20, totalUsers: 80, totalBooks: 50 };
  const defaultChartData = chartData || [1, 7, 4, 15, 11, 6, 12, 11, 11, 18, 10, 21];

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // تدمير المخطط القديم إذا كان موجوداً لمنع تكرار الرندرة (Memory Leaks)
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // بناء المخطط البياني الجديد
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
          datasets: [{
            label: 'معدل الاستعارات',
            data: defaultChartData,
            borderColor: '#1A1A1A',
            borderWidth: 2,
            pointBackgroundColor: 'transparent',
            pointBorderColor: 'transparent',
            tension: 0,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              grid: { color: '#4A3E3D', lineWidth: 0.7 },
              ticks: { color: '#332929', font: { size: 12, weight: 'bold' } }
            },
            y: {
              min: 1,
              max: 30,
              ticks: { stepSize: 5, color: '#332929', font: { size: 11 } },
              grid: { color: '#4A3E3D', lineWidth: 0.7 }
            }
          }
        }
      });
    }

    // تنظيف المخطط عند خروج المكون من الواجهة (Unmount)
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [defaultChartData]);

  // تعيين كائن ستايل عام متوافق مع React يطبق على الـ body أو الحاوية المحيطة
  useEffect(() => {
    // لتطبيق تنسيق الخلفية وعناصر العرض المتمركزة على الصفحة كاملة
    document.body.style.backgroundColor = '#FDF6E2';
    document.body.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    document.body.style.margin = '0';
    document.body.style.padding = '20px';
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';
    document.body.style.minHeight = '100vh';
    document.body.style.color = '#4A3E3D';
  }, []);

  // كائنات الـ CSS المدمجة (Styles Objects)
  const styles = {
    dashboardContainer: {
      width: '100%',
      maxWidth: '1000px',
      backgroundColor: '#FDF6E2',
      padding: '20px',
    },
    tabTitle: {
      backgroundColor: '#CDB48F',
      color: '#332929',
      width: 'fit-content',
      padding: '10px 30px',
      fontWeight: 'bold',
      fontSize: '18px',
      borderRadius: '8px 8px 0 0',
      border: '2px solid #4A3E3D',
      borderBottom: 'none',
      boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
      marginBottom: '20px',
      marginRight: '20px',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '15px',
      marginBottom: '30px',
    },
    statCard: {
      backgroundColor: '#D7C4A5',
      border: '2px solid #4A3E3D',
      borderRadius: '15px',
      padding: '15px',
      textAlign: 'center',
      position: 'relative',
      boxShadow: 'inset 0 0 5px rgba(0,0,0,0.05)',
    },
    statTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#332929',
    },
    statValueContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 15px',
    },
    statNumber: {
      fontSize: '24px',
      fontWeight: 'bold',
    },
    statIcon: {
      fontSize: '22px',
    },
    lateIcon: {
      backgroundColor: '#EFA7A7',
      padding: '2px 6px',
      borderRadius: '5px',
      border: '1px solid #C57878',
      fontSize: '22px',
    },
    chartSection: {
      backgroundColor: '#CDB48F',
      border: '2px solid #4A3E3D',
      borderRadius: '20px',
      padding: '25px',
      boxShadow: '0px 4px 10px rgba(0,0,0,0.05)',
    },
    chartTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '5px',
      color: '#332929',
    },
    chartSubtitle: {
      fontSize: '12px',
      color: '#554A49',
      marginBottom: '15px',
    },
    canvasContainer: {
      position: 'relative',
      width: '100%',
      height: '350px',
    },
  };

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.tabTitle}>الإحصاءات</div>
      
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statTitle}>الاستعارات المتأخرة</div>
          <div style={styles.statValueContainer}>
            <span style={styles.statNumber}>{stats.lateLoans}</span>
            <span style={styles.lateIcon}>📕</span>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statTitle}>الكتب المستعارة</div>
          <div style={styles.statValueContainer}>
            <span style={styles.statNumber}>{stats.activeLoans}</span>
            <span style={styles.statIcon}>⇄</span>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statTitle}>إجمالي المستخدمين</div>
          <div style={styles.statValueContainer}>
            <span style={styles.statNumber}>{stats.totalUsers}</span>
            <span style={styles.statIcon}>👥</span>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statTitle}>إجمالي الكتب</div>
          <div style={styles.statValueContainer}>
            <span style={styles.statNumber}>{stats.totalBooks}</span>
            <span style={styles.statIcon}>📖</span>
          </div>
        </div>
      </div>

      <div style={styles.chartSection}>
        <div style={styles.chartTitle}>نشاط الإعارات</div>
        <div style={styles.chartSubtitle}>الأيام / الأشهر</div>
        <div style={styles.canvasContainer}>
          <canvas ref={chartRef} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;