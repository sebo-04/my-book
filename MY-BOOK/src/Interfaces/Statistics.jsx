import { useEffect, useRef, useMemo, useState } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
const Dashboard = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [stats, setStats] = useState({ lateLoans: 0, activeLoans: 0, totalUsers: 0, totalBooks: 0 });
  const [chartData, setChartData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:3030/api/dashboard/stats');
        const data = await response.json();
        
        if (data.success) {
          setStats(data.statsData);
          setChartData(data.chartData);
        }
      } catch (error) {
        console.error('Error fetching stats from API:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  const defaultChartData = useMemo(() => {
    return chartData;
  }, [chartData]);
  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
          datasets: [{
            label: 'معدل الاستعارات',
            data: defaultChartData,
            borderColor: '#1A1A1A',
            borderWidth: 2,
            pointBackgroundColor: '#1A1A1A', 
            pointRadius: 3,
            tension: 0.1, 
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
              beginAtZero: true, 
              ticks: { color: '#332929', font: { size: 11 } },
              grid: { color: '#4A3E3D', lineWidth: 0.7 }
            }
          }
        }
      });
    }
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [defaultChartData]);
  const styles = {
    pageWrapper: {
      backgroundColor: '#FDF6E2',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      margin: '0',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      color: '#4A3E3D',
      width: '100%',
    },
    dashboardContainer: {
      width: '100%',
      maxWidth: '1000px',
      padding: '20px',
      direction: 'rtl',
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
      textAlign: 'right',
    },
    chartSubtitle: {
      fontSize: '12px',
      color: '#554A49',
      marginBottom: '15px',
      textAlign: 'right',
    },
    canvasContainer: {
      position: 'relative',
      width: '100%',
      height: '350px',
    },
    loadingText: {
      textAlign: 'center',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#4A3E3D'
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.dashboardContainer}>
        <div style={styles.tabTitle}>الإحصاءات</div>
        
        {loading ? (
          <div style={styles.loadingText}>جاري تحميل الإحصائيات الحية... 🔄</div>
        ) : (
          <>
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
              <div style={styles.chartSubtitle}>الأيام / الأشهر (السنة الحالية)</div>
              <div style={styles.canvasContainer}>
                <canvas ref={chartRef} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default Dashboard;