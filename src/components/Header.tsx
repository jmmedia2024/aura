import { motion, useScroll, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { User, LogOut, Settings, Sparkles } from 'lucide-react';
import Logo from './Logo';

export default function Header() {
  const { scrollYProgress } = useScroll();
  const { user, profile, signOut } = useAuth();
  const isAdmin = user && user.email === 'new2020.jeonil@gmail.com';

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-700 origin-[0%] z-[60]"
        style={{ scaleX }}
      />
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 py-3 md:py-4 backdrop-blur-2xl bg-[#050814]/40 border-b border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
      >
        <Link to="/" className="flex items-center gap-2 group">
          <Logo size="sm" showText={true} />
        </Link>
        
        <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-300">
          <a href="/#benefits" className="hover:text-[#D4AF37] transition-colors">멤버 특권</a>
          <a href="/#trust" className="hover:text-[#D4AF37] transition-colors">리콜 제도</a>
          <a href="/#value" className="hover:text-[#D4AF37] transition-colors">가치 비교</a>
          <a href="/#faq" className="hover:text-[#D4AF37] transition-colors">문의하기</a>
          <Link to="/signup" className="text-amber-200 hover:text-amber-300 transition-colors font-extrabold flex items-center gap-1.5 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/30 shadow-[0_0_10px_rgba(212,175,55,0.15)]">VIP 멤버십 가입 🌟</Link>
          {user && (
            <Link to="/mypage" className="text-amber-400 hover:text-amber-300 transition-all font-black flex items-center gap-1 bg-amber-950/50 px-3.5 py-1.5 rounded-full border border-amber-500/30">
              마이페이지
              {profile && (profile.role === 'Sales' || profile.role === 'Admin') && (
                <span className="text-[9px] bg-amber-600 text-black px-1.5 py-0.5 rounded font-black uppercase">Sales</span>
              )}
            </Link>
          )}
        </nav>
        
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
               {user && (
                  <Link to="/mypage" className="p-2.5 rounded-full bg-amber-950/50 text-amber-400 hover:bg-amber-900/50 transition-colors lg:hidden" title="Mypage">
                    <User className="w-4 h-4" />
                  </Link>
               )}
               {isAdmin && (
                  <Link to="/admin" className="p-2.5 rounded-full bg-amber-950/50 text-amber-400 hover:bg-amber-100/50 transition-colors" title="Admin Settings">
                    <Settings className="w-4 h-4" />
                  </Link>
               )}
               <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-amber-950/40 rounded-full border border-amber-500/20">
                  <User className="w-3 h-3 text-amber-400" />
                  <span className="text-xs font-black text-amber-200">{profile?.display_name || user.email}님 환영합니다</span>
               </div>
               <button 
                  onClick={handleLogout}
                  className="p-2.5 rounded-full bg-slate-900 text-slate-400 hover:bg-slate-800 transition-colors"
                  title="로그아웃"
               >
                  <LogOut className="w-4 h-4" />
               </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block py-2 px-6 text-sm font-bold text-amber-400 border border-amber-500/50 hover:border-amber-400 hover:text-white hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all rounded-full">
                로그인
              </Link>
              <Link to="/signup" className="px-5 py-2.5 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-800 text-black rounded-full text-xs md:text-sm font-black shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] transition-all text-center flex items-center gap-1.5">
                <span className="hidden sm:inline">가입하기</span>
                <span className="sm:hidden">VIP</span>
                <Sparkles className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </motion.header>
    </>
  );
}
