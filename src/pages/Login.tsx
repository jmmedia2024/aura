import { motion } from 'motion/react';
import { Mail, Lock, LogIn, Loader2, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed' || (err.message && err.message.includes('operation-not-allowed'))) {
        setError('파이어베이스 설정 오류: 이메일/비밀번호 로그인 방식이 활성화되어 있지 않습니다. 아래의 "Google 계정으로 계속하기"를 이용해 간편 동기화 로그인 하시면 즉시 모든 기능을 사용하실 수 있습니다.');
      } else {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        const isDefaultAdmin = user.email === 'new2020.jeonil@gmail.com';
        await setDoc(docRef, {
          userId: user.uid,
          email: user.email || '',
          displayName: user.displayName || '사용자',
          tier: isDefaultAdmin ? 'Legend Tier' : 'Basic',
          role: isDefaultAdmin ? 'Admin' : 'User',
          referredByEmail: '',
          ancestors: [],
          phoneNumber: '',
          createdAt: serverTimestamp(),
        });
      } else {
        if (user.email === 'new2020.jeonil@gmail.com') {
          const currentData = docSnap.data();
          if (currentData.role !== 'Admin' || currentData.tier !== 'Legend Tier') {
            await setDoc(docRef, {
              ...currentData,
              role: 'Admin',
              tier: 'Legend Tier',
            }, { merge: true });
          }
        }
      }
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google 로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-5 flex items-center justify-center bg-[#02050c] relative overflow-hidden">
      {/* Decorative Aurora Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-slate-950/85 backdrop-blur-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.8),_0_0_30px_rgba(59,130,246,0.15)] p-8 md:p-12 border border-blue-500/20 z-10"
      >
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-display font-black tracking-tighter text-white">
              환영합니다! 🌟
            </h1>
            <p className="text-slate-400 text-xs font-semibold">팬덤 오로라의 특별한 혜택을 확인하세요</p>
          </div>

          {error && (
            <div className="p-4 bg-red-950/40 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 pl-12 text-slate-100 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-slate-600"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 pl-12 text-slate-100 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-slate-600"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              </div>
            </div>
            
            <div className="flex items-center justify-end">
              <a href="#" className="text-xs font-bold text-cyan-400 hover:underline">비밀번호를 잊으셨나요?</a>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/10 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            {loading ? '로그인 중...' : '로그인'}
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-900"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-slate-500">
              <span className="bg-slate-950 px-4">또는 구글로 계속하기</span>
            </div>
          </div>

          <div className="space-y-3">
              <button 
                type="button" 
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-slate-900 border border-slate-800 text-slate-200 hover:border-cyan-500/30 rounded-2xl text-xs font-black hover:bg-slate-850 active:scale-[0.99] transition-all shadow-sm"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.66.86-1.06 2.11-1.06 3.71z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Google 계정으로 로그인 (1초 안전인증)
              </button>
          </div>

          <p className="text-center text-xs md:text-sm text-slate-400">
            계정이 없으신가요? {' '}
            <Link to="/signup" className="text-cyan-400 font-bold hover:underline">회원가입</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
