import { motion } from 'motion/react';
import { useSettings } from '../lib/useSettings';
import { Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Hero() {
  const { settings, loading } = useSettings();

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-transparent">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 px-5 md:px-10 overflow-hidden bg-transparent">
      {/* Cosmic Nebula Background & Light Effects */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[700px] h-[700px] bg-cyan-400/10 rounded-full blur-[160px]" />
        <div className="absolute top-[40%] right-[25%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Floating Sparkles Background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] [background-size:32px_32px] opacity-60" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 w-full relative">
        
        {/* Left Side: Copywriting & Actions */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center lg:items-start gap-4"
          >
            <div className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500/10 backdrop-blur-md rounded-full border border-amber-500/30 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
               <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
               <span className="text-amber-300 text-[10px] md:text-xs font-black uppercase tracking-widest">{settings.hero.badge}</span>
            </div>
            <h2 className="text-lg md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 drop-shadow-sm flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              {settings.hero.artist}
            </h2>
          </motion.div>
          
          {/* Copywriting Titles */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Logo/Badge Row */}
            <div className="flex justify-center lg:justify-start gap-3 flex-wrap">
              {(settings.hero.title + settings.hero.subtitle).split('').slice(0, 5).map((text: string, i: number) => (
                <div key={i} className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-slate-950/80 backdrop-blur-md flex items-center justify-center border border-amber-500/30 shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200 text-xl md:text-2xl font-black">{text}</span>
                </div>
              ))}
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black leading-[1] tracking-tighter text-white">
              {settings.hero.title}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F5D88D] to-[#9C6B1B] italic drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                {settings.hero.subtitle}
              </span>
            </h1>

            {/* Tagline Neon Box */}
            <div className="inline-block px-8 py-3.5 rounded-2xl border border-white/10 backdrop-blur-xl bg-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
               <span className="text-amber-200 text-sm md:text-lg font-bold tracking-tight">
                  {settings.hero.tagline}
               </span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 pt-4"
          >
            <Link to="/signup" className="btn-neon-3d-gold px-10 py-5 text-lg font-black group flex items-center gap-2">
              <span className="hidden sm:inline">VIP 멤버십 가입하기</span>
              <span className="sm:hidden">VIP 가입</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <div className="flex flex-col text-center sm:text-left">
              <span className="text-xs text-slate-400 uppercase tracking-widest font-black flex items-center gap-1">
                <span>🏆</span> 한정판 30주년 혜택가
              </span>
              <span className="font-display font-black text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-300 tracking-tighter drop-shadow-md">
                {settings.hero.membershipFee}
              </span>
            </div>
          </motion.div>


        </div>

        {/* Right Side: Luxury Card Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          className="lg:col-span-5 flex justify-center"
        >
          {/* Card Mockup (Luxurious Metallic Deep-Dark Neon theme) */}
          <div className="relative group w-full max-w-[420px] aspect-[1.58/1] rounded-[1.8rem] overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] backdrop-blur-xl bg-white/5 border border-white/20 transform hover:-rotate-1 hover:scale-105 transition-all duration-700">
             
             {/* Rich Metallic Deep Dark Background */}
             <div className="absolute inset-0 bg-cyan-900/40" />
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.2)_0%,transparent_60%)]" />
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.05)_0%,transparent_60%)]" />

             {/* Shining laser micro lines */}
             <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.01)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.01)_50%,rgba(255,255,255,0.01)_75%,transparent_75%,transparent)] [background-size:12px_12px]" />

             {/* Gold Star and Orbit Accent Graphic */}
             <div className="absolute top-[20%] right-[10%] w-32 h-32 border border-amber-400/20 rounded-full opacity-60 pointer-events-none filter blur-[1px] transform rotate-45" />
             <div className="absolute top-[20%] right-[10%] w-32 h-32 border-2 border-t-transparent border-amber-500/40 rounded-full opacity-80 pointer-events-none" />

             {/* Artist Image Masked */}
             <div className="absolute right-0 bottom-0 top-0 w-[60%] pointer-events-none overflow-hidden">
               <img 
                 src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80" 
                 alt="R.ef 30th" 
                 className="w-full h-full object-cover object-center opacity-60 group-hover:scale-110 transition-transform duration-700 grayscale hover:grayscale-0"
                 referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-gradient-to-r from-[#090e1a] via-[#090e1a]/40 to-transparent" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#090e1a]/80 to-transparent" />
             </div>

             {/* Card Top Details */}
             <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
               <div className="flex items-center gap-1.5">
                 <Logo size="sm" showText={false} />
                 <span className="text-[10px] font-black tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-400 to-amber-100 uppercase">
                   R.ef 30th Anniversary
                 </span>
               </div>
               {/* Smart Card Chip */}
               <div className="w-10 h-7 rounded-md bg-gradient-to-br from-[#D4AF37] via-[#F5D88D] to-[#9C6B1B] shadow-inner flex flex-col justify-between p-1.5 border border-amber-400/30">
                 <div className="h-[1px] bg-black/40" />
                 <div className="h-[1px] bg-black/40" />
                 <div className="h-[1px] bg-black/40" />
               </div>
             </div>

             {/* Card Number & Expiry */}
             <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-10">
               <div className="space-y-1">
                 <div className="text-amber-100/90 font-mono text-base md:text-lg tracking-[0.3em] drop-shadow-md">
                   3030 **** 1995 ****
                 </div>
                 <div className="flex items-center gap-4">
                   <div className="text-[9px] text-amber-500/70 font-black tracking-widest uppercase">
                     EXP 10/30
                   </div>
                   <div className="text-[9px] text-amber-500/70 font-black tracking-widest uppercase">
                     LEGENDARY
                   </div>
                 </div>
               </div>
               {/* Membership Signature Stamp */}
               <div className="text-right">
                 <div className="text-[9px] text-amber-400 font-black tracking-widest uppercase mb-0.5">VIP MEMBERSHIP</div>
                 <div className="text-sm font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 italic tracking-tighter">Gold Edition</div>
               </div>
             </div>

             {/* Watermark Logo Accent */}
             <div className="absolute top-1/2 left-6 -translate-y-1/2 opacity-5 pointer-events-none">
               <Logo size="lg" showText={false} />
             </div>
             
             {/* Dynamic Light Shine Animation on hover */}
             <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover:animate-[shine_1.5s_infinite]" />
          </div>
        </motion.div>
      </div>

      {/* Modern Neon Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-transparent to-transparent pointer-events-none" />
    </section>
  );
}
