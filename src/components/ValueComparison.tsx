import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export default function ValueComparison() {
  const items = [
    { name: "속초 디너 팬미팅 프리패스", emoji: "🍽️", market: "8만원", member: "포함" },
    { name: "코요태 썸머 콘서트 프리패스", emoji: "🎤", market: "15만원", member: "포함" },
    { name: "All-inclusive 팬크루즈 투어", emoji: "🚢", market: "44만원", member: "포함" },
    { name: "코요태 단독 공연 VIP 관람", emoji: "🎫", market: "20만원 상당", member: "포함" },
    { name: "신지 한정판 기념 주화", emoji: "🪙", market: "15만원 상당", member: "포함" },
    { name: "기념 굿즈 카드 및 달력 패키지", emoji: "📅", market: "10만원 상당", member: "포함" },
  ];

  const totalMarketValue = "112만원+";
  const membershipFee = "55만원";

  return (
    <section id="value" className="py-16 md:py-24 px-4 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 md:mb-16 space-y-4">
          <p className="text-blue-600 font-bold uppercase tracking-widest text-xs">Cost Performance</p>
          <h2 className="text-3xl md:text-6xl font-display font-black tracking-tighter">
             일반 이용 대비 <span className="text-blue-600 italic">압도적인 경제 가치</span>
          </h2>
          <p className="text-slate-500 text-xs md:text-sm">회원 가입비의 2배가 넘는 실질적인 혜택을 수치로 확인해 보세요.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
          {/* Table Container */}
          <div className="lg:col-span-7 bg-slate-50 rounded-2xl md:rounded-3xl overflow-hidden border border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[320px]">
                 <thead>
                   <tr className="border-b border-slate-200 bg-slate-100">
                     <th className="px-4 md:px-8 py-4 md:py-6 text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">혜택 항목</th>
                     <th className="px-4 md:px-8 py-4 md:py-6 text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest text-right">일반</th>
                     <th className="px-4 md:px-8 py-4 md:py-6 text-xs md:text-sm font-bold text-blue-650 uppercase tracking-widest text-right">회원 혜택</th>
                   </tr>
                 </thead>
                 <tbody>
                   {items.map((item, i) => (
                     <tr key={i} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors text-xs md:text-sm">
                        <td className="px-4 md:px-8 py-3.5 md:py-5 font-bold text-slate-700">
                          <span className="flex items-center gap-1.5">
                            <span className="text-base">{item.emoji}</span>
                            <span className="hidden sm:inline">{item.name}</span>
                            <span className="sm:hidden">{item.name.replace(' 프리패스', '').replace(' 에디션', '').replace(' 패키지', '')}</span>
                          </span>
                        </td>
                        <td className="px-4 md:px-8 py-3.5 md:py-5 text-slate-400 text-right font-semibold text-[11px] md:text-xs whitespace-nowrap">{item.market}</td>
                        <td className="px-4 md:px-8 py-3.5 md:py-5 font-black text-blue-605 text-right whitespace-nowrap">
                           <span className="inline-flex items-center gap-1 justify-end">
                             <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                             <span>{item.member}</span>
                           </span>
                        </td>
                     </tr>
                   ))}
                 </tbody>
              </table>
            </div>
          </div>

          {/* Summary Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-blue-600 p-8 md:p-10 rounded-3xl flex flex-col justify-between shadow-2xl relative overflow-hidden text-white"
          >
             <div className="space-y-8 relative z-10">
                <div className="flex justify-between items-center border-b border-white/20 pb-4">
                  <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Price Summary</span>
                  <span className="text-[10px] text-white/50 uppercase">Benefits Total: ₩1,120,000+</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">일반 총 이용 가치</span>
                    <span className="text-xl font-display font-medium text-white/40 line-through decoration-white/40">{totalMarketValue}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="text-white font-bold text-lg">오로라 가입 혜택가</span>
                    <span className="text-4xl md:text-5xl font-display font-black text-white tracking-tighter">{membershipFee}</span>
                  </div>
                </div>

                <div className="p-4 bg-white/10 border border-white/20 rounded-2xl">
                  <p className="text-[10px] text-cyan-200 leading-relaxed uppercase font-black mb-1">Benefit Points</p>
                  <p className="text-xs text-white/70 leading-relaxed">회원 발급 즉시 현금 환산 가치 약 57만원의 이득을 얻으며 시작하실 수 있습니다.</p>
                </div>
             </div>

             <div className="mt-12">
               <button className="w-full py-4 bg-white text-blue-600 font-black text-sm uppercase tracking-widest rounded-xl hover:bg-blue-50 transition-all shadow-xl">
                 지금 가입하고 혜택 받기
               </button>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
