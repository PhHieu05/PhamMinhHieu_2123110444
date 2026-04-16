import { useEffect, useState } from 'react';
import Layout from './Layout';
import api from '../api';
import { Bell, Calendar, GraduationCap, ClipboardCheck, ArrowRight, User, Book, Star, LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, classes: 0 });
  const [notifications, setNotifications] = useState([]);
  const [studentStats, setStudentStats] = useState({ avg10: '0.0', attendance: '100%', classesToday: 0 });
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'Admin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (role === 'Admin') {
          const studentRes = await api.get('/Students');
          const classRes = await api.get('/Classes');
          setStats({
            students: studentRes.data.length,
            classes: classRes.data.length
          });
        } else {
            const notiRes = await api.get('/Notifications');
            setNotifications(notiRes.data.slice(0, 5));

                if (user.studentId) {
                    const avgRes = await api.get(`/Grades/average/${user.studentId}`);
                    const scheduleRes = await api.get(`/Schedules/class/${user.classId}`);
                
                setStudentStats({
                    avg10: avgRes.data.averageMark || '0.0',
                    attendance: '98%',
                    classesToday: scheduleRes.data.length > 0 ? scheduleRes.data.length : 0
                });
            }
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchData();
  }, [role, user.studentId, user.ClassId]);

  const handleSeedData = async () => {
    const isForce = window.confirm('Bạn có muốn xóa dữ liệu cũ và tạo mới dữ liệu mẫu không?');
    try {
      const res = await api.post(`/Seed?force=${isForce}`);
      alert(res.data.message);
      window.location.reload();
    } catch (err) {
      alert('Lỗi tạo dữ liệu mẫu');
    }
  };

  if (role !== 'Admin') {
    return (
      <Layout>
        <div style={{ position: 'relative', marginBottom: '40px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
            padding: '40px', 
            borderRadius: '24px', 
            color: 'white',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.025em' }}>
                    Chào mừng trở lại, {user.fullName}! 👋
                </h1>
                <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', lineHeight: '1.6' }}>
                    Hệ thống đã cập nhật kết quả học tập và thời khóa biểu mới nhất từ <strong>Phòng Đào Tạo</strong>. Chúc bạn một ngày học tập hiệu quả!
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '100px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(10px)' }}>
                        <User size={16} /> @{user.username}
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '100px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(10px)' }}>
                        <Star size={16} /> Sinh viên chính quy
                    </div>
                </div>
            </div>
            {/* Decorative circles */}
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', filter: 'blur(50px)' }}></div>
            <div style={{ position: 'absolute', bottom: '-20px', left: '20%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', filter: 'blur(40px)' }}></div>
          </div>
        </div>

        <div className="stats-grid" style={{ marginBottom: '40px' }}>
          <div className="stat-card" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ background: '#e0e7ff', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: '#4f46e5' }}>
                <Calendar size={24} />
            </div>
            <span className="stat-title" style={{ fontSize: '1rem', fontWeight: 600 }}>Thời khóa biểu</span>
            <span className="stat-value" style={{ fontSize: '2rem' }}>{studentStats.classesToday} Môn học</span>
            <div style={{ fontSize: '0.85rem', color: '#4f46e5', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => window.location.href='/schedule'}>
                Xem chi tiết <ArrowRight size={14} />
            </div>
          </div>

          <div className="stat-card" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ background: '#dcfce7', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: '#059669' }}>
                <GraduationCap size={24} />
            </div>
            <span className="stat-title" style={{ fontSize: '1rem', fontWeight: 600 }}>GPA (Hệ 10)</span>
            <span className="stat-value" style={{ fontSize: '2rem' }}>{studentStats.avg10}</span>
            <div style={{ fontSize: '0.85rem', color: '#059669', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => window.location.href='/my-grades'}>
                Bảng điểm <ArrowRight size={14} />
            </div>
          </div>

          <div className="stat-card" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ background: '#fef3c7', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: '#d97706' }}>
                <ClipboardCheck size={24} />
            </div>
            <span className="stat-title" style={{ fontSize: '1rem', fontWeight: 600 }}>Chuyên cần</span>
            <span className="stat-value" style={{ fontSize: '2rem' }}>{studentStats.attendance}</span>
            <div style={{ fontSize: '0.85rem', color: '#d97706', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Trạng thái: Tốt
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
            <div className="table-container" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '24px' }}>
                <div className="table-header-tools" style={{ borderBottom: '1px solid #f1f5f9', padding: '24px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0, fontSize: '1.25rem' }}>
                        <Bell size={24} color="#6366f1" /> Thông báo từ Phòng Đào Tạo
                    </h3>
                </div>
                <div style={{ padding: '24px' }}>
                    {notifications.length > 0 ? notifications.map((noti, idx) => (
                        <div key={idx} style={{ 
                            padding: '20px', 
                            background: '#f8fafc', 
                            borderRadius: '16px', 
                            marginBottom: idx === notifications.length - 1 ? 0 : '16px',
                            transition: 'all 0.2s ease',
                            border: '1px solid transparent'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#f8fafc';
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b' }}>{noti.title}</div>
                                <span style={{ fontSize: '0.75rem', padding: '4px 10px', background: '#e2e8f0', borderRadius: '100px', fontWeight: 600, height: 'fit-content' }}>
                                    {noti.category}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.5', marginBottom: '12px' }}>{noti.content}</div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{new Date(noti.createdAt).toLocaleDateString('vi-VN')}</div>
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Hiện chưa có thông báo mới nào</div>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div className="table-container" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '24px' }}>
                    <div className="table-header-tools" style={{ borderBottom: '1px solid #f1f5f9', padding: '24px' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                            🚀 Truy cập nhanh
                        </h3>
                    </div>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button onClick={() => window.location.href='/schedule'} className="btn-secondary" style={{ width: '100%', justifyContent: 'space-between', padding: '16px', borderRadius: '14px', background: '#f1f5f9', border: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Calendar size={18} /> Thời khóa biểu</div>
                            <ArrowRight size={16} />
                        </button>
                        <button onClick={() => window.location.href='/my-grades'} className="btn-secondary" style={{ width: '100%', justifyContent: 'space-between', padding: '16px', borderRadius: '14px', background: '#f1f5f9', border: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><GraduationCap size={18} /> Điểm số chi tiết</div>
                            <ArrowRight size={16} />
                        </button>
                        <button onClick={() => window.location.href='/leave-request'} className="btn-secondary" style={{ width: '100%', justifyContent: 'space-between', padding: '16px', borderRadius: '14px', background: '#f1f5f9', border: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Book size={18} /> Đăng ký nghỉ học</div>
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>

                <div style={{ 
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', 
                    padding: '32px', 
                    borderRadius: '24px', 
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Hỗ trợ sinh viên</h3>
                    <p style={{ opacity: 0.9, fontSize: '0.9rem', marginTop: '12px', lineHeight: '1.5' }}>Gặp khó khăn trong quá trình học tập hoặc sử dụng hệ thống? Liên hệ ngay với chúng tôi.</p>
                    <button style={{ background: 'white', color: '#4f46e5', border: 'none', padding: '10px 20px', borderRadius: '10px', marginTop: '16px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                        Gửi yêu cầu hỗ trợ
                    </button>
                    <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', fontSize: '100px', opacity: 0.1 }}>💬</div>
                </div>
            </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontWeight: 800 }}>Bảng Điều Khiển Tổng Quan</h1>
        <button onClick={handleSeedData} className="btn-primary" style={{ width: 'auto', background: 'var(--secondary)' }}>
          🌱 Tạo Dữ Liệu Mẫu (Seed Data)
        </button>
      </div>
      
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
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
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <LayoutDashboard size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
          <div>Chào mừng đến với Hệ thống Quản lí Sinh viên. Vui lòng bấm vào Menu bên trái để tiến hành thao tác các chức năng!</div>
        </div>
      </div>
    </Layout>
  );
}
