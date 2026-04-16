import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/Users/register', {
        username,
        password,
        fullName,
        role: 'Admin'
      });
      setSuccess('Tạo tài khoản thành công! Tự động chuyển hướng...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data || 'Không thể tạo tài khoản. Tên người dùng có thể đã tồn tại.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-icon">📝</div>
        <h1>Đăng Ký Tài Khoản</h1>
        <p className="subtitle">Quản trị viên Trường Quốc Tế GIS</p>

        {error && <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontWeight: 600, fontSize: '0.9rem' }}>{error}</div>}
        {success && <div style={{ color: '#16a34a', backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontWeight: 600, fontSize: '0.9rem' }}>{success}</div>}

        <form onSubmit={handleRegister} style={{ textAlign: 'left' }}>
          <div className="input-group">
            <label>Họ và Tên</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="VD: Nguyễn Văn A"
              required
            />
          </div>

          <div className="input-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Chọn tên đăng nhập (VD: admin_gis)"
              required
            />
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu an toàn"
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Tạo Tài Khoản
          </button>
        </form>

        <p className="footer-link">
          Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </p>
      </div>
    </div>
  );
}
