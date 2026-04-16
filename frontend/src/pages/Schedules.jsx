import { useEffect, useState } from 'react';
import Layout from './Layout';
import api from '../api';
import { Plus, Edit2, Trash2, Calendar, Clock, MapPin, Search } from 'lucide-react';

export default function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState({ id: 0, classId: '', subjectId: '', dayOfWeek: '', timeSlot: '', room: '' });
  const [search, setSearch] = useState('');

  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resSched, resClass, resSub] = await Promise.all([
        api.get('/Schedules'),
        api.get('/Classes'),
        api.get('/Subjects')
      ]);
      setSchedules(resSched.data);
      setClasses(resClass.data);
      setSubjects(resSub.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
        const payload = {
            id: currentSchedule.id,
            classId: parseInt(currentSchedule.classId),
            subjectId: parseInt(currentSchedule.subjectId),
            dayOfWeek: currentSchedule.dayOfWeek,
            timeSlot: currentSchedule.timeSlot,
            room: currentSchedule.room
        };

        if (currentSchedule.id === 0) {
            await api.post('/Schedules', payload);
        } else {
            await api.put(`/Schedules/${currentSchedule.id}`, payload);
        }
        setShowModal(false);
        fetchData();
    } catch (err) {
        alert('Lỗi khi lưu thời khóa biểu');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa lịch này?')) {
      await api.delete(`/Schedules/${id}`);
      fetchData();
    }
  };

  const filtered = schedules.filter(s => 
    s.class?.className.toLowerCase().includes(search.toLowerCase()) ||
    s.subject?.subjectName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>📅 Quản Lý Thời Khóa Biểu</h1>
          <p style={{ color: 'var(--text-muted)' }}>Thiết lập lịch học cho các lớp</p>
        </div>
        <button onClick={() => { setCurrentSchedule({ id: 0, classId: '', subjectId: '', dayOfWeek: '', timeSlot: '', room: '' }); setShowModal(true); }} className="btn-primary">
          <Plus size={20} /> Thêm Lịch Mới
        </button>
      </div>

      <div className="table-container">
        <div className="table-header-tools">
          <div className="search-bar">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Tìm theo lớp hoặc môn học..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Lớp Học</th>
              <th>Môn Học</th>
              <th>Thứ</th>
              <th>Giờ Học</th>
              <th>Phòng</th>
              <th style={{ textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 600 }}>{s.class?.className}</td>
                <td>{s.subject?.subjectName}</td>
                <td><span className="badge badge-class">{s.dayOfWeek}</span></td>
                <td><Clock size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />{s.timeSlot}</td>
                <td><MapPin size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />{s.room}</td>
                <td style={{ textAlign: 'right' }}>
                  <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                    <button className="icon-btn btn-edit" onClick={() => { setCurrentSchedule(s); setShowModal(true); }}>
                      <Edit2 size={18} />
                    </button>
                    <button className="icon-btn btn-delete" onClick={() => handleDelete(s.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{currentSchedule.id === 0 ? 'Thêm Lịch Học' : 'Sửa Lịch Học'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="input-group">
                    <label>Lớp Học</label>
                    <select 
                      value={currentSchedule.classId} 
                      onChange={e => setCurrentSchedule({...currentSchedule, classId: e.target.value})} 
                      required
                    >
                      <option value="">Chọn lớp</option>
                      {classes.map(c => <option key={c.id} value={c.id}>{c.className}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Môn Học</label>
                    <select 
                      value={currentSchedule.subjectId} 
                      onChange={e => setCurrentSchedule({...currentSchedule, subjectId: e.target.value})} 
                      required
                    >
                      <option value="">Chọn môn</option>
                      {subjects.map(sj => <option key={sj.id} value={sj.id}>{sj.subjectName}</option>)}
                    </select>
                  </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="input-group">
                    <label>Thứ Trong Tuần</label>
                    <select 
                      value={currentSchedule.dayOfWeek} 
                      onChange={e => setCurrentSchedule({...currentSchedule, dayOfWeek: e.target.value})} 
                      required
                    >
                      <option value="">Chọn thứ</option>
                      {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Phòng Học</label>
                    <input 
                      type="text" 
                      value={currentSchedule.room} 
                      onChange={e => setCurrentSchedule({...currentSchedule, room: e.target.value})} 
                      placeholder="VD: Phòng 402"
                      required 
                    />
                  </div>
              </div>

              <div className="input-group">
                <label>Giờ Học (Time Slot)</label>
                <input 
                  type="text" 
                  value={currentSchedule.timeSlot} 
                  onChange={e => setCurrentSchedule({...currentSchedule, timeSlot: e.target.value})} 
                  placeholder="VD: 07:30 - 09:30"
                  required 
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn-primary">Lưu Lịch Học</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
