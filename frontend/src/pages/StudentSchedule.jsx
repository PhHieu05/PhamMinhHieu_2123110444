import { useEffect, useState } from 'react';
import Layout from './Layout';
import api from '../api';
import { Calendar as CalendarIcon, Clock, MapPin, Download } from 'lucide-react';

export default function StudentSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        if (user.classId) {
          const res = await api.get(`/Schedules/class/${user.classId}`);
          setSchedule(res.data);
        }
      } catch (err) {
        console.error("Error fetching schedule:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [user.classId]);



  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px' }}>📅 Thời Khóa Biểu</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Lịch học theo tuần - Học kỳ 2, Năm học 2023-2024</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => window.print()} className="btn-secondary" style={{ padding: '10px 16px', borderRadius: '12px', cursor: 'pointer' }}><Download size={18} /> Xuất PDF</button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '16px' }}>Đang tải lịch học của bạn...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {days.map(day => {
            const classes = schedule.filter(s => s.dayOfWeek === day);
            const isToday = new Date().toLocaleDateString('vi-VN', { weekday: 'long' }).includes(day.replace('Thứ ', ''));
            
            return (
              <div key={day} className="table-container" style={{ 
                background: 'white', 
                minHeight: '250px', 
                borderRadius: '24px', 
                border: isToday ? '2px solid var(--primary)' : '1px solid #f1f5f9',
                boxShadow: isToday ? '0 15px 30px -10px rgba(99, 102, 241, 0.2)' : '0 4px 6px -1px rgba(0,0,0,0.05)',
                overflow: 'hidden'
              }}>
                <div className="table-header-tools" style={{ 
                    background: isToday ? 'var(--primary)' : '#f8fafc', 
                    padding: '20px',
                    borderBottom: '1px solid #f1f5f9'
                }}>
                  <h3 style={{ 
                    fontSize: '1.2rem', 
                    color: isToday ? 'white' : '#1e293b', 
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    {day} {isToday && <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '100px', fontWeight: 600 }}>Hôm nay</span>}
                  </h3>
                </div>
                <div style={{ padding: '20px' }}>
                  {classes.length > 0 ? (
                    classes.map((cls, idx) => (
                      <div key={idx} style={{ 
                        padding: '16px', 
                        borderRadius: '20px', 
                        background: '#f8fafc', 
                        marginBottom: idx === classes.length - 1 ? 0 : '16px',
                        borderLeft: '4px solid #6366f1',
                        transition: 'transform 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                      >
                        <div style={{ fontWeight: 800, marginBottom: '10px', color: '#1e293b', fontSize: '1.05rem' }}>
                          {cls.subject?.subjectName || 'N/A'}
                        </div>
                        <div style={{ display: 'grid', gap: '8px', fontSize: '0.85rem', color: '#64748b' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ background: '#e0e7ff', padding: '4px', borderRadius: '6px', color: '#4f46e5' }}><Clock size={14} /></div>
                            <strong>{cls.timeSlot}</strong>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ background: '#fef3c7', padding: '4px', borderRadius: '6px', color: '#d97706' }}><MapPin size={14} /></div>
                            <span>{cls.room}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#cbd5e1' }}>
                      <CalendarIcon size={40} style={{ opacity: 0.1, marginBottom: '16px' }} />
                      <div style={{ fontSize: '0.9rem' }}>Không có lịch học</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
