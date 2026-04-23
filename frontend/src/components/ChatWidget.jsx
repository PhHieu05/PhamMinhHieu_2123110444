import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, ChevronDown, Bell } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'Admin';
  const username = user.username || (role === 'Admin' ? 'admin' : 'student');
  
  // For Admin: manage multiple conversations
  // For simplicity in this demo, Admin sees all messages, but we can group them by student
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Load messages from localStorage
    const loadMessages = () => {
      const stored = JSON.parse(localStorage.getItem('app_chats') || '[]');
      setMessages(stored);
      
      if (role === 'Admin') {
        // Extract unique student usernames who have sent messages
        const studentUsernames = [...new Set(stored.filter(m => m.senderRole === 'Student').map(m => m.senderUsername))];
        setStudents(studentUsernames);
        if (!selectedStudent && studentUsernames.length > 0) {
          setSelectedStudent(studentUsernames[0]);
        }
      }
    };
    
    loadMessages();
    
    // Listen for storage changes to update chat across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'app_chats') {
        loadMessages();
      }
    };
    
    const handleOpenChat = () => setIsOpen(true);

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('open-chat', handleOpenChat);
    // Also poll every 2s for updates just in case
    const interval = setInterval(loadMessages, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('open-chat', handleOpenChat);
      clearInterval(interval);
    };
  }, [role, selectedStudent]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, selectedStudent]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsgObj = {
      id: Date.now(),
      senderUsername: username,
      senderRole: role,
      senderName: user.fullName || username,
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
      receiverUsername: role === 'Admin' ? selectedStudent : 'admin'
    };

    const updatedMessages = [...messages, newMsgObj];
    setMessages(updatedMessages);
    localStorage.setItem('app_chats', JSON.stringify(updatedMessages));
    setNewMessage('');
    
    if (role === 'Student') {
      // Small visual feedback
      setTimeout(() => {
        const stored = JSON.parse(localStorage.getItem('app_chats') || '[]');
        if (stored.length === updatedMessages.length) {
            // Only add auto-reply if no one replied yet (for demo)
            // Skip for this simple mock
        }
      }, 1000);
    }
  };

  const getVisibleMessages = () => {
    if (role === 'Student') {
      return messages.filter(m => m.senderUsername === username || m.receiverUsername === username);
    } else {
      return messages.filter(m => 
        (m.senderUsername === selectedStudent && m.receiverUsername === username) || 
        (m.senderUsername === username && m.receiverUsername === selectedStudent)
      );
    }
  };

  const unreadCount = messages.filter(m => 
    m.receiverUsername === username && 
    new Date(m.timestamp) > new Date(Date.now() - 5000) // fake unread within 5s
  ).length;

  if (!isOpen) {
    return (
      <>
        <style>
          {`
            @keyframes pulseShadow {
              0% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7); }
              70% { box-shadow: 0 0 0 15px rgba(79, 70, 229, 0); }
              100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
            }
            .chat-btn-pulse {
              animation: pulseShadow 2s infinite;
            }
          `}
        </style>
        <button 
          onClick={() => setIsOpen(true)}
          className={unreadCount > 0 ? "chat-btn-pulse" : ""}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '64px',
            height: '64px',
            borderRadius: '32px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
            color: 'white',
            border: 'none',
            boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <MessageSquare size={30} />
          {unreadCount > 0 && (
            <div style={{
              position: 'absolute', top: '-2px', right: '-2px', background: '#ef4444', color: 'white',
              width: '24px', height: '24px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white',
              boxShadow: '0 4px 8px rgba(239, 68, 68, 0.4)'
            }}>
              {unreadCount}
            </div>
          )}
        </button>
      </>
    );
  }

  const visibleMessages = getVisibleMessages();

  return (
    <>
      <style>
        {`
          .chat-scroll-container::-webkit-scrollbar {
            width: 6px;
          }
          .chat-scroll-container::-webkit-scrollbar-track {
            background: transparent;
          }
          .chat-scroll-container::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 10px;
          }
          .chat-message-enter {
            animation: chatSlideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }
          @keyframes chatSlideIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <div style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '380px',
        height: '600px',
        maxHeight: '85vh',
        background: '#f8fafc',
        borderRadius: '28px',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 9999,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.8)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          padding: '24px 20px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative background circle */}
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(79,70,229,0.4) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }}></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 1 }}>
            <div style={{ 
              width: '46px', height: '46px', borderRadius: '16px', background: 'rgba(255,255,255,0.1)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {role === 'Student' ? <Bell size={22} color="#e0e7ff" /> : <User size={22} color="#e0e7ff" />}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.2px' }}>
                {role === 'Student' ? 'Phòng Đào Tạo' : 'Hỗ trợ sinh viên'}
              </h3>
              <div style={{ fontSize: '0.85rem', opacity: 0.85, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontWeight: 500 }}>
                <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 8px #22c55e' }}></div>
                Trực tuyến
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', zIndex: 1 }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Admin Student Selector */}
        {role === 'Admin' && students.length > 0 && (
          <div className="chat-scroll-container" style={{ padding: '12px 16px', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '10px', overflowX: 'auto', boxShadow: '0 4px 6px -4px rgba(0,0,0,0.05)', zIndex: 2 }}>
            {students.map(s => (
              <button 
                key={s}
                onClick={() => setSelectedStudent(s)}
                style={{
                  padding: '8px 16px', borderRadius: '100px', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap',
                  background: selectedStudent === s ? 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)' : '#f1f5f9',
                  color: selectedStudent === s ? 'white' : '#64748b',
                  boxShadow: selectedStudent === s ? '0 4px 10px rgba(79,70,229,0.3)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                @{s}
              </button>
            ))}
          </div>
        )}

        {/* Message List */}
        <div className="chat-scroll-container" style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {(role === 'Admin' && !selectedStudent) ? (
              <div style={{ margin: 'auto', textAlign: 'center', color: '#94a3b8' }}>
                  Chưa có cuộc hội thoại nào được chọn.
              </div>
          ) : visibleMessages.length === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <MessageSquare size={40} color="#4f46e5" style={{ opacity: 0.6 }} />
              </div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#475569' }}>Bắt đầu trò chuyện</div>
              {role === 'Student' && <div style={{ fontSize: '0.9rem', marginTop: '8px', maxWidth: '80%', lineHeight: '1.5' }}>Phòng Đào Tạo luôn sẵn sàng hỗ trợ các vấn đề học vụ của bạn.</div>}
            </div>
          ) : (
            visibleMessages.map((msg, idx) => {
              const isMe = msg.senderUsername === username;
              return (
                <div key={msg.id} className="chat-message-enter" style={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start'
                }}>
                  {!isMe && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', marginLeft: '12px' }}>
                      {msg.senderName}
                    </span>
                  )}
                  <div style={{
                    padding: '14px 18px',
                    borderRadius: isMe ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                    background: isMe ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'white',
                    color: isMe ? 'white' : '#334155',
                    boxShadow: isMe ? '0 8px 16px rgba(79,70,229,0.25)' : '0 4px 15px rgba(0,0,0,0.04)',
                    border: isMe ? 'none' : '1px solid #e2e8f0',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    fontWeight: 500
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#cbd5e1', marginTop: '6px', padding: isMe ? '0 12px 0 0' : '0 0 0 12px' }}>
                    {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} style={{ padding: '20px', background: 'white', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '12px', alignItems: 'center', zIndex: 2, boxShadow: '0 -4px 10px rgba(0,0,0,0.02)' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={role === 'Admin' && !selectedStudent ? 'Chưa chọn sinh viên...' : 'Nhập tin nhắn...'}
            disabled={role === 'Admin' && !selectedStudent}
            style={{
              flex: 1,
              padding: '14px 20px',
              borderRadius: '100px',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              outline: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
              color: '#334155',
              transition: 'all 0.2s',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
            }}
            onFocus={e => { e.target.style.borderColor = '#818cf8'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
            onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)'; }}
          />
          <button 
            type="submit"
            disabled={!newMessage.trim() || (role === 'Admin' && !selectedStudent)}
            style={{
              width: '48px', height: '48px',
              borderRadius: '24px',
              background: newMessage.trim() && (role !== 'Admin' || selectedStudent) ? 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)' : '#e2e8f0',
              color: 'white',
              border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: newMessage.trim() && (role !== 'Admin' || selectedStudent) ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              boxShadow: newMessage.trim() && (role !== 'Admin' || selectedStudent) ? '0 4px 12px rgba(79,70,229,0.3)' : 'none',
              transform: newMessage.trim() && (role !== 'Admin' || selectedStudent) ? 'scale(1)' : 'scale(0.95)'
            }}
            onMouseEnter={e => { if (newMessage.trim() && (role !== 'Admin' || selectedStudent)) e.currentTarget.style.transform = 'scale(1.05)' }}
            onMouseLeave={e => { if (newMessage.trim() && (role !== 'Admin' || selectedStudent)) e.currentTarget.style.transform = 'scale(1)' }}
          >
            <Send size={20} style={{ marginLeft: '2px', opacity: newMessage.trim() ? 1 : 0.5 }} />
          </button>
        </form>
      </div>
    </>
  );
}
