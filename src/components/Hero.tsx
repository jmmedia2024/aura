import { motion } from 'motion/react';
import { useSettings } from '../lib/useSettings';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const { settings, loading } = useSettings();

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-blue-600">
      <Loader2 className="w-8 h-8 text-white animate-spin" />
    </div>
  );

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 px-5 md:px-10 overflow-hidden bg-gradient-to-b from-[#3b82f6] via-[#60a5fa] to-[#93c5fd]">
      {/* Cloud & Light Effects (Aesthetic based on Screenshot 1) */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[300px] bg-white rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[400px] bg-white rounded-full blur-[120px]" />
        <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-blue-200 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 w-full relative">
        <div className="space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center lg:items-start gap-4"
          >
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
               <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
               <span className="text-white text-[10px] md:text-xs font-black uppercase tracking-widest">{settings.hero.badge}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white/90 drop-shadow-sm">{settings.hero.artist}</h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Circles as seen in Screenshot 1 */}
            <div className="flex justify-center lg:justify-start gap-3">
              {(settings.hero.title + settings.hero.subtitle).split('').slice(0, 4).map((text: string, i: number) => (
                <div key={i} className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-700/80 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl">
                  <span className="text-white text-xl md:text-2xl font-black">{text}</span>
                </div>
              ))}
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black leading-[0.9] tracking-tighter text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              {settings.hero.title}<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-white italic">{settings.hero.subtitle}</span>
            </h1>

            <div className="inline-block px-10 py-3 rounded-full border-2 border-white/50 backdrop-blur-sm bg-white/5">
               <span className="text-white text-base md:text-xl font-bold">{settings.hero.tagline}</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 pt-6"
          >
            <Link to="/apply" className="bg-white text-blue-600 hover:bg-blue-50 text-xl font-black py-5 px-10 rounded-full shadow-[0_15px_40px_-5px_rgba(255,255,255,0.4)] transition-all active:scale-95 group text-center inline-block">
              나의 팬 선택하기
            </Link>
            <div className="flex flex-col text-center sm:text-left">
              <span className="text-xs text-white/70 uppercase tracking-widest font-black">Membership Fee</span>
              <span className="font-display font-black text-4xl text-white tracking-tighter drop-shadow-md">{settings.hero.membershipFee}</span>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          className="flex justify-center lg:justify-end"
        >
          {/* Card Mockup based on Screenshot 1 */}
          <div className="relative group w-full max-w-[440px] aspect-[1.58/1] rounded-[1.5rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] border-4 border-white/30 transform hover:-rotate-1 transition-all duration-700">
             {/* Pink/Rose Theme for Shinji Card */}
             <div className="absolute inset-0 bg-gradient-to-br from-rose-200 via-rose-100 to-rose-300" />
             
             {/* Shinji Photo Placeholder */}
             <div className="absolute inset-x-0 bottom-0 top-0">
               <img 
                 src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80" 
                 alt="Shinji" 
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-rose-400/30 to-transparent" />
             </div>

             {/* Card Details */}
             <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
               <div className="text-rose-900/60 mix-blend-multiply italic font-serif">"SHINJI"</div>
               <div className="w-12 h-8 rounded-md bg-gradient-to-r from-yellow-300 to-yellow-600 shadow-inner" />
             </div>

             <div className="absolute bottom-10 left-8 space-y-2">
               <div className="text-rose-900/60 font-mono text-xl tracking-[0.2em]">4265 **** **** ****</div>
               <div className="flex items-end gap-3">
                 <div className="text-[10px] items-center gap-1 inline-flex bg-white/40 px-2 py-0.5 rounded text-rose-900 font-bold uppercase tracking-widest">Visa Debit</div>
               </div>
             </div>

             <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col items-end opacity-20 pointer-events-none">
               <span className="text-rose-900 font-display font-black text-6xl italic leading-none">SHINJI</span>
             </div>
             
             {/* Shine Effect */}
             <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] group-hover:animate-[shine_2s_infinite]" />
          </div>
        </motion.div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
