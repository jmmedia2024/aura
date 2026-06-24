import { motion } from 'motion/react';
import { Mail, Lock, User, UserPlus, Loader2, Users, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [signUpRole, setSignUpRole] = useState<'User' | 'Sales'>('User');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      const user = authData.user;
      if (!user) throw new Error('회원가입에 실패했습니다.');

      let ancestors: string[] = [];
      const recruiterEmailClean = signUpRole === 'Sales' ? recruiterEmail.trim() : '';

      if (recruiterEmailClean) {
        const { data: recruiterData } = await supabase
          .from('users')
          .select('*')
          .eq('email', recruiterEmailClean)
          .single();

        if (recruiterData) {
          ancestors = [recruiterEmailClean, ...(recruiterData.ancestors || [])];
        } else {
          ancestors = [recruiterEmailClean];
        }
      }

      const { error: supabaseError } = await supabase
        .from('users')
        .insert([{
          userId: user.id,
          email: email,
          displayName: displayName,
          tier: signUpRole === 'Sales' ? 'Gold' : 'Basic',
          role: signUpRole,
          referredByEmail: recruiterEmailClean,
          ancestors: ancestors,
          phoneNumber: '',
          createdAt: new Date().toISOString(),
        }]);

      if (supabaseError) throw supabaseError;

      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });
      if (authError) throw authError;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google 로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-5 flex items-center justify-center bg-[#02050c] relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-xl bg-slate-950/85 backdrop-blur-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.8),_0_0_30px_rgba(99,102,241,0.15)] p-8 md:p-12 border border-blue-500/20 z-10"
      >
        <form onSubmit={handleSignup} className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-cyan-300 rounded-full text-[10px] font-black uppercase tracking-widest mb-1 border border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              Membership Registration
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-black tracking-tighter text-white">팬클럽 카드 가입</h1>
            <p className="text-slate-400 text-xs font-semibold leading-relaxed">2026 한정판 코요태 신지 팬카드의 주인공이 되세요</p>
          </div>

          {error && (
            <div className="p-4 bg-red-950/40 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl text-center">
              {error}
            </div>
          )}

          {/* Role Choice tabs */}
          <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setSignUpRole('User')}
              className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
                signUpRole === 'User'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-650 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              일반회원 가입
            </button>
            <button
              type="button"
              onClick={() => setSignUpRole('Sales')}
              className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
                signUpRole === 'Sales'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-650 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              크리에이터 가입
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="홍길동"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 pl-12 text-slate-100 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-slate-600"
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                </div>
              </div>

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

              {signUpRole === 'Sales' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">추천인 이메일 (크리에이터 - 선택)</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      placeholder="recruiter@example.com"
                      value={recruiterEmail}
                      onChange={(e) => setRecruiterEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 pl-12 text-slate-100 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-slate-600"
                    />
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                 <div className="flex items-center gap-2">
                    <input type="checkbox" required className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-blue-500 focus:ring-blue-500/20" />
                    <span className="text-[10px] md:text-xs font-black text-slate-300 uppercase">이용 약관 동의</span>
                 </div>
                 <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                   본 가입 버튼을 누르시면, 전일미디어 통합 팬 서비스 지침 및 보안 규정을 완전히 확인하고 동의한 것으로 간주됩니다.
                 </p>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/10 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                {loading ? '가입 중...' : '회원가입 신청'}
              </button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-900"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-slate-500">
                  <span className="bg-slate-950 px-3">또는 간편가입</span>
                </div>
              </div>

              <button 
                type="button" 
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-slate-900 border border-slate-800 text-slate-200 hover:border-cyan-500/30 rounded-2xl text-xs font-black hover:bg-slate-850 active:scale-[0.99] transition-all shadow-sm"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.66.86-1.06 2.11-1.06 3.71z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Google 계정으로 1초 가입 (강력 추천)
              </button>
            </div>
          </div>

          <p className="text-center text-xs md:text-sm text-slate-400">
            이미 계정이 있으신가요? {' '}
            <Link to="/login" className="text-cyan-400 font-bold hover:underline">로그인</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
