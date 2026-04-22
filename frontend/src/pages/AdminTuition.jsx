import { useState, useEffect } from 'react';
import Layout from './Layout';
import api from '../api';
import { CreditCard, Search, FileText, CheckCircle, Clock, BarChart3, TrendingUp } from 'lucide-react';

export default function AdminTuition() {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        try {
            const response = await api.get('/TuitionFees');
            setFees(response.data);
        } catch (error) {
            console.error('Error fetching tuition fees:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async (id) => {
        try {
            await api.put(`/TuitionFees/${id}/pay`);
            fetchFees();
        } catch (error) {
            console.error('Error paying fee:', error);
            alert('Có lỗi xảy ra khi xác nhận thanh toán.');
        }
    };

    const filteredFees = fees.filter(fee => 
        fee.student?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fee.student?.studentCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fee.semester?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalExpected = fees.reduce((sum, f) => sum + f.totalAmount, 0);
    const totalCollected = fees.filter(f => f.isPaid).reduce((sum, f) => sum + f.totalAmount, 0);
    const collectionRate = totalExpected === 0 ? 0 : Math.round((totalCollected / totalExpected) * 100);

    return (
        <Layout>
            <div className="page-header">
                <div>
                    <h1 className="page-title">💳 Quản Lý Thu Học Phí</h1>
                    <p className="page-subtitle">Theo dõi tiến độ thu học phí và xác nhận thanh toán cho sinh viên</p>
                </div>
            </div>

            {/* Dashboards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-title">Tổng thu dự kiến</span>
                    <span className="stat-value" style={{ fontSize: '2rem' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalExpected)}
                    </span>
                    <div style={{ position: 'absolute', top: '24px', right: '24px', opacity: 0.1 }}>
                        <BarChart3 size={64} />
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-title">Thực tế đã thu</span>
                    <span className="stat-value" style={{ fontSize: '2rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', WebkitBackgroundClip: 'text' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalCollected)}
                    </span>
                    <div style={{ position: 'absolute', top: '24px', right: '24px', opacity: 0.1, color: '#10b981' }}>
                        <TrendingUp size={64} />
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-title">Tỷ lệ hoàn thành</span>
                    <span className="stat-value" style={{ fontSize: '2.5rem' }}>
                        {collectionRate}%
                    </span>
                    <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${collectionRate}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px' }}></div>
                    </div>
                </div>
            </div>

            <div className="table-container">
                <div className="table-header-tools">
                    <div className="search-bar">
                        <Search className="search-icon" size={18} />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm SV, Mã SV, Học kỳ..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                
                <div style={{ padding: '0' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                            Đang tải danh sách học phí...
                        </div>
                    ) : filteredFees.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                            <FileText size={64} style={{ opacity: 0.2 }} />
                            <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>Chưa có dữ liệu học phí phù hợp</div>
                            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Hệ thống sẽ tự động ghi nhận khi sinh viên truy cập chức năng Học phí.</p>
                        </div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Thông tin Sinh Viên</th>
                                    <th>Học kỳ / Hóa đơn</th>
                                    <th>Chi tiết</th>
                                    <th>Trạng thái</th>
                                    <th style={{ textAlign: 'right' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFees.map((fee) => (
                                    <tr key={fee.id}>
                                        <td>
                                            <div className="student-col">
                                                <div className="student-avatar" style={{ background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 700 }}>
                                                    {fee.student?.fullName?.charAt(0) || '?'}
                                                </div>
                                                <div className="student-info">
                                                    <span className="student-name">{fee.student?.fullName || 'Không xác định'}</span>
                                                    <span className="student-id">{fee.student?.studentCode}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{fee.semester}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Mã HĐ: INV-{fee.id.toString().padStart(5, '0')}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.05rem' }}>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(fee.totalAmount)}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>{fee.totalCredits} tín chỉ</div>
                                        </td>
                                        <td>
                                            {fee.isPaid ? (
                                                <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
                                                    <CheckCircle size={14} /> Đã thu
                                                </span>
                                            ) : (
                                                <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' }}>
                                                    <Clock size={14} /> Chờ nộp
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            {!fee.isPaid ? (
                                                <button onClick={() => handlePay(fee.id)} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '10px' }}>
                                                    <CheckCircle size={16} /> Xác nhận thu
                                                </button>
                                            ) : (
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', paddingRight: '12px' }}>
                                                    Đã hoàn tất
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </Layout>
    );
}
