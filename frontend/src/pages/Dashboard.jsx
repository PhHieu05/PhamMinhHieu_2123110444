import { useEffect, useState } from 'react';
import Layout from './Layout';
import api from '../api';
import { 
  Bell, Calendar, GraduationCap, ClipboardCheck, ArrowRight, User, Book, Star, 
  LayoutDashboard, Users, BookOpen, Clock, Settings, FileText, CheckCircle, TrendingUp, Sparkles, Zap
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, classes: 0, pendingLeaves: 0, tuitionProgress: 0 });
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
          const leaveRes = await api.get('/LeaveRequests');
          const tuitionRes = await api.get('/TuitionFees');
          
          const pendingCount = leaveRes.data.filter(l => l.status === 'Pending').length;
          const fees = tuitionRes.data;
          const totalExpected = fees.reduce((sum, f) => sum + f.totalAmount, 0);
          const totalCollected = fees.filter(f => f.isPaid).reduce((sum, f) => sum + f.totalAmount, 0);
          const progress = totalExpected === 0 ? 0 : Math.round((totalCollected / totalExpected) * 100);

          setStats({
            students: studentRes.data.length,
            classes: classRes.data.length,
            pendingLeaves: pendingCount,
            tuitionProgress: progress
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
        {/* Welcome Banner */}
        <div style={{ position: 'relative', marginBottom: '40px' }}>
          <div style={{ 
            background: 'linear-gradient(to right, rgba(15, 23, 42, 0.95) 0%, rgba(30, 58, 138, 0.7) 60%, rgba(37, 99, 235, 0.2) 100%), url("/school-bg.jpg") center/cover no-repeat', 
            padding: '48px', 
            borderRadius: '28px', 
            color: 'white',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '700px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '6px 16px', borderRadius: '100px', width: 'fit-content', backdropFilter: 'blur(10px)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <Sparkles size={14} /> Hệ thống sinh viên
                </div>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '8px 0', letterSpacing: '-0.025em', lineHeight: '1.2', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                    Chào mừng trở lại,<br/>{user.fullName}! 👋
                </h1>
                <p style={{ fontSize: '1.1rem', opacity: 0.95, maxWidth: '600px', lineHeight: '1.6', marginTop: '8px', textShadow: '0 2px 8px rgba(0,0,0,0.5)', fontWeight: 500 }}>
                    Chúc bạn một ngày học tập thật năng suất. Hãy kiểm tra lịch học và các thông báo mới nhất từ nhà trường bên dưới nhé.
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <div style={{ background: 'white', color: '#1e3a8a', padding: '10px 20px', borderRadius: '14px', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>
                        <User size={18} /> @{user.username}
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="stats-grid" style={{ marginBottom: '40px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          <div className="stat-card" style={{ background: 'white', borderRadius: '24px', padding: '32px 32px 80px 32px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#4f46e5', boxShadow: '0 8px 16px rgba(79, 70, 229, 0.15)' }}>
                <Calendar size={28} />
            </div>
            <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-muted)' }}>Môn học hôm nay</span>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '8px' }}>{studentStats.classesToday} <span style={{fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 600}}>môn</span></span>
            
            <div onClick={() => window.location.href='/schedule'} style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', padding: '16px 32px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: '#4f46e5', fontWeight: 600, fontSize: '0.9rem', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}>
                Xem thời khóa biểu <ArrowRight size={16} />
            </div>
          </div>

          <div className="stat-card" style={{ background: 'white', borderRadius: '24px', padding: '32px 32px 80px 32px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#059669', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.15)' }}>
                <GraduationCap size={28} />
            </div>
            <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-muted)' }}>Điểm GPA (Hệ 10)</span>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '8px' }}>{studentStats.avg10}</span>
            
            <div onClick={() => window.location.href='/my-grades'} style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', padding: '16px 32px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: '#059669', fontWeight: 600, fontSize: '0.9rem', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}>
                Bảng điểm chi tiết <ArrowRight size={16} />
            </div>
          </div>

          <div className="stat-card" style={{ background: 'white', borderRadius: '24px', padding: '32px 32px 80px 32px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#d97706', boxShadow: '0 8px 16px rgba(217, 119, 6, 0.15)' }}>
                <ClipboardCheck size={28} />
            </div>
            <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-muted)' }}>Tỷ lệ chuyên cần</span>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '8px' }}>{studentStats.attendance}</span>
            
            <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', padding: '16px 32px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706', fontWeight: 600, fontSize: '0.9rem' }}>
                <CheckCircle size={16} /> Trạng thái: Rất Tốt
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
            {/* Notifications */}
            <div className="table-container" style={{ background: 'white', borderRadius: '28px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                <div className="table-header-tools" style={{ borderBottom: '1px solid #f1f5f9', padding: '28px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0, fontSize: '1.3rem', color: '#1e293b' }}>
                        <div style={{ background: '#e0e7ff', padding: '8px', borderRadius: '10px' }}><Bell size={22} color="#4f46e5" /></div>
                        Thông báo từ nhà trường
                    </h3>
                </div>
                <div style={{ padding: '28px' }}>
                    {notifications.length > 0 ? notifications.map((noti, idx) => (
                        <div key={idx} style={{ 
                            padding: '20px', 
                            background: idx === 0 ? 'rgba(79, 70, 229, 0.03)' : 'white', 
                            borderLeft: idx === 0 ? '4px solid #4f46e5' : '4px solid transparent',
                            borderRadius: '12px', 
                            marginBottom: idx === notifications.length - 1 ? 0 : '16px',
                            transition: 'all 0.2s ease',
                            border: '1px solid #f1f5f9',
                            boxShadow: idx === 0 ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateX(5px)';
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateX(0)';
                            e.currentTarget.style.boxShadow = idx === 0 ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none';
                        }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'flex-start' }}>
                                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>{noti.title}</div>
                                <span style={{ fontSize: '0.75rem', padding: '4px 12px', background: '#f1f5f9', color: '#475569', borderRadius: '100px', fontWeight: 600 }}>
                                    {noti.category}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.6', marginBottom: '14px' }}>{noti.content}</div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                                <Clock size={14} /> {new Date(noti.createdAt).toLocaleDateString('vi-VN')}
                            </div>
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '60px 20px', background: '#f8fafc', borderRadius: '16px' }}>
                            <Bell size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
                            <div>Hiện chưa có thông báo mới nào</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div className="table-container" style={{ background: 'white', borderRadius: '28px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                    <div className="table-header-tools" style={{ borderBottom: '1px solid #f1f5f9', padding: '28px' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0, fontSize: '1.3rem', color: '#1e293b' }}>
                            <div style={{ background: '#fef3c7', padding: '8px', borderRadius: '10px' }}><Zap size={22} color="#d97706" /></div>
                            Truy cập nhanh
                        </h3>
                    </div>
                    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <button onClick={() => window.location.href='/schedule'} className="btn-secondary" style={{ width: '100%', justifyContent: 'space-between', padding: '18px 24px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', fontWeight: 600, fontSize: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ background: 'white', padding: '10px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><Calendar size={20} color="#4f46e5" /></div>
                                Thời khóa biểu
                            </div>
                            <ArrowRight size={18} color="#94a3b8" />
                        </button>
                        
                        <button onClick={() => window.location.href='/my-grades'} className="btn-secondary" style={{ width: '100%', justifyContent: 'space-between', padding: '18px 24px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', fontWeight: 600, fontSize: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ background: 'white', padding: '10px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><GraduationCap size={20} color="#059669" /></div>
                                Điểm số chi tiết
                            </div>
                            <ArrowRight size={18} color="#94a3b8" />
                        </button>
                        
                        <button onClick={() => window.location.href='/leave-request'} className="btn-secondary" style={{ width: '100%', justifyContent: 'space-between', padding: '18px 24px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', fontWeight: 600, fontSize: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ background: 'white', padding: '10px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><Book size={20} color="#ec4899" /></div>
                                Đăng ký nghỉ học
                            </div>
                            <ArrowRight size={18} color="#94a3b8" />
                        </button>
                    </div>
                </div>

                <div style={{ 
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
                    padding: '36px', 
                    borderRadius: '28px', 
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 15px 30px rgba(15, 23, 42, 0.2)'
                }}>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>Trung tâm hỗ trợ</h3>
                        <p style={{ opacity: 0.8, fontSize: '0.95rem', marginTop: '12px', lineHeight: '1.6', marginBottom: '24px' }}>Cần trợ giúp về kỹ thuật hay học vụ? Hãy liên hệ với Phòng Đào Tạo ngay.</p>
                        <button onClick={() => window.location.href = 'mailto:phongdaotao@truong.edu.vn?subject=Yêu cầu hỗ trợ từ sinh viên'} style={{ background: 'white', color: '#0f172a', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                            Gửi yêu cầu <ArrowRight size={16} />
                        </button>
                    </div>
                    <div style={{ position: 'absolute', bottom: '-10px', right: '10px', opacity: 0.1, zIndex: 1 }}>
                        <Settings size={120} />
                    </div>
                </div>
            </div>
        </div>
      </Layout>
    );
  }

  // ADMIN DASHBOARD
  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
        <div>
            <h1 style={{ fontWeight: 800, fontSize: '2.2rem', letterSpacing: '-0.5px', color: '#1e293b', marginBottom: '8px' }}>Trang Quản Trị Hệ Thống</h1>
            <p style={{ color: '#64748b', fontSize: '1.05rem' }}>Theo dõi các chỉ số quan trọng và quản lý dữ liệu đào tạo.</p>
        </div>
        <button onClick={handleSeedData} style={{ background: 'linear-gradient(135deg, #ec4899 0%, #e11d48 100%)', color: 'white', border: 'none', padding: '14px 24px', borderRadius: '14px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(225, 29, 72, 0.2)', transition: 'all 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <Sparkles size={20} /> Khởi tạo dữ liệu mẫu
        </button>
      </div>
      
      {/* Admin Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        
        {/* Stat Card 1 */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '32px 32px 64px 32px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ background: '#eff6ff', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#3b82f6' }}>
                <Users size={28} />
            </div>
            <div style={{ color: '#64748b', fontWeight: 600, fontSize: '1.05rem', marginBottom: '8px' }}>Tổng Sinh Viên</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b' }}>{stats.students}</div>
            
            <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', padding: '12px 32px', background: '#f8fafc', fontSize: '0.85rem', color: '#3b82f6', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={14} /> Tăng 12% so với tháng trước
            </div>
        </div>

        {/* Stat Card 2 */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '32px 32px 64px 32px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ background: '#f0fdf4', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#22c55e' }}>
                <BookOpen size={28} />
            </div>
            <div style={{ color: '#64748b', fontWeight: 600, fontSize: '1.05rem', marginBottom: '8px' }}>Lớp Học Đang Mở</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b' }}>{stats.classes}</div>
            
            <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', padding: '12px 32px', background: '#f8fafc', fontSize: '0.85rem', color: '#22c55e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={14} /> Cập nhật hôm nay
            </div>
        </div>

        {/* Stat Card 3 */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '32px 32px 64px 32px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ background: '#fef3c7', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#f59e0b' }}>
                <FileText size={28} />
            </div>
            <div style={{ color: '#64748b', fontWeight: 600, fontSize: '1.05rem', marginBottom: '8px' }}>Đơn Nghỉ Chờ Duyệt</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b' }}>{stats.pendingLeaves}</div>
            
            <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', padding: '12px 32px', background: '#f8fafc', fontSize: '0.85rem', color: '#f59e0b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={14} /> Cần xử lý sớm
            </div>
        </div>

        {/* Stat Card 4 */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '32px 32px 64px 32px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ background: '#f3e8ff', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#a855f7' }}>
                <TrendingUp size={28} />
            </div>
            <div style={{ color: '#64748b', fontWeight: 600, fontSize: '1.05rem', marginBottom: '8px' }}>Tiến Độ Học Phí</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b' }}>{stats.tuitionProgress}%</div>
            
            <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', padding: '12px 32px', background: '#f8fafc', fontSize: '0.85rem', color: '#a855f7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={14} /> Đạt chỉ tiêu
            </div>
        </div>
      </div>
      
      {/* Activity Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          <div className="table-container" style={{ background: 'white', borderRadius: '28px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <div className="table-header-tools" style={{ padding: '28px', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', color: '#1e293b' }}>
                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '12px' }}><LayoutDashboard size={20} color="#4f46e5" /></div>
                  Hoạt động gần đây
              </h3>
            </div>
            <div style={{ padding: '60px 40px', textAlign: 'center', color: '#94a3b8' }}>
              <LayoutDashboard size={64} style={{ opacity: 0.15, marginBottom: '20px' }} />
              <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Hệ thống đang hoạt động ổn định</div>
              <p style={{ maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>Chào mừng Admin. Hãy chọn các danh mục quản lý bên thanh công cụ bên trái để bắt đầu quản lý sinh viên, điểm số và các lớp học.</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '32px' }}>
                  <button onClick={() => window.location.href='/students'} style={{ background: '#f1f5f9', color: '#334155', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e=>e.target.style.background='#e2e8f0'} onMouseLeave={e=>e.target.style.background='#f1f5f9'}>Quản lý Sinh viên</button>
                  <button onClick={() => window.location.href='/classes'} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(79,70,229,0.2)' }} onMouseEnter={e=>e.target.style.transform='translateY(-2px)'} onMouseLeave={e=>e.target.style.transform='translateY(0)'}>Xem Lớp học</button>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Quick Profile/System Status */}
              <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '28px', padding: '32px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 15px 30px rgba(15,23,42,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', position: 'relative', zIndex: 2 }}>
                      <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.2)' }}>
                          <User size={32} />
                      </div>
                      <div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{user.fullName}</div>
                          <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>Quản trị viên cấp cao</div>
                      </div>
                  </div>
                  
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', position: 'relative', zIndex: 2 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                          <span style={{ color: '#94a3b8' }}>Trạng thái Server</span>
                          <span style={{ color: '#22c55e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></div> Online</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                          <span style={{ color: '#94a3b8' }}>Cập nhật lần cuối</span>
                          <span style={{ color: 'white', fontWeight: 500 }}>Vừa xong</span>
                      </div>
                  </div>
                  
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05, zIndex: 1 }}>
                      <Settings size={150} />
                  </div>
              </div>
          </div>
      </div>
    </Layout>
  );
}
