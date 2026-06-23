import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: "김서연",
    role: "VIP 회원 / 아티스트 A 팬",
    quote: "스카이라운지 디너쇼는 정말 인생 최고의 경험이었어요. 160m 높이에서 야경을 보며 아티스트와 같은 공간에 있다는 것만으로도 가입비가 전혀 아깝지 않았습니다.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    name: "이준호",
    role: "Premium 회원 / 아티스트 B 팬",
    quote: "크루즈 투어에서 아티스트와 함께했던 포토타임은 평생 잊지 못할 거예요. 단순한 공연 관람을 넘어선 '문화적 교감'이 무엇인지 확실히 깨닫게 해준 메이트였습니다.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    name: "박지민",
    role: "Gold 회원 / 아티스트 C 팬",
    quote: "바쁜 일정 때문에 행사에 참여하지 못했는데, 리콜 제도를 통해 10만원을 보항받았어요. 팬의 입장을 이렇게까지 배려해주는 서비스라니 정말 감동했습니다.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 md:px-12 bg-black relative overflow-hidden">
      {/* Decorative Aurora Blur */}
      <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-indigo-500/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
            이미 많은 팬들이 <span className="text-gradient">오로라와 함께하고 있습니다</span>
          </h2>
          <p className="text-slate-500">프리미엄 혜택을 직접 경험한 회원님들의 진솔한 이야기</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 flex flex-col h-full bg-slate-900/20 border-white/5 relative"
            >
              <Quote className="absolute top-6 right-8 w-10 h-10 text-indigo-500/10" />
              
              <div className="flex items-center gap-4 mb-8">
                <img 
                  src={t.image} 
                  alt={t.name} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500/20"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-white uppercase">{t.name}</h4>
                  <p className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">{t.role}</p>
                </div>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed italic">
                "{t.quote}"
              </p>
              
              <div className="mt-auto pt-6 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
