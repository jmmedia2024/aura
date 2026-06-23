import { motion, useScroll, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { useFirebase } from '../lib/FirebaseContext';
import { auth } from '../lib/firebase';
import { User, LogOut, Settings } from 'lucide-react';

export default function Header() {
  const { scrollYProgress } = useScroll();
  const { user, profile } = useFirebase();
  const isAdmin = user && user.email === 'new2020.jeonil@gmail.com';

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleLogout = async () => {
    try {
      localStorage.removeItem('demo_user_auth');
      await auth.signOut();
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-[0%] z-[60]"
        style={{ scaleX }}
      />
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 py-4 md:py-5 backdrop-blur-md bg-white/70 border-b border-blue-100"
      >
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-[10px] group-hover:scale-110 transition-transform">SJ</div>
        <span className="font-display font-black text-lg md:text-xl tracking-tighter text-blue-600 uppercase">Shinji Fandom Tour</span>
      </Link>
      <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600">
        <a href="/#benefits" className="hover:text-blue-600 transition-colors">멤버 특권</a>
        <a href="/#trust" className="hover:text-blue-600 transition-colors">리콜 제도</a>
        <a href="/#value" className="hover:text-blue-600 transition-colors">가치 비교</a>
        <a href="/#faq" className="hover:text-blue-600 transition-colors">문의하기</a>
        <Link to="/apply" className="text-blue-600 hover:text-blue-700 transition-colors font-extrabold flex items-center gap-1.5 bg-blue-50/50 px-3 py-1 rounded-full border border-blue-150">나의 팬 선택 🌟</Link>
        {user && (
          <Link to="/mypage" className="text-blue-600 hover:text-blue-800 transition-all font-black flex items-center gap-1 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            마이페이지
            {profile && (profile.role === 'Sales' || profile.role === 'Admin') && (
              <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-black uppercase">Sales</span>
            )}
          </Link>
        )}
      </nav>
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-4">
             {user && (
               <Link to="/mypage" className="p-2.5 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors lg:hidden" title="Mypage">
                 <User className="w-4 h-4" />
               </Link>
             )}
             {isAdmin && (
               <Link to="/admin" className="p-2.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="Admin Settings">
                 <Settings className="w-4 h-4" />
               </Link>
             )}
             <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                <User className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-black text-blue-900">{profile?.displayName || user.email}님 환영합니다</span>
             </div>
             <button 
                onClick={handleLogout}
                className="p-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                title="로그아웃"
             >
                <LogOut className="w-4 h-4" />
             </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="hidden sm:block py-2 px-6 text-sm font-bold text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white transition-all rounded-full">
              로그인
            </Link>
            <Link to="/signup" className="bg-blue-600 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold shadow-lg shadow-blue-500/20 hover:scale-105 transition-all text-center">
              가입하기
            </Link>
          </>
        )}
      </div>
    </motion.header>
    </>
  );
}
