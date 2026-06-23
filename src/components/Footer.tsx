export default function Footer() {
  return (
    <footer className="bg-[#020617] py-8 px-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-slate-600 uppercase tracking-widest">
      <p>© 2026 KOYOTE SHINJI FANDOM TOUR PROJECT. ALL RIGHTS RESERVED.</p>
      <div className="flex gap-8">
        <a href="#" className="hover:text-white transition-colors">TERMS OF SERVICE</a>
        <a href="#" className="hover:text-white transition-colors">PRIVACY POLICY</a>
        <a href="#" className="hover:text-white transition-colors">PARTNERSHIP</a>
      </div>
    </footer>
  );
}
