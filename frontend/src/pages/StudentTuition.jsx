import { useState, useEffect } from 'react';
import Layout from './Layout';
import api from '../api';
import { CreditCard, CheckCircle, AlertCircle, Wallet, ReceiptText, ArrowRight } from 'lucide-react';

export default function StudentTuition() {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showQRModal, setShowQRModal] = useState(false);
    const [selectedFeeId, setSelectedFeeId] = useState(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchTuitionFees();
    }, [user.studentId]);

    const fetchTuitionFees = async () => {
        try {
            if (user.studentId) {
                const response = await api.get(`/TuitionFees/student/${user.studentId}`);
                setFees(response.data);
            }
        } catch (error) {
            console.error('Error fetching tuition fees:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async (id) => {
        try {
            await api.put(`/TuitionFees/${id}/pay`);
            alert('Thanh toán thành công!');
            fetchTuitionFees();
        } catch (error) {
            console.error('Error paying fee:', error);
            alert('Có lỗi xảy ra khi thanh toán.');
        }
    };

    const totalUnpaid = fees.filter(f => !f.isPaid).reduce((sum, f) => sum + f.totalAmount, 0);

    return (
        <Layout>
            <div className="page-header">
                <div>
                    <h1 className="page-title">💳 Học Phí & Hóa Đơn</h1>
                    <p className="page-subtitle">Theo dõi và thanh toán học phí trực tuyến (450,000 VNĐ / 1 tín chỉ)</p>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    <div style={{ animation: 'spin 1s linear infinite', display: 'inline-block', marginBottom: '10px' }}>
                        <AlertCircle size={32} color="var(--primary)" />
                    </div>
                    <div>Đang tải dữ liệu học phí...</div>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '32px' }}>
                    {/* Summary Cards */}
                    <div className="stats-grid" style={{ marginBottom: '0' }}>
                        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', color: 'white', border: 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontSize: '1rem', fontWeight: 600, opacity: 0.9, display: 'block', marginBottom: '8px' }}>Cần thanh toán</span>
                                    <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalUnpaid)}
                                    </span>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '20px' }}>
                                    <Wallet size={36} color="white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="table-container">
                        <div className="table-header-tools">
                            <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
                                <ReceiptText size={22} color="var(--primary)" /> Lịch sử hóa đơn học phí
                            </h3>
                        </div>
                        <div style={{ padding: '0' }}>
                            {fees.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                                    <ReceiptText size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
                                    <p>Chưa có hóa đơn học phí nào được ghi nhận cho học kỳ này.</p>
                                </div>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Học kỳ</th>
                                            <th>Khối lượng</th>
                                            <th>Tổng thành tiền</th>
                                            <th>Trạng thái</th>
                                            <th style={{ textAlign: 'right' }}>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fees.map((fee) => (
                                            <tr key={fee.id}>
                                                <td>
                                                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{fee.semester}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Mã HĐ: INV-{fee.id.toString().padStart(5, '0')}</div>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontWeight: 600 }}>{fee.totalCredits}</span>
                                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>tín chỉ</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(fee.totalAmount)}
                                                    </span>
                                                </td>
                                                <td>
                                                    {fee.isPaid ? (
                                                        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
                                                            <CheckCircle size={14} /> Đã thanh toán
                                                        </span>
                                                    ) : (
                                                        <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' }}>
                                                            <AlertCircle size={14} /> Chờ thanh toán
                                                        </span>
                                                    )}
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    {!fee.isPaid ? (
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedFeeId(fee.id);
                                                                setShowQRModal(true);
                                                            }} 
                                                            className="btn-primary" 
                                                            style={{ padding: '10px 20px', borderRadius: '12px' }}
                                                        >
                                                            Thanh toán <ArrowRight size={16} />
                                                        </button>
                                                    ) : (
                                                        <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', fontWeight: 600, padding: '10px' }}>
                                                            <CheckCircle size={18} /> Hoàn tất
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
                </div>
            )}

            {/* QR Payment Modal */}
            {showQRModal && (
                <div className="modal-overlay" onClick={() => setShowQRModal(false)}>
                    <div className="modal-content" style={{ textAlign: 'center', maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header" style={{ justifyContent: 'center', marginBottom: '16px' }}>
                            <h3 className="modal-title" style={{ fontSize: '1.4rem' }}>Thanh toán học phí</h3>
                        </div>
                        
                        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>
                            Vui lòng quét mã QR dưới đây qua ứng dụng ngân hàng hoặc MoMo.
                        </p>

                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '20px', display: 'inline-block', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
                            <img src="/qr-payment.jpg" alt="QR Thanh toán" style={{ width: '220px', height: 'auto', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                        </div>

                        <div style={{ background: '#fffbeb', color: '#d97706', padding: '16px', borderRadius: '12px', marginBottom: '32px', border: '1px dashed #fcd34d' }}>
                            <div style={{ fontSize: '0.85rem', marginBottom: '8px', fontWeight: 600 }}>NỘI DUNG CHUYỂN KHOẢN (BẮT BUỘC):</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '1px', userSelect: 'all', cursor: 'pointer' }} title="Click để copy">
                                {user.fullName ? user.fullName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toUpperCase().replace(/\s/g, '') : 'SV'} {user.username ? user.username.toUpperCase() : ''}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button 
                                onClick={() => setShowQRModal(false)} 
                                className="btn-secondary" 
                                style={{ flex: 1, padding: '14px', justifyContent: 'center' }}
                            >
                                Hủy bỏ
                            </button>
                            <button 
                                onClick={() => {
                                    handlePay(selectedFeeId);
                                    setShowQRModal(false);
                                }} 
                                className="btn-primary" 
                                style={{ flex: 1, padding: '14px', justifyContent: 'center' }}
                            >
                                Đã chuyển khoản
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
