import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, User } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'support', text: '안녕하세요! 팬덤 오로라 전담 서포트팀입니다. R.ef 팬카드 혜택에 대해 궁금하신 점이 있으신가요?' }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    const newHistory = [...chatHistory, { role: 'user', text: message }];
    setChatHistory(newHistory);
    setMessage('');

    // Mock response
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        role: 'support', 
        text: '문의 감사합니다. 현재 상담원이 확인 중입니다. 잠시만 기다려 주시거나, 1:1 온라인 가입 상담을 통해 더 빠른 도움을 받으실 수 있습니다.' 
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[80] pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[calc(100vw-48px)] sm:w-[380px] h-[500px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden pointer-events-auto"
          >
            {/* Header */}
            <div className="bg-blue-600 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">오로라 전담 서포트</h4>
                  <p className="text-[10px] text-white/70 font-medium">현재 온라인 | 실시간 응답 가능</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
              {chatHistory.map((chat, i) => (
                <div 
                  key={i} 
                  className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                    chat.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-md' 
                      : 'bg-white text-slate-700 rounded-tl-none shadow-sm'
                  }`}>
                    {chat.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex gap-2 p-2 bg-slate-100 rounded-xl">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 bg-transparent px-3 py-1.5 text-sm focus:outline-none"
                />
                <button 
                  onClick={handleSend}
                  className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 active:scale-95 transition-transform"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-600/30 hover:scale-110 active:scale-95 transition-transform group relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ opacity: 0, rotate: -45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 45 }}>
              <X className="w-8 h-8" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ opacity: 0, rotate: 45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -45 }}>
              <MessageCircle className="w-8 h-8" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Notification Dot */}
        {!isOpen && (
          <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 border-4 border-white rounded-full animate-bounce" />
        )}
      </button>
    </div>
  );
}
