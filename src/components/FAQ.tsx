import { motion } from 'motion/react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: "카드 발급까지 얼마나 걸리나요?",
    answer: "온라인 가입 완료 후, 코요태 신지의 고유 이미지가 각인된 한정판 카드가 수작업으로 제작됩니다. 실물 카드는 가입 후 약 14일 이내에 등기 우편으로 발송됩니다."
  },
  {
    question: "리콜 리워드(10만원 리턴)은 언제 지급되나요?",
    answer: "해당 차수의 이벤트가 모두 종료된 시점에 미참석 이력이 확인되면, 등록하신 계좌로 영업일 5일 이내에 환급됩니다."
  },
  {
    question: "코요태 신지 단독 공연 일정은 언제인가요?",
    answer: "매년 상하반기 각 1회씩 정기 공연이 개최됩니다. 정확한 일시는 가입 시 안내드리는 회원 전용 앱 또는 문자를 통해 최소 1개월 전 공지해 드립니다."
  },
  {
    question: "기념 주화와 굿즈 상품은 어떤 것들인가요?",
    answer: "2026년 한정판으로 제작된 코요태 신지 기념 금주화와 더불어, 신지님의 친필 사인이 담긴 에코백, 포토북, 기념 달력 등 소장 가치가 높은 굿즈들이 패키지로 제공됩니다."
  },
  {
    question: "추가 인원 동반이 가능한가요?",
    answer: "속초 디너 팬미팅은 기본 2인 1조 숙박권이 제공되어 동반 1인이 가능합니다. 기타 공연 혜택은 회원 본인 기준이며, 동반 인원은 유료로 추가 구매가 가능하도록 지원합니다."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-24 px-5 md:px-12 bg-white border-t border-slate-100">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <p className="text-blue-600 font-bold uppercase tracking-widest text-[10px] md:text-xs">Support Center</p>
          <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight">자주 묻는 질문</h2>
        </div>

        <div className="space-y-3 md:space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className="bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl overflow-hidden active:scale-[0.99] transition-transform"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-5 md:px-8 py-5 md:py-6 flex items-center justify-between text-left hover:bg-slate-100 transition-colors"
              >
                <span className="font-bold text-slate-800 text-sm md:text-base leading-snug pr-4">{faq.question}</span>
                <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 text-blue-600 shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <motion.div 
                initial={false}
                animate={{ height: openIndex === i ? 'auto' : 0 }}
                className="overflow-hidden"
              >
                <div className="px-8 pb-6 text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">
                  {faq.answer}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
