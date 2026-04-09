import { useEffect, useState } from 'react';
import Layout from './Layout';
import api from '../api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState({ id: 0, className: '', schoolYear: '' });

  useEffect(() => { fetchData() }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/Classes');
      setClasses(res.data);
    } catch (err) { console.error(err); }
  };

  const handleOpenModal = (cls = null) => {
    setCurrentClass(cls || { id: 0, className: '', schoolYear: '' });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (currentClass.id === 0) await api.post('/Classes', currentClass);
      else await api.put(`/Classes/${currentClass.id}`, currentClass);
      setIsModalOpen(false);
      fetchData();
    } catch (err) { alert('Lỗi lưu thay đổi'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Chắc chắn xóa lớp học này?')) {
      await api.delete(`/Classes/${id}`);
      fetchData();
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản Lý Lớp Học</h1>
          <p className="page-subtitle">Danh sách tất cả lớp học trong hệ thống</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary"><Plus size={18}/> Thêm Lớp Mới</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr><th>Tên Lớp Học</th><th>Niên Khóa</th><th>Thao Tác</th></tr>
          </thead>
          <tbody>
            {classes.map(c => (
              <tr key={c.id}>
                <td style={{fontWeight: 600}}>{c.className}</td><td>{c.schoolYear}</td>
                <td>
                  <div className="actions-cell">
                    <button onClick={() => handleOpenModal(c)} className="icon-btn btn-edit"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(c.id)} className="icon-btn btn-delete"><Trash2 size={16}/></button>
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
              <h3 className="modal-title">{currentClass.id === 0 ? 'Thêm Lớp' : 'Sửa Lớp Học'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="close-btn">&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="input-group">
                <label>Tên Lớp</label>
                <input required value={currentClass.className} onChange={e => setCurrentClass({...currentClass, className: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Niên Khóa (VD: 2023-2027)</label>
                <input required value={currentClass.schoolYear} onChange={e => setCurrentClass({...currentClass, schoolYear: e.target.value})} />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Hủy Bỏ</button>
                <button type="submit" className="btn-primary">Lưu Thay Đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
