import { useEffect, useState } from 'react';
import Layout from './Layout';
import api from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, classes: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const studentRes = await api.get('/Students');
        const classRes = await api.get('/Classes');
        setStats({
          students: studentRes.data.length,
          classes: classRes.data.length
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  const handleSeedData = async () => {
    try {
      const res = await api.post('/Seed');
      alert(res.data.message);
      window.location.reload();
    } catch (err) {
      alert('Lỗi tạo dữ liệu mẫu');
    }
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>Bảng Điều Khiển Tổng Quan</h1>
        <button onClick={handleSeedData} className="btn-primary" style={{ width: 'auto', background: 'var(--secondary)' }}>
          🌱 Tạo Dữ Liệu Mẫu (Seed Data)
        </button>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-title">Tổng Số Sinh Viên</span>
          <span className="stat-value">{stats.students}</span>
        </div>
        
        <div className="stat-card">
          <span className="stat-title">Tổng Số Lớp Học</span>
          <span className="stat-value">{stats.classes}</span>
        </div>
      </div>
      
      <div className="table-container">
        <div className="table-header-tools">
          <h3 style={{ fontSize: '1.25rem' }}>Hoạt động gần đây</h3>
        </div>
        <div style={{ padding: '24px', color: 'var(--text-muted)' }}>
          Chào mừng đến với Hệ thống Quản lí Sinh viên. Vui lòng bấm vào Menu bên trái để tiến hành thao tác các chức năng!
        </div>
      </div>
    </Layout>
  );
}
