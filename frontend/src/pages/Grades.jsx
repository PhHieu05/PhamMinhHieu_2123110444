import { useEffect, useState } from 'react';
import Layout from './Layout';
import api from '../api';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

export default function Grades() {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGrade, setCurrentGrade] = useState({ id: 0, studentId: '', subjectId: '', mark: 0, type: '', semester: 1 });

  useEffect(() => { fetchData() }, []);

  const fetchData = async () => {
    try {
      const [gradesRes, stuRes, subRes] = await Promise.all([
        api.get('/Grades'), api.get('/Students'), api.get('/Subjects')
      ]);
      setGrades(gradesRes.data);
      setStudents(stuRes.data);
      setSubjects(subRes.data);
    } catch (err) { console.error(err); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        id: currentGrade.id,
        studentId: parseInt(currentGrade.studentId),
        subjectId: parseInt(currentGrade.subjectId),
        mark: parseFloat(currentGrade.mark),
        type: currentGrade.type,
        semester: parseInt(currentGrade.semester)
      };

      if (currentGrade.id === 0) await api.post('/Grades', payload);
      else await api.put(`/Grades/${currentGrade.id}`, payload);
      setIsModalOpen(false);
      fetchData();
    } catch (err) { alert('Lỗi khi lưu điểm'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Chắc chắn xóa bản ghi điểm này?')) {
      await api.delete(`/Grades/${id}`);
      fetchData();
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản Lý Điểm Số</h1>
          <p className="page-subtitle">Nhập điểm, theo dõi bảng điểm kỳ học</p>
        </div>
        <button onClick={() => { setCurrentGrade({ id: 0, studentId: students[0]?.id || '', subjectId: subjects[0]?.id || '', mark: 0, type: '15p', semester: 1 }); setIsModalOpen(true); }} className="btn-primary" style={{ width: 'auto' }}><Plus size={18}/> Thêm Điểm Số</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr><th>Sinh Viên</th><th>Môn Học</th><th>Điểm Số</th><th>Trọng số / Loại</th><th>Học Kỳ</th><th style={{textAlign: 'right'}}>Thao Tác</th></tr>
          </thead>
          <tbody>
            {grades.map(g => (
              <tr key={g.id}>
                <td style={{fontWeight: 600}}>{students.find(s => s.id === g.studentId)?.fullName || g.studentId}</td>
                <td>{subjects.find(s => s.id === g.subjectId)?.subjectName || g.subjectId}</td>
                <td><span className="badge" style={{ background: g.mark < 5 ? '#fef2f2' : '#f0fdf4', color: g.mark < 5 ? '#ef4444' : '#16a34a' }}>{g.mark} / 10</span></td>
                <td>{g.type}</td><td>Kỳ {g.semester}</td>
                <td>
                  <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                    <button onClick={() => { setCurrentGrade(g); setIsModalOpen(true); }} className="icon-btn btn-edit"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(g.id)} className="icon-btn btn-delete"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {grades.length === 0 && (
              <tr><td colSpan="6" style={{textAlign: 'center', padding: '32px', color: 'var(--text-muted)'}}>Chưa có dữ liệu điểm.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{currentGrade.id === 0 ? 'Thêm Điểm Mới' : 'Cập Nhật Điểm'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="close-btn">&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="input-group">
                <label>Sinh Viên</label>
                <select required value={currentGrade.studentId} onChange={e => setCurrentGrade({...currentGrade, studentId: e.target.value})}>
                  <option value="" disabled>-- Chọn sinh viên --</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Môn Học</label>
                <select required value={currentGrade.subjectId} onChange={e => setCurrentGrade({...currentGrade, subjectId: e.target.value})}>
                  <option value="" disabled>-- Chọn môn học --</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.subjectName}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label>Điểm Số (0 - 10)</label>
                  <input type="number" step="0.1" min="0" max="10" required value={currentGrade.mark} onChange={e => setCurrentGrade({...currentGrade, mark: parseFloat(e.target.value)})} />
                </div>
                <div className="input-group">
                  <label>Loại (VD: 15p, Giữa kỳ)</label>
                  <input required value={currentGrade.type} onChange={e => setCurrentGrade({...currentGrade, type: e.target.value})} />
                </div>
              </div>
              <div className="input-group">
                <label>Học Kỳ</label>
                <input type="number" min="1" max="2" required value={currentGrade.semester} onChange={e => setCurrentGrade({...currentGrade, semester: parseInt(e.target.value)})} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-primary">Lưu Chỉnh Sửa</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
