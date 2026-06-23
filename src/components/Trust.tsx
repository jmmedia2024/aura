import { motion } from 'motion/react';
import { Search, Check, X, ShieldAlert } from 'lucide-react';

const exclusions = [
  { title: "크루즈 투어", desc: "주류 미포함", icon: "🚢" },
  { title: "웨이브파크 단독 콘서트", desc: "주류 및 추가음식 불포함", icon: "🎡" },
  { title: "팬미팅 디너쇼", desc: "판매상품, 음료, 주류, 조식 미포함", icon: "🥂" },
  { title: "공연티켓", desc: "멤버외 추가 인원 불포함", icon: "🎫" }
];

const inclusions = [
  { title: "크루즈 투어", desc: "공연, 식사, 음료 포함", icon: "🚢" },
  { title: "웨이브파크 단독 콘서트", desc: "BBQ, 풀 입장료 포함", icon: "🎡" },
  { title: "팬미팅 디너쇼", desc: "디너, 입장료, 숙박 2인 1실 제공 (단독 사용 시 5만원 추가)", icon: "🥂" },
  { title: "공연티켓", desc: "단독 공연 VIP석 제공", icon: "🎫" },
  { title: "팬 맞춤 서비스", desc: "선상 안내 방송, 전용 라운지 이용", icon: "✨" }
];

export default function Trust() {
  return (
    <section id="trust" className="py-24 px-5 md:px-12 bg-[#0047BB] text-white overflow-hidden relative">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <p className="text-white/70 font-bold uppercase tracking-widest text-sm">| 꼭! 확인하세요 |</p>
          <div className="flex items-center justify-center gap-3">
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter">팬덤 프리카드 발매 정보</h2>
            <Search className="w-8 h-8 md:w-12 md:h-12 text-white/50" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inclusion Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2rem] overflow-hidden shadow-2xl"
          >
            <div className="bg-[#E7F3FF] px-8 py-4 flex items-center gap-3 border-b border-blue-100">
               <div className="w-8 h-8 rounded-full border-4 border-[#22C55E] flex items-center justify-center font-black text-[#22C55E] text-xl">O</div>
               <span className="text-slate-900 font-black text-2xl">포함사항</span>
            </div>
            <div className="p-8 space-y-8">
               {inclusions.map((item, i) => (
                 <div key={i} className="flex gap-6 items-start">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">
                       {item.icon}
                    </div>
                    <div className="space-y-1">
                       <h4 className="font-black text-slate-900 text-lg">{item.title}</h4>
                       <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>

          {/* Exclusion Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2rem] overflow-hidden shadow-2xl"
          >
            <div className="bg-[#F8FAFC] px-8 py-4 flex items-center gap-3 border-b border-slate-100">
               <div className="w-8 h-8 rounded-full border-4 border-[#EF4444] flex items-center justify-center font-black text-[#EF4444] text-xl">X</div>
               <span className="text-slate-900 font-black text-2xl">불포함사항</span>
            </div>
            <div className="p-8 space-y-8">
               {exclusions.map((item, i) => (
                 <div key={i} className="flex gap-6 items-start opacity-70 grayscale-[0.5]">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">
                       {item.icon}
                    </div>
                    <div className="space-y-1">
                       <h4 className="font-black text-slate-900 text-lg">{item.title}</h4>
                       <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>
        </div>

        {/* Check Point Box */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-display font-black tracking-tight">예약 안내 및 취소 규정<br />(Check Point)</h3>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-medium text-white/80">
              <div className="space-y-1">
                <p className="text-white font-black">- 서비스 유효기간 : 1년</p>
                <p className="text-white font-black">- 예약금 : 예약 시 1인당 55만원 입금 시 확약</p>
              </div>
              <div className="space-y-1">
                <p className="text-white font-black">- 취소 규정 : 서비스 만료 시 취소 불가능</p>
                <p className="text-cyan-300 font-black">- 혜택 미수령자 대상 : 회당 10만원 리턴 보상</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating Recall Indicator */}
        <div className="flex justify-center pt-8">
           <div className="flex items-center gap-3 px-6 py-3 bg-white text-blue-600 rounded-full font-black text-sm shadow-xl animate-bounce">
              <ShieldAlert className="w-5 h-5" />
              대한민국 최초 팬덤 특권 이행 리콜 보장제 실시
           </div>
        </div>
      </div>
    </section>
  );
}
