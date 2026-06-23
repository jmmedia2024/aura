import { motion } from 'motion/react';
import { Utensils, Play, Users } from 'lucide-react';

const programs = [
  {
    category: "Sky Lounge Fanmeeting",
    title: "팬덤 서비스의 90분",
    subtitle: "| 파노라마 오션뷰에 감동이 물결 스카이라운지 팬미팅 |",
    items: [
      { 
        type: "Dining", 
        icon: Utensils,
        desc: "이탈리안 최고의 셰프가 제공하는 디너",
        images: ["https://images.unsplash.com/photo-1544333346-64e4fe18274d?auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80"]
      },
      { 
        type: "Play", 
        icon: Play,
        desc: "파노라마 씨뷰 기념 촬영 그리고 코요테 특별 공연",
        images: ["https://images.unsplash.com/photo-1520390138845-fd2d229dd553?auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80"]
      },
      { 
        type: "Family", 
        icon: Users,
        desc: "즐거운 파티와 숙박제공",
        images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80"]
      }
    ]
  },
  {
    category: "Cruise Tour",
    title: "팬크루즈 취향 1박2일",
    subtitle: "| 지루할 틈 없는 바다 위 24시간 |",
    items: [
      { 
        type: "Dining", 
        icon: Utensils,
        desc: "아침부터 야식까지, 전 미식을 맛보는 '메인 뷔페 레스토랑'",
        images: ["https://images.unsplash.com/photo-1550966841-3eeec794619d?auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1546039907-7fa05f864c02?auto=format&fit=crop&q=80"]
      },
      { 
        type: "Play", 
        icon: Play,
        desc: "동해선상의 밤바다, 카지노, 그리고 코요테 특별 공연",
        images: ["https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1578496479914-723f74c24ee1?auto=format&fit=crop&q=80"]
      },
      { 
        type: "Family", 
        icon: Users,
        desc: "즐거운 사교 클럽과 고급 2인룸",
        images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80"]
      }
    ]
  }
];

export default function ServiceDetails() {
  return (
    <section className="py-20 md:py-32 px-5 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto space-y-32">
        {programs.map((program, pIndex) => (
          <div key={pIndex} className="space-y-12">
            <div className="text-center space-y-4">
              <p className="text-blue-600 font-bold text-xs md:text-sm tracking-widest uppercase">{program.subtitle}</p>
              <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter text-slate-900">{program.title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {program.items.map((item, iIndex) => (
                <motion.div 
                  key={iIndex}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: iIndex * 0.1 }}
                  className="bg-slate-50 rounded-[2.5rem] overflow-hidden flex flex-col border border-slate-100"
                >
                  <div className="p-8 pb-4 flex flex-col items-center">
                    <span className="text-blue-600 font-black text-2xl mb-2">{iIndex + 1}</span>
                    <h3 className="text-4xl md:text-5xl font-serif italic text-blue-600 mb-4">{item.type}</h3>
                    <p className="text-slate-500 text-sm font-bold text-center leading-tight min-h-[40px]">{item.desc}</p>
                  </div>
                  <div className="flex-1 grid grid-cols-1 gap-2 p-4 pt-4">
                    {item.images.map((img, imgIndex) => (
                      <div key={imgIndex} className="aspect-square rounded-3xl overflow-hidden shadow-sm">
                        <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt={item.type} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
