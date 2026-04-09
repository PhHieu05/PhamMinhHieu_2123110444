import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, BookOpen, GraduationCap, ClipboardList, PenTool } from 'lucide-react';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menu = [
    { name: 'Tổng Quan', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Sinh Viên', path: '/students', icon: <Users size={20} /> },
    { name: 'Lớp Học', path: '/classes', icon: <BookOpen size={20} /> },
    { name: 'Khóa Học / Môn', path: '/subjects', icon: <GraduationCap size={20} /> },
    { name: 'Điểm Số', path: '/grades', icon: <PenTool size={20} /> },
    { name: 'Điểm Danh', path: '/attendances', icon: <ClipboardList size={20} /> },
  ];

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>🎓 Quản Lý SV</h2>
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
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} /> 
          Đăng Xuất
        </button>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
