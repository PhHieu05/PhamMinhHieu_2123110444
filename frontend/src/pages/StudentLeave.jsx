import { useEffect, useState } from 'react';
import Layout from './Layout';
import api from '../api';
import { Send, FileText, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function StudentLeave() {
  const [formData, setFormData] = useState({
    leaveDate: '',
    reason: '',
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchHistory();
  }, [user.studentId]);

  const fetchHistory = async () => {
    try {
      if (user.studentId) {
        const res = await api.get(`/LeaveRequests/student/${user.studentId}`);
        setHistory(res.data);
      }
    } catch (err) {
      console.error("Error fetching leave history:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/LeaveRequests', {
        studentId: user.studentId,
        leaveDate: formData.leaveDate,
        reason: formData.reason
      });
      alert('Đơn xin nghỉ học của bạn đã được gửi và đang chờ phê duyệt!');
      setFormData({ leaveDate: '', reason: '' });
      fetchHistory();
    } catch (err) {
      alert('Có lỗi xảy ra khi gửi đơn.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
        case 'Approved': return <span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>Đã duyệt</span>;
        case 'Rejected': return <span className="badge" style={{ background: '#fef2f2', color: '#991b1b' }}>Từ chối</span>;
        default: return <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>Chờ duyệt</span>;
    }
  };

  return (
    <Layout>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>📝 Đăng Ký Xin Nghỉ Học</h1>
        <p style={{ color: 'var(--text-muted)' }}>Gửi yêu cầu nghỉ học chính thức tới giáo viên chủ nhiệm</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div className="table-container" style={{ background: 'white', padding: '32px', borderRadius: '24px' }}>
            <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={20} color="var(--primary)" /> Mẫu đơn trực tuyến
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Ngày xin nghỉ</label>
                    <input 
                        type="date" 
                        required 
                        value={formData.leaveDate}
                        onChange={e => setFormData({...formData, leaveDate: e.target.value})}
                    />
                </div>
                <div className="input-group">
                    <label>Lý do nghỉ học</label>
                    <textarea 
                        style={{ 
                            width: '100%', 
                            padding: '14px', 
                            borderRadius: '12px', 
                            border: '2px solid var(--border)',
                            minHeight: '120px',
                            fontFamily: 'inherit'
                        }}
                        placeholder="VD: Lý do sức khỏe, việc gia đình bận..."
                        required
                        value={formData.reason}
                        onChange={e => setFormData({...formData, reason: e.target.value})}
                    ></textarea>
                </div>
                <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                    <Send size={18} /> {loading ? 'Đang gửi...' : 'Gửi Đơn Phê Duyệt'}
                </button>
            </form>
        </div>

        <div>
            <div className="table-container" style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '24px', marginBottom: '24px', borderRadius: '24px' }}>
                <h4 style={{ color: '#991b1b', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <AlertCircle size={18} /> Lưu ý quan trọng
                </h4>
                <ul style={{ color: '#991b1b', fontSize: '0.9rem', paddingLeft: '20px', lineHeight: '1.6' }}>
                    <li>Đơn xin nghỉ học phải được gửi trước ít nhất 24h đối với việc gia đình.</li>
                    <li>Mọi đơn xin nghỉ học đều phải được giáo viên bộ môn hoặc chủ nhiệm phê duyệt.</li>
                    <li>Nếu được duyệt, bạn sẽ được tính là "Nghỉ có phép" trong hệ thống điểm danh.</li>
                </ul>
            </div>

            <div className="table-container" style={{ background: 'white', borderRadius: '24px' }}>
                <div className="table-header-tools" style={{ padding: '24px', borderBottom: '1px solid #f1f5f9' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Lịch sử yêu cầu</h3>
                </div>
                <div style={{ padding: '0 24px' }}>
                    {history.length > 0 ? history.map((req, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderBottom: idx === history.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                            <div>
                                <div style={{ fontWeight: 700, color: '#1e293b' }}>Ngày nghỉ: {new Date(req.leaveDate).toLocaleDateString('vi-VN')}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Lý do: {req.reason}</div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Gửi lúc: {new Date(req.createdAt).toLocaleString('vi-VN')}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {getStatusBadge(req.status)}
                            </div>
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Chưa có yêu cầu nào</div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </Layout>
  );
}
