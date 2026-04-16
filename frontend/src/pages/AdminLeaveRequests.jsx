import { useEffect, useState } from 'react';
import Layout from './Layout';
import api from '../api';
import { Check, X, Clock, User, Calendar, FileText, Search } from 'lucide-react';

export default function AdminLeaveRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/LeaveRequests');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    const actionText = status === 'Approved' ? 'Duyệt' : 'Từ chối';
    if (window.confirm(`Bạn có chắc muốn ${actionText} đơn này?`)) {
      try {
        await api.put(`/LeaveRequests/${id}/status`, status, {
            headers: { 'Content-Type': 'application/json' }
        });
        fetchRequests();
      } catch (err) {
        alert('Lỗi cập nhật trạng thái');
      }
    }
  };

  const filtered = requests.filter(r => 
    r.student?.fullName.toLowerCase().includes(search.toLowerCase()) ||
    r.reason.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>📋 Phê Duyệt Đơn Nghỉ Học</h1>
        <p style={{ color: 'var(--text-muted)' }}>Quản lý và xét duyệt các yêu cầu vắng mặt từ sinh viên</p>
      </div>

      <div className="table-container">
        <div className="table-header-tools">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Tìm theo tên SV hoặc lý do..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Sinh viên</th>
              <th>Ngày nghỉ</th>
              <th>Lý do</th>
              <th>Ngày gửi</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(req => (
              <tr key={req.id}>
                <td>
                    <div style={{ fontWeight: 600 }}>{req.student?.fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.student?.studentCode}</div>
                </td>
                <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                        <Calendar size={14} color="var(--primary)" />
                        {new Date(req.leaveDate).toLocaleDateString('vi-VN')}
                    </div>
                </td>
                <td style={{ maxWidth: '300px' }}>
                    <div style={{ fontSize: '0.9rem', color: '#475569' }}>{req.reason}</div>
                </td>
                <td>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {new Date(req.createdAt).toLocaleString('vi-VN')}
                    </div>
                </td>
                <td>
                    <span className={`badge`} style={{ 
                        background: req.status === 'Approved' ? '#dcfce7' : req.status === 'Rejected' ? '#fef2f2' : '#f1f5f9',
                        color: req.status === 'Approved' ? '#166534' : req.status === 'Rejected' ? '#991b1b' : '#475569'
                    }}>
                        {req.status === 'Approved' ? 'Đã duyệt' : req.status === 'Rejected' ? 'Từ chối' : 'Chờ duyệt'}
                    </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {req.status === 'Pending' ? (
                      <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                        <button className="icon-btn" style={{ background: '#dcfce7', color: '#166534' }} onClick={() => handleAction(req.id, 'Approved')}>
                          <Check size={18} />
                        </button>
                        <button className="icon-btn" style={{ background: '#fef2f2', color: '#991b1b' }} onClick={() => handleAction(req.id, 'Rejected')}>
                          <X size={18} />
                        </button>
                      </div>
                  ) : (
                      <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Đã xử lý</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
                <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Không có đơn xin nghỉ nào cần xử lý</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
