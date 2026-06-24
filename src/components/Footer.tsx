import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-transparent py-12 px-6 md:px-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-slate-500 uppercase tracking-widest relative">
      {/* Absolute top neon divider line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      
      <div className="flex flex-col items-center md:items-start gap-3">
        <Logo size="sm" showText={true} />
        <p className="text-center md:text-left leading-relaxed mt-2 text-[9px] font-semibold text-slate-500">
          © 2026 KOYOTE SHINJI FANDOM AURORA PROJECT. ALL RIGHTS RESERVED.
        </p>
      </div>

      <div className="flex flex-col items-center md:items-end gap-6">
        <div className="flex flex-wrap justify-center md:justify-end gap-6 md:gap-8 font-black">
          <a href="#" className="hover:text-[#D4AF37] transition-all hover:shadow-[0_0_8px_rgba(212,175,55,0.2)]">TERMS OF SERVICE</a>
          <a href="#" className="hover:text-[#D4AF37] transition-all hover:shadow-[0_0_8px_rgba(212,175,55,0.2)]">PRIVACY POLICY</a>
          <div className="flex flex-col items-center md:items-end gap-2">
            <span className="text-amber-500/80 text-[9px] font-black tracking-[0.2em]">PARTNERSHIP</span>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-[9px] font-bold text-slate-400">
              <a href="#" className="hover:text-blue-400 transition-colors">DB: APPLICATIONS</a>
              <a href="#" className="hover:text-purple-400 transition-colors">DB: DESIGNS</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">DB: PROFILES</a>
              <a href="#" className="hover:text-amber-400 transition-colors">DB: SETTINGS</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
