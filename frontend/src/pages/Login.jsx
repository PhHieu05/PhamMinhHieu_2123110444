import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/Users/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError('Tài khoản hoặc mật khẩu không chính xác');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Placeholder for School Logo, you can replace '🏫' with an actual img tag if needed */}
        <div style={{ fontSize: '3rem', marginBottom: '16px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>🏫</div>
        
        <h1>Hệ Thống Quản Lý</h1>
        <p>Trường Quốc Tế GIS - Connect Globally</p>
        
        {error && <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontWeight: 600 }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <div className="input-group">
            <label>Tên đăng nhập</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập của giáo viên/admin" 
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
          
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px', padding: '14px' }}>
            Đăng Nhập Quản Trị
          </button>
        </form>
        
        <p style={{ marginTop: '28px', color: 'var(--text-muted)' }}>
          Chưa có tài khoản quản trị? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}
