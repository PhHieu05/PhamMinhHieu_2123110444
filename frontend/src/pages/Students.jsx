import { useEffect, useState } from 'react';
import Layout from './Layout';
import api from '../api';
import { Plus, Edit2, Trash2, Search, BookOpen, Calendar } from 'lucide-react';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({
    id: 0,
    studentCode: '',
    fullName: '',
    birthday: new Date().toISOString().split('T')[0],
    classId: ''
  });
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stuRes, classRes] = await Promise.all([
        api.get('/Students'),
        api.get('/Classes')
      ]);
      setStudents(stuRes.data);
      setClasses(classRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (student = null) => {
    if (student) {
      setCurrentStudent({
        ...student,
        birthday: student.birthday.split('T')[0],
      });
    } else {
      setCurrentStudent({
        id: 0,
        studentCode: '',
        fullName: '',
        birthday: new Date().toISOString().split('T')[0],
        classId: classes.length > 0 ? classes[0].id : ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (currentStudent.id === 0) {
        await api.post('/Students', {
          ...currentStudent,
          classId: parseInt(currentStudent.classId)
        });
      } else {
        await api.put(`/Students/${currentStudent.id}`, {
          ...currentStudent,
          classId: parseInt(currentStudent.classId)
        });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Lỗi lưu thông tin thiết lập sinh viên');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sinh viên này khỏi hệ thống?')) {
      try {
        await api.delete(`/Students/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Hồ Sơ Sinh Viên</h1>
          <p className="page-subtitle">Quản lý, xem và cập nhật hồ sơ lưu trữ toàn hệ thống</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary">
          <Plus size={20} /> Thêm Sinh Viên Mới
        </button>
      </div>

      <div className="table-container">
        <div className="table-header-tools">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Tìm theo tên hoặc mã sinh viên..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
            Tổng cộng: {filteredStudents.length} Sinh Viên
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Hồ Sơ</th>
              <th>Ngày Sinh</th>
              <th>Khóa / Lớp Đang Học</th>
              <th style={{ textAlign: 'right' }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id}>
                <td>
                  <div className="student-col">
                    <img 
                      src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(student.fullName)}&backgroundColor=e0e7ff`} 
                      alt="avatar" 
                      className="student-avatar"
                    />
                    <div className="student-info">
                      <span className="student-name">{student.fullName}</span>
                      <span className="student-id">Mã SV: {student.studentCode}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                    <Calendar size={16} />
                    {new Date(student.birthday).toLocaleDateString('vi-VN')}
                  </span>
                </td>
                <td>
                  <span className="badge badge-class">
                    <BookOpen size={14} />
                    {classes.find(c => c.id === student.classId)?.className || student.classId}
                  </span>
                </td>
                <td>
                  <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                    <button onClick={() => handleOpenModal(student)} className="icon-btn btn-edit" title="Sửa">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(student.id)} className="icon-btn btn-delete" title="Xóa">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <Search size={48} style={{ opacity: 0.2 }} />
                    <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Không tìm thấy sinh viên nào.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{currentStudent.id === 0 ? 'Thêm Mới Sinh Viên' : 'Chỉnh Sửa Hồ Sơ'}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="close-btn">&times;</button>
            </div>
            
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Mã Sinh Viên</label>
                  <input 
                    type="text" 
                    value={currentStudent.studentCode}
                    onChange={e => setCurrentStudent({...currentStudent, studentCode: e.target.value})}
                    required 
                    placeholder="VD: SV001"
                  />
                </div>
                
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Họ và Tên</label>
                  <input 
                    type="text" 
                    value={currentStudent.fullName}
                    onChange={e => setCurrentStudent({...currentStudent, fullName: e.target.value})}
                    required 
                    placeholder="VD: Nguyễn Văn A"
                  />
                </div>
              </div>
              
              <div className="input-group" style={{ marginTop: '20px' }}>
                <label>Ngày Sinh</label>
                <input 
                  type="date" 
                  value={currentStudent.birthday}
                  onChange={e => setCurrentStudent({...currentStudent, birthday: e.target.value})}
                  required 
                />
              </div>

              <div className="input-group">
                <label>Phân Lớp</label>
                <select 
                  value={currentStudent.classId}
                  onChange={e => setCurrentStudent({...currentStudent, classId: e.target.value})}
                  required
                >
                  <option value="" disabled>-- Vui lòng chọn lớp học --</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.className}</option>
                  ))}
                </select>
              </div>
              
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                  Hủy Bỏ
                </button>
                <button type="submit" className="btn-primary">
                  {currentStudent.id === 0 ? 'Tạo Sinh Viên' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
