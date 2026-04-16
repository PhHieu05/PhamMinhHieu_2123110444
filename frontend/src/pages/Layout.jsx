import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, LogOut, BookOpen,
  GraduationCap, ClipboardList, PenTool,
  Calendar, Bell, FileText
} from 'lucide-react';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const adminMenu = [
    { name: 'Tổng Quan', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Sinh Viên', path: '/students', icon: <Users size={20} /> },
    { name: 'Lớp Học', path: '/classes', icon: <BookOpen size={20} /> },
    { name: 'Khóa Học / Môn', path: '/subjects', icon: <GraduationCap size={20} /> },
    { name: 'Thời Khóa Biểu', path: '/schedules', icon: <Calendar size={20} /> },
    { name: 'Duyệt Đơn Nghỉ', path: '/leave-requests', icon: <FileText size={20} /> },
    { name: 'Điểm Số', path: '/grades', icon: <PenTool size={20} /> },
    { name: 'Điểm Danh', path: '/attendances', icon: <ClipboardList size={20} /> },
  ];

  const studentMenu = [
    { name: 'Bảng Điều Khiển', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Thời Khóa Biểu', path: '/schedule', icon: <Calendar size={20} /> },
    { name: 'Xem Điểm Số', path: '/my-grades', icon: <PenTool size={20} /> },
    { name: 'Thông Báo', path: '/notifications', icon: <Bell size={20} /> },
    { name: 'Xin Nghỉ Học', path: '/leave-request', icon: <FileText size={20} /> },
  ];

  const menu = role === 'Admin' ? adminMenu : studentMenu;

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '10px' }}>
          <h2 style={{ margin: 0 }}>🎓 Quản Lý SV</h2>
          <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '4px' }}>
            {role === 'Admin' ? 'Phòng đào tạo' : 'Sinh viên/Phụ huynh'}
          </div>
        </div>
        <nav className="sidebar-nav">
          {menu.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', padding: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', marginBottom: '12px' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.fullName}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>@{user.username}</div>
          </div>
          <button onClick={handleLogout} className="logout-btn" style={{ width: '100%', margin: 0 }}>
            <LogOut size={20} />
            Đăng Xuất
          </button>
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
