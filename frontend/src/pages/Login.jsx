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
        <div className="logo-icon">🏫</div>
        
        <h1>Hệ Thống Quản Lý</h1>
        <p className="subtitle">Trường Quốc Tế GIS - Connect Globally</p>
        
        {error && <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontWeight: 600, fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <div className="input-group">
            <label>Tên đăng nhập hoặc Mã SV</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="VD: admin hoặc SV001" 
              required
            />
          </div>
          
          <div className="input-group">
            <label>Mật khẩu</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mặc định: 123" 
              required
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Đăng Nhập Hệ Thống
          </button>
        </form>
        
        <p className="footer-link">
          Chưa có tài khoản quản trị? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}
