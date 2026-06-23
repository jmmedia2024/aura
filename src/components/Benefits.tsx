import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import BenefitModal from './BenefitModal';
import { useSettings } from '../lib/useSettings';
import { ICON_MAP } from '../lib/settings';

export default function Benefits() {
  const { settings, loading } = useSettings();
  const [selectedBenefit, setSelectedBenefit] = useState<any | null>(null);

  if (loading) return null;

  return (
    <section id="benefits" className="py-20 md:py-24 px-5 md:px-12 bg-slate-50 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 md:mb-16 space-y-4 text-center">
          <p className="text-blue-600 text-[10px] md:text-sm font-bold uppercase tracking-widest">| 한정판 팬클럽 프리패스 카드 출시 |</p>
          <h2 className="text-3xl md:text-6xl font-display font-black tracking-tighter">
            멤버카드의 <span className="text-blue-600 italic">특권</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {settings.benefits.map((benefit: any, index: number) => {
            const IconComponent = ICON_MAP[benefit.icon] || Plus;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedBenefit(benefit)}
                className="bg-white p-8 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 group hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden"
              >
                {/* Hover Effect Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-[0.03] transition-opacity`} />
                
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-6 shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>

                <div className="space-y-4 relative z-10">
                   <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase">Benefit {index + 1}</div>
                   <h3 className="text-2xl font-bold tracking-tight">{benefit.title}</h3>
                   <p className="text-slate-500 text-sm leading-relaxed">{benefit.description}</p>
                   <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                      <span className="text-[11px] font-bold text-slate-400">{benefit.price}</span>
                      <button className="flex items-center gap-1.5 text-[11px] font-black text-blue-600 uppercase tracking-widest group-hover:gap-2 transition-all">
                         자세히 보기
                         <Plus className="w-3 h-3" />
                      </button>
                   </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <BenefitModal 
        isOpen={!!selectedBenefit} 
        onClose={() => setSelectedBenefit(null)} 
        benefit={selectedBenefit ? {...selectedBenefit, icon: ICON_MAP[selectedBenefit.icon] || Plus} : null} 
      />
    </section>
  );
}

