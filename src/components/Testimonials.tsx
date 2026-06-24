import { motion } from 'motion/react';
import { Quote, Star, Sparkles } from 'lucide-react';

const testimonials = [
  {
    name: "김민수",
    role: "VIP 회원 / R.ef 30년차 팬 🌟",
    quote: "잠실 콘서트에서 히트곡 메들리를 들으며 눈물을 흘렸습니다. 30년의 세월을 뛰어넘어 다시 완전체 무대를 볼 수 있게 해준 이 멤버십은 단순한 카드가 아니라 감동 그 자체입니다.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    name: "이지혜",
    role: "Premium 회원 / 레전드 서포터 🔥",
    quote: "크루즈 투어에서 멤버들과 노을을 보며 나눈 대화는 평생 잊지 못할 거예요. VIP 전담 비서 서비스 덕분에 공연 예약도 가장 앞자리로 편하게 마쳤습니다. 대우받는 기분이 확실히 들어요.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    name: "박성준",
    role: "Gold 회원 / 30주년 오너 💎",
    quote: "갑작스러운 일정 변경으로 디너쇼에 참석하지 못했는데, 리콜 제도를 통해 포인트로 즉시 환급받았습니다. 팬들의 사정을 배려하는 세심한 시스템에 다시 한번 R.ef의 팬임이 자랑스러워졌습니다.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 md:px-12 bg-transparent relative overflow-hidden">
      {/* Decorative Gold Glow Blur */}
      <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-amber-500/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <p className="text-[#D4AF37] font-black uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            REAL REVIEWS
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight text-white leading-tight">
            이미 많은 팬들이 <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-[#D4AF37] italic drop-shadow-[0_0_12px_rgba(212,175,55,0.3)]">
              R.ef와 함께하고 있습니다
            </span>
          </h2>
          <p className="text-slate-400 text-xs md:text-sm">프리미엄 혜택을 직접 경험한 회원님들의 진솔한 이야기</p>
          <div className="neon-line-gold max-w-xs mx-auto opacity-40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => {
            // Neon accent border classes - all gold for consistent brand feel
            const cardNeonClass = 'neon-card-gold';

            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${cardNeonClass} p-8 flex flex-col h-full relative group transform hover:-translate-y-2 hover:scale-[1.01] duration-300`}
              >
                <Quote className="absolute top-6 right-8 w-10 h-10 text-amber-500/10 group-hover:text-amber-500/20 transition-colors pointer-events-none" />
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <img 
                      src={t.image} 
                      alt={t.name} 
                      className="w-14 h-14 rounded-full object-cover border-2 border-slate-800 group-hover:border-amber-500/40 transition-colors"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-900 border border-slate-850 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-black text-white text-base">{t.name}</h4>
                    <p className="text-[10px] text-amber-400 font-bold tracking-widest uppercase mt-0.5">{t.role}</p>
                  </div>
                </div>

                <p className="hidden md:block text-slate-300 text-xs md:text-sm leading-relaxed italic relative z-10 flex-1 min-h-[72px]">
                  "{t.quote}"
                </p>
                
                {/* 5-Star Rating Line */}
                <div className="mt-6 pt-5 border-t border-slate-900 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
