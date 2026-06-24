import { motion } from 'motion/react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: "카드 발급까지 얼마나 걸리나요?",
    answer: "온라인 가입 완료 후, R.ef의 30주년 한정판 디자인이 각인된 VIP 골드 카드가 수작업으로 제작됩니다. 실물 카드는 가입 후 약 14일 이내에 등기 우편으로 발송됩니다."
  },
  {
    question: "리콜 리워드(10만원 리턴)은 언제 지급되나요?",
    answer: "해당 차수의 이벤트가 모두 종료된 시점에 미참석 이력이 확인되면, 등록하신 계좌로 영업일 5일 이내에 환급됩니다."
  },
  {
    question: "R.ef 30주년 콘서트 일정은 언제인가요?",
    answer: "30주년 기념 메인 공연은 가을 시즌 잠실에서 개최될 예정입니다. 정확한 일시는 가입 시 안내드리는 회원 전용 핫라인 또는 문자를 통해 최소 1개월 전 공지해 드립니다."
  },
  {
    question: "기념 주화와 굿즈 상품은 어떤 것들인가요?",
    answer: "R.ef 30주년을 기념하여 제작된 한정판 24K 순금 카드와 더불어, 멤버들의 친필 사인이 담긴 30주년 화보집, 미공개 레전드 포토북 등 소장 가치가 높은 굿즈들이 VIP 패키지로 제공됩니다."
  },
  {
    question: "동반 1인 혜택이 포함되나요?",
    answer: "팬 크루즈와 프리미엄 디너쇼의 경우 기본 2인 기준으로 혜택이 설계되어 동반 1인이 가능합니다. 기타 공연 혜택은 회원 본인 기준이며, 동반 인원은 우선 예약권을 통해 별도 구매가 가능합니다."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-28 px-5 md:px-12 bg-transparent border-t border-slate-900/60 relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <p className="text-[#D4AF37] font-black uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-1">
            <HelpCircle className="w-4 h-4 text-amber-400 animate-pulse" />
            Support Center
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-black tracking-tighter text-white">
            자주 묻는 질문
          </h2>
          <div className="neon-line-gold max-w-[150px] mx-auto opacity-50" />
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            
            // Neon accent border based on state
            const borderClass = isOpen 
              ? 'border-amber-500/40 shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] bg-white/10 backdrop-blur-xl -translate-y-1' 
              : 'border-slate-800/60 bg-white/5 backdrop-blur-sm hover:border-slate-700 hover:bg-white/10 hover:shadow-lg';

            return (
              <div 
                key={i} 
                className={`border rounded-2xl overflow-hidden active:scale-[0.99] transition-all duration-300 ${borderClass}`}
              >
                <button 
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full px-4 md:px-8 py-4 md:py-5 flex items-center justify-between text-left transition-colors"
                >
                  <span className={`font-black text-sm md:text-base leading-snug pr-4 transition-colors ${isOpen ? 'text-amber-200' : 'text-slate-200 hover:text-white'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shrink-0 transition-all duration-300 ${isOpen ? 'border-amber-400/40 text-amber-300 rotate-180 bg-slate-950' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                
                <motion.div 
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6 text-slate-400 text-xs md:text-sm leading-relaxed border-t border-slate-900 pt-4.5 bg-slate-950/40">
                    {faq.answer}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
