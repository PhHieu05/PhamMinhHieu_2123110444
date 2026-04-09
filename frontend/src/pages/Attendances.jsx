import { useEffect, useState } from 'react';
import Layout from './Layout';
import api from '../api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Attendances() {
  const [attendances, setAttendances] = useState([]);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState({ id: 0, studentId: '', date: new Date().toISOString().split('T')[0], status: 'Có mặt', note: '' });

  useEffect(() => { fetchData() }, []);

  const fetchData = async () => {
    try {
      const [attRes, stuRes] = await Promise.all([ api.get('/Attendances'), api.get('/Students') ]);
      setAttendances(attRes.data);
      setStudents(stuRes.data);
    } catch (err) { console.error(err); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (currentAttendance.id === 0) await api.post('/Attendances', { ...currentAttendance, studentId: parseInt(currentAttendance.studentId) });
      else await api.put(`/Attendances/${currentAttendance.id}`, { ...currentAttendance, studentId: parseInt(currentAttendance.studentId) });
      setIsModalOpen(false);
      fetchData();
    } catch (err) { alert('Lỗi khi lưu điểm danh'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xóa bản ghi điểm danh này?')) {
      await api.delete(`/Attendances/${id}`);
      fetchData();
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản Lý Điểm Danh</h1>
          <p className="page-subtitle">Theo dõi và quản lý chuyên cần sinh viên</p>
        </div>
        <button onClick={() => { setCurrentAttendance({ id: 0, studentId: students[0]?.id || '', date: new Date().toISOString().split('T')[0], status: 'Có mặt', note: '' }); setIsModalOpen(true); }} className="btn-primary" style={{ width: 'auto' }}><Plus size={18}/> Tạo Điểm Danh</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr><th>Tên Sinh Viên</th><th>Ngày Thực Hiện</th><th>Trạng Thái</th><th>Ghi Chú</th><th style={{textAlign: 'right'}}>Thao Tác</th></tr>
          </thead>
          <tbody>
            {attendances.map(a => (
              <tr key={a.id}>
                <td style={{fontWeight: 600}}>{students.find(s => s.id === a.studentId)?.fullName || a.studentId}</td>
                <td>{new Date(a.date).toLocaleDateString('vi-VN')}</td>
                <td><span className="badge" style={{ background: a.status === 'Có mặt' ? '#dcfce7' : '#fee2e2', color: a.status === 'Có mặt' ? '#166534' : '#991b1b' }}>{a.status}</span></td>
                <td>{a.note || '-'}</td>
                <td>
                  <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                    <button onClick={() => { setCurrentAttendance({...a, date: a.date.split('T')[0]}); setIsModalOpen(true); }} className="icon-btn btn-edit"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(a.id)} className="icon-btn btn-delete"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {attendances.length === 0 && (
              <tr><td colSpan="5" style={{textAlign: 'center', padding: '32px', color: 'var(--text-muted)'}}>Chưa có dữ liệu điểm danh.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{currentAttendance.id === 0 ? 'Thêm Điểm Danh' : 'Cập Nhật Điểm Danh'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="close-btn">&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="input-group">
                <label>Họ Tên Sinh Viên</label>
                <select required value={currentAttendance.studentId} onChange={e => setCurrentAttendance({...currentAttendance, studentId: e.target.value})}>
                  <option value="" disabled>-- Chọn sinh viên --</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Ngày Thực Hiện</label>
                <input type="date" required value={currentAttendance.date} onChange={e => setCurrentAttendance({...currentAttendance, date: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Trạng Thái</label>
                <select required value={currentAttendance.status} onChange={e => setCurrentAttendance({...currentAttendance, status: e.target.value})}>
                  <option value="Có mặt">Có mặt</option>
                  <option value="Vắng có phép">Vắng có phép</option>
                  <option value="Vắng không phép">Vắng không phép</option>
                </select>
              </div>
              <div className="input-group">
                <label>Ghi Chú Chung</label>
                <input value={currentAttendance.note || ''} onChange={e => setCurrentAttendance({...currentAttendance, note: e.target.value})} placeholder="Vd: Lý do vắng..." />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy Form</button>
                <button type="submit" className="btn-primary" style={{ width: 'auto' }}>Lưu Xác Nhận</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
