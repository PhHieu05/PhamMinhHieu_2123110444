import { useEffect, useState } from 'react';
import Layout from './Layout';
import api from '../api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState({ id: 0, subjectName: '', credits: 1 });

  useEffect(() => { fetchData() }, []);

  const fetchData = async () => {
    const res = await api.get('/Subjects');
    setSubjects(res.data);
  };

  const handleOpenModal = (sub = null) => {
    setCurrentSubject(sub || { id: 0, subjectName: '', credits: 1 });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (currentSubject.id === 0) await api.post('/Subjects', currentSubject);
      else await api.put(`/Subjects/${currentSubject.id}`, currentSubject);
      setIsModalOpen(false);
      fetchData();
    } catch (err) { alert('Lỗi hệ thống'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Chắc chắn xóa môn học này khỏi hệ thống?')) {
      await api.delete(`/Subjects/${id}`);
      fetchData();
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản Lý Môn Học</h1>
          <p className="page-subtitle">Quản trị các môn và khối lượng tín chỉ</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary"><Plus size={18}/> Thêm Môn Học</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr><th>Tên Môn Học</th><th>Số Tín Chỉ</th><th>Thao Tác</th></tr>
          </thead>
          <tbody>
            {subjects.map(s => (
              <tr key={s.id}>
                <td style={{fontWeight: 600}}>{s.subjectName}</td><td>{s.credits} tín chỉ</td>
                <td>
                  <div className="actions-cell">
                    <button onClick={() => handleOpenModal(s)} className="icon-btn btn-edit"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(s.id)} className="icon-btn btn-delete"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{currentSubject.id === 0 ? 'Thêm Môn Mới' : 'Cập Nhật Môn Học'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="close-btn">&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="input-group">
                <label>Tên Môn Học</label>
                <input required value={currentSubject.subjectName} onChange={e => setCurrentSubject({...currentSubject, subjectName: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Số Tín Chỉ (1-10)</label>
                <input type="number" min="1" max="10" required value={currentSubject.credits} onChange={e => setCurrentSubject({...currentSubject, credits: parseInt(e.target.value)})} />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Hủy</button>
                <button type="submit" className="btn-primary">Lưu Thay Đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
