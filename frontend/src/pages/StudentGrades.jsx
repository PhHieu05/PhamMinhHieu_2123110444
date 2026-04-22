import { useEffect, useState } from 'react';
import Layout from './Layout';
import api from '../api';
import { Award, TrendingUp, BookOpen, ChevronRight, FileSpreadsheet } from 'lucide-react';

export default function StudentGrades() {
  const [grades, setGrades] = useState([]);
  const [stats, setStats] = useState({ avg10: 0, avg4: 0, credits: 0 });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        if (user.studentId) {
          const res = await api.get(`/Grades/student/${user.studentId}`);
          setGrades(res.data);
          
          if (res.data.length > 0) {
            const sum = res.data.reduce((acc, curr) => acc + curr.mark, 0);
            const avg = sum / res.data.length;
            const totalCredits = res.data.reduce((acc, curr) => acc + (curr.subject?.credits || 0), 0);
            setStats({
              avg10: avg.toFixed(2),
              avg4: (avg * 0.4).toFixed(2),
              credits: totalCredits
            });
          }
        }
      } catch (err) {
        console.error("Error fetching grades:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, [user.studentId]);

  const handleDownloadExcel = () => {
    const headers = ['Môn học', 'Mã HP', 'Tín chỉ', 'Hình thức', 'Điểm số (Hệ 10)', 'Điểm số (Hệ 4)', 'Kết quả'];
    
    const rows = grades.map(g => {
      const subjectName = `"${g.subject?.subjectName || ''}"`;
      const subjectId = `"${g.subjectId || ''}"`;
      const credits = g.subject?.credits || 0;
      const type = `"${g.type || ''}"`;
      const mark10 = g.mark || 0;
      const mark4 = (g.mark * 0.4).toFixed(1);
      const result = g.mark >= 5 ? '"Đã hoàn thành"' : '"Chưa đạt"';
      return [subjectName, subjectId, credits, type, mark10, mark4, result].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(',') + "\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BangDiem_${user.studentId || 'SV'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px' }}>🏆 Kết Quả Học Tập</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Bảng điểm chi tiết của sinh viên {user.fullName}</p>
        </div>
        <button onClick={handleDownloadExcel} className="btn-primary" style={{ padding: '12px 24px', borderRadius: '14px', background: '#059669', cursor: 'pointer' }}>
            <FileSpreadsheet size={20} /> Tải bảng điểm (Excel/CSV)
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px' }}>Đang tải dữ liệu điểm...</div>
      ) : (
        <>
          <div className="stats-grid" style={{ marginBottom: '40px' }}>
            <div className="stat-card" style={{ background: 'white', borderRadius: '24px', padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '16px', color: '#d97706' }}><Award size={24} /></div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', background: '#dcfce7', padding: '4px 12px', borderRadius: '100px' }}>Tích lũy</span>
                </div>
                <span className="stat-title" style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b' }}>Điểm TB (Hệ 10)</span>
                <span className="stat-value" style={{ fontSize: '2.5rem', marginTop: '8px' }}>{stats.avg10}</span>
            </div>
            
            <div className="stat-card" style={{ background: 'white', borderRadius: '24px', padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ background: '#e0e7ff', padding: '12px', borderRadius: '16px', color: '#4f46e5' }}><TrendingUp size={24} /></div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4f46e5', background: '#e0e7ff', padding: '4px 12px', borderRadius: '100px' }}>Xếp loại: Giỏi</span>
                </div>
                <span className="stat-title" style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b' }}>Điểm TB (Hệ 4)</span>
                <span className="stat-value" style={{ fontSize: '2.5rem', marginTop: '8px' }}>{stats.avg4}</span>
            </div>

            <div className="stat-card" style={{ background: 'white', borderRadius: '24px', padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ background: '#fdf2f2', padding: '12px', borderRadius: '16px', color: '#dc2626' }}><BookOpen size={24} /></div>
                </div>
                <span className="stat-title" style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b' }}>Tín chỉ đạt được</span>
                <span className="stat-value" style={{ fontSize: '2.5rem', marginTop: '8px' }}>{stats.credits}</span>
            </div>
          </div>

          <div className="table-container" style={{ background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Chi tiết học phần</h3>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Học kỳ 1 • 2023-2024</div>
            </div>
            <table style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr>
                  <th style={{ background: '#f8fafc', padding: '20px' }}>Môn học</th>
                  <th style={{ background: '#f8fafc' }}>Tín chỉ</th>
                  <th style={{ background: '#f8fafc' }}>Hình thức</th>
                  <th style={{ background: '#f8fafc' }}>Điểm số</th>
                  <th style={{ background: '#f8fafc' }}>Thang điểm 4</th>
                  <th style={{ background: '#f8fafc' }}>Kết quả</th>
                </tr>
              </thead>
              <tbody>
                {grades.length > 0 ? grades.map((g, idx) => (
                  <tr key={idx} style={{ transition: 'background 0.2s' }}>
                    <td style={{ padding: '20px' }}>
                        <div style={{ fontWeight: 700, color: '#1e293b' }}>{g.subject?.subjectName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Mã HP: {g.subjectId}</div>
                    </td>
                    <td>{g.subject?.credits}</td>
                    <td><span style={{ fontSize: '0.85rem', color: '#64748b' }}>{g.type}</span></td>
                    <td>
                        <div style={{ 
                            width: '45px', 
                            height: '45px', 
                            borderRadius: '12px', 
                            background: g.mark >= 5 ? '#f0fdf4' : '#fef2f2', 
                            color: g.mark >= 5 ? '#16a34a' : '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '1.1rem',
                            border: `1px solid ${g.mark >= 5 ? '#dcfce7' : '#fee2e2'}`
                        }}>
                            {g.mark}
                        </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{(g.mark * 0.4).toFixed(1)}</td>
                    <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: g.mark >= 5 ? '#059669' : '#dc2626', fontWeight: 600, fontSize: '0.9rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: g.mark >= 5 ? '#10b981' : '#ef4444' }}></div>
                            {g.mark >= 5 ? 'Đã hoàn thành' : 'Chưa đạt'}
                        </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Dữ liệu điểm số đang được cập nhật</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Layout>
  );
}
