import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BenefitModalProps {
  isOpen: boolean;
  onClose: () => void;
  benefit: {
    title: string;
    description: string;
    image: string;
    date: string; // ISO string or similar
    schedule: string[];
    price: string;
    color: string;
  } | null;
}

interface MapPlaceholderProps {
  location: string;
}

function MapPlaceholder({ location }: MapPlaceholderProps) {
  const isSokcho = location.includes('속초');
  const isWavePark = location.includes('웨이브파크');
  const isCruise = location.includes('크루즈');

  return (
    <div className="relative w-full h-40 bg-blue-50 rounded-2xl overflow-hidden border border-blue-100 group">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {/* Simple Grid Pattern for Map-like feel */}
        <div className="absolute inset-0 bg-[#3b82f6] opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      </div>
      
      {/* Decorative Landmasses (Abstract) */}
      <div className="absolute top-4 left-10 w-24 h-16 bg-blue-200/50 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-6 right-12 w-32 h-20 bg-blue-300/30 rounded-full blur-2xl"></div>

      {/* Landmarks based on location */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative"
        >
          <div className="w-4 h-4 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.8)] animate-bounce" />
          <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 py-1.5 rounded-lg shadow-lg border border-blue-50 text-[10px] font-black text-blue-600 uppercase tracking-widest">
            {isSokcho ? "Sokcho Sky Lounge" : isWavePark ? "Wave Park Stage" : isCruise ? "Cruise Terminal" : "Event Venue"}
          </div>
        </motion.div>

        {isSokcho && (
          <div className="absolute top-1/4 right-1/4">
             <div className="w-2 h-2 bg-blue-300 rounded-full opacity-50" />
             <div className="text-[8px] text-slate-400 font-bold mt-1">Eastern Coast</div>
          </div>
        )}
      </div>

      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
          <MapPin className="w-3 h-3 text-blue-600" />
        </div>
        <span className="text-[9px] font-black text-blue-900/40 uppercase tracking-widest">Live Map Preview</span>
      </div>
    </div>
  );
}

export default function BenefitModal({ isOpen, onClose, benefit }: BenefitModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!isOpen) {
      setIsSubscribed(false);
      setPhoneNumber('');
    }
  }, [isOpen]);

  const handleSubscribe = () => {
    if (phoneNumber.length >= 10) {
      setIsSubscribed(true);
    }
  };

  useEffect(() => {
    if (!benefit || !isOpen) return;

    const targetDate = new Date(benefit.date).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [benefit, isOpen]);

  if (!benefit) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-full max-h-[85vh] md:h-auto"
          >
            {/* Image Section */}
            <div className="relative w-full md:w-1/2 h-64 md:h-auto">
              <img 
                src={benefit.image} 
                className="absolute inset-0 w-full h-full object-cover"
                alt={benefit.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <div className="text-[10px] uppercase font-black tracking-[0.2em] mb-2 text-cyan-400">Next Event Countdown</div>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'Days', value: timeLeft.days },
                    { label: 'Hrs', value: timeLeft.hours },
                    { label: 'Min', value: timeLeft.minutes },
                    { label: 'Sec', value: timeLeft.seconds }
                  ].map((unit, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl font-display font-black leading-none">{String(unit.value).padStart(2, '0')}</div>
                      <div className="text-[8px] uppercase font-bold text-white/50">{unit.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors z-10"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${benefit.color} text-white text-[10px] font-black uppercase tracking-widest`}>
                    Premium Program
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight text-slate-900 leading-[1.1]">
                    {benefit.title}
                  </h2>
                  <p className="text-slate-500 text-base leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                         <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">일정</div>
                         <div className="text-sm font-bold text-slate-700">{new Date(benefit.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                         <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">장소</div>
                         <div className="text-sm font-bold text-slate-700">추후 공지 (회원 전용)</div>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-widest">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Detailed Schedule
                  </h4>
                  <div className="space-y-3">
                    {benefit.schedule.map((item, i) => (
                      <div key={i} className="flex gap-4 items-start group">
                         <div className="w-px h-8 bg-slate-200 group-last:bg-transparent mt-1 ml-[5px] relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-blue-600 border-4 border-blue-100" />
                         </div>
                         <span className="text-sm text-slate-600 font-medium leading-tight pt-0.5">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Share Event</div>
                   <div className="flex gap-3">
                      <button className="w-8 h-8 rounded-full bg-[#FEE500] flex items-center justify-center hover:scale-110 transition-transform active:scale-95 shadow-sm" title="Share to KakaoTalk">
                         <span className="text-[14px] font-black text-[#3C1E1E]">K</span>
                      </button>
                      <button className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center hover:scale-110 transition-transform active:scale-95 shadow-sm text-white" title="Share to Instagram">
                         <div className="w-4 h-4 border-2 border-white rounded-sm relative after:content-[''] after:absolute after:top-0.5 after:right-0.5 after:w-0.5 after:h-0.5 after:bg-white after:rounded-full before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:border-2 before:border-white before:rounded-full" />
                      </button>
                   </div>
                </div>

                <MapPlaceholder location={benefit.title} />

                {/* Event Notification Feature */}
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">24H Notification</span>
                   </div>
                   
                   <AnimatePresence mode="wait">
                      {!isSubscribed ? (
                        <motion.div 
                          key="input"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-3"
                        >
                           <p className="text-xs font-bold text-slate-600">행사 24시간 전 리마인드 문자를 보내드립니다.</p>
                           <div className="flex gap-2">
                              <input 
                                type="tel" 
                                placeholder="010-0000-0000"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              />
                              <button 
                                onClick={handleSubscribe}
                                className="px-4 py-2 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-black transition-colors"
                              >
                                알림 신청
                              </button>
                           </div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="success"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center justify-center py-2 text-center"
                        >
                           <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                           </div>
                           <p className="text-sm font-black text-slate-900">알림 예약 완료!</p>
                           <p className="text-[10px] text-slate-500 mt-0.5">행사 24시간 전에 문자를 보내드리겠습니다.</p>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>

                <button className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all">
                  참여 예약하기
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
