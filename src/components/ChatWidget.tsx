import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, User, Sparkles } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'support', text: '안녕하세요! R.ef 30주년 전담 서포트팀입니다. 한정판 멤버십 카드와 특별 혜택에 대해 궁금하신 점이 있으신가요?' }
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
        text: '소중한 문의 감사드립니다. 현재 R.ef 30주년 전담 서포트 매니저가 메시지를 확인하고 있습니다. 대기 중이시라면 잠시만 기다려 주시거나, 상단의 VIP 가입 신청을 통해 정보를 남겨주시면 보다 완벽한 안내를 직접 받아보실 수 있습니다. ✨' 
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
            className="absolute bottom-20 right-0 w-[calc(100vw-48px)] sm:w-[380px] h-[550px] bg-[#0c1428]/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/10 flex flex-col overflow-hidden pointer-events-auto"
          >
            {/* Header with premium glass effect */}
            <div className="bg-white/5 backdrop-blur-xl p-5 border-b border-white/10 text-white flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/15 flex items-center justify-center border border-amber-500/30 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                  <User className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-black text-xs md:text-sm text-white flex items-center gap-1.5">
                    R.ef VIP 컨시어지
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  </h4>
                  <p className="text-[9px] text-emerald-400 font-bold tracking-widest uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    실시간 전문 상담원 연결 중
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white transition-all active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-transparent custom-scrollbar">
              {chatHistory.map((chat, i) => (
                <div 
                  key={i} 
                  className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] px-5 py-3.5 rounded-[1.5rem] text-xs md:text-sm leading-relaxed shadow-lg ${
                    chat.role === 'user' 
                      ? 'bg-gradient-to-br from-amber-500 to-yellow-600 text-black font-semibold rounded-tr-none border border-white/20' 
                      : 'bg-white/10 text-slate-100 rounded-tl-none border border-white/10 backdrop-blur-md'
                  }`}>
                    {chat.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <div className="p-5 bg-black/40 backdrop-blur-xl border-t border-white/10">
              <div className="flex gap-2 p-2 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="VIP 전담 매니저에게 문의하기..."
                  className="flex-1 bg-transparent px-3 py-2 text-xs md:text-sm focus:outline-none text-slate-100 placeholder-slate-500"
                />
                <button 
                  onClick={handleSend}
                  className="w-11 h-11 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 flex items-center justify-center text-black shadow-[0_8px_20px_rgba(212,175,55,0.3)] active:scale-95 transition-all shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Sparkle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto w-14 h-14 rounded-full bg-gradient-to-r from-black via-[#0c1428] to-[#1a2b4d] flex items-center justify-center text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-110 active:scale-95 transition-transform group relative border border-[#D4AF37]/30"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ opacity: 0, rotate: -45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 45 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ opacity: 0, rotate: 45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -45 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Notification Dot with golden pulse ring */}
        {!isOpen && (
          <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 border-2 border-slate-950 rounded-full animate-bounce flex items-center justify-center text-[8px] font-black">
            1
          </div>
        )}
      </button>
    </div>
  );
}
