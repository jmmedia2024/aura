import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { 
  Sparkles, 
  Check, 
  Loader2, 
  Heart, 
  ArrowLeft, 
  User, 
  AlertCircle,
  Award
} from 'lucide-react';

const PRESET_FANS = [
  {
    id: 'ref_park',
    name: '박철우 (레전드 리더 & 래퍼)',
    emoticon: '🕶️🎤👑',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
    description: 'R.ef의 중심, 카리스마 넘치는 래핑과 무대 장악력의 상징.'
  },
  {
    id: 'ref_sung',
    name: '성대현 (분위기 메이커 & 만능 엔터테이너)',
    emoticon: '⚡🎙️🔥',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    description: '재치 있는 입담과 변함없는 열정, 팬들의 마음을 훔치는 무대 매너.'
  },
  {
    id: 'ref_lee',
    name: '이성욱 (천상의 보이스 & 원조 비주얼)',
    emoticon: '💎🎶✨',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    description: 'R.ef의 감성을 완성하는 감미로운 미성과 압도적 비주얼.'
  },
  {
    id: 'ref_30th',
    name: 'R.ef 30주년 완전체 (상심 에디션)',
    emoticon: '🏆🖤🥇',
    imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=800&q=80',
    description: '세 멤버가 하나가 된 가장 완벽한 순간, 30주년 한정판 완전체 컷.'
  }
];

export default function Apply() {
  const { user, profile, loading: authLoading, getToken } = useAuth();
  const navigate = useNavigate();

  const [savingId, setSavingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelectFan = async (fanId: string, name: string, imageUrl: string) => {
    if (!user) {
      setErrorMessage('로그인이 필요한 서비스입니다.');
      return;
    }
    setSavingId(fanId);
    setErrorMessage('');

    try {
      const token = await getToken();
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          selected_fan_id: fanId,
          selected_fan_name: name,
          selected_fan_photo_url: imageUrl,
          selected_fan_updated_at: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Simulate subtle feedback duration
      await new Promise(resolve => setTimeout(resolve, 800));
      window.location.reload(); // Refresh to get updated profile from context
    } catch (err: any) {
      console.error("Error updating selected fan: ", err);
      setErrorMessage('최애 팬 선택 저장에 실패했습니다: ' + err.message);
    } finally {
      setSavingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto" />
          <p className="text-slate-400 text-xs font-semibold">팬 선택 및 로그인 데이터 수신 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-5 flex items-center justify-center bg-transparent relative overflow-hidden" id="login-required-container">
        <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-md w-full bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] text-center space-y-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto text-amber-400 border border-amber-500/20">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white tracking-tight">나의 팬 선택 서비스</h1>
            <p className="text-xs text-slate-400 leading-relaxed px-4">
              본 서비스는 R.ef 30주년 한정판 혜택을 누릴 수 있는 최애 아티스트 선택 공간입니다.<br />
              로그인 후 어떠한 복잡한 가입 절차 없이 클릭 한 번으로 최애를 선택해 보세요.
            </p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-black rounded-2xl text-xs font-black hover:opacity-90 active:scale-[0.99] transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)]"
          >
            로그인 하러 가기
          </button>
          <div className="text-center pt-2">
            <Link to="/" className="text-xs text-slate-500 underline font-medium hover:text-slate-300">메인 화면으로</Link>
          </div>
        </div>
      </div>
    );
  }

  const currentFanName = profile?.selected_fan_name || '';
  const currentFanPhoto = profile?.selected_fan_photo_url || '';
  const currentFanId = profile?.selected_fan_id || '';

  // Get matching emoticon for active selected fan
  const currentEmoticon = PRESET_FANS.find(f => f.id === currentFanId)?.emoticon || '💖🌟';

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-transparent text-slate-100 relative overflow-hidden" id="apply-page-content-wrapper">
      {/* Background ambient lighting */}
      <div className="absolute top-[10%] left-[25%] w-[400px] h-[400px] bg-amber-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[10%] w-[350px] h-[350px] bg-yellow-600/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-6xl mx-auto z-10 relative">
        {/* Title */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-amber-300 text-[9px] font-black uppercase tracking-wider">R.ef 30th Anniversary Selection</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black text-white tracking-tight">
            나의 레전드 선택 🌟
          </h1>
          
          {/* Responsive Copwriting Section */}
          <div className="max-w-xl mx-auto">
            {/* Desktop Only detailed explanation */}
            <p className="hidden md:block text-slate-400 text-xs md:text-sm leading-relaxed">
              원하는 R.ef 멤버의 30주년 한정판 스타 사진을 마우스 클릭 단 한 번만으로 선택해 보세요!<br />
              선택하시는 순간, 마이페이지 나의 정보란에 실시간으로 반영되어 고유 엠블럼과 뱃지가 활성화됩니다.
            </p>
            {/* Mobile Only clean emoticon and simple text layout */}
            <p className="md:hidden text-amber-300 text-sm font-black flex items-center justify-center gap-1">
              <span>👉</span> 멤버 사진 클릭! 즉시 마이페이지 반영 📱🌟✨
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-950/40 text-red-400 text-xs font-bold rounded-2xl flex items-center gap-2 border border-red-500/20 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Realtime Choice Summary (Sleek Dark Glass) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-slate-950/80 backdrop-blur-md rounded-3xl border border-amber-500/20 shadow-2xl space-y-5">
              <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest block">
                실시간 탑재 상태
              </span>
              
              {currentFanName ? (
                <div className="space-y-4">
                  {/* Selected Fan Preview Photo Display */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md border border-slate-800 group">
                    <img 
                      src={currentFanPhoto} 
                      alt={currentFanName} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-600 to-yellow-500 text-black rounded-full p-2.5 shadow-md">
                      <Heart className="w-4 h-4 fill-black animate-pulse" />
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[9px] bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block mb-1.5 backdrop-blur-sm shadow-md">
                        CURRENT LEGEND
                      </span>
                      {/* Responsive text presentation using emoticons for mobile */}
                      <h3 className="hidden md:block text-white text-base font-black truncate">{currentFanName}</h3>
                      <h3 className="md:hidden text-white text-lg font-black truncate flex items-center gap-1.5">
                        <span>{currentEmoticon}</span>
                        <span>선택 완료</span>
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1 text-xs">
                    {/* Desktop detailed rows */}
                    <div className="hidden md:flex py-2.5 px-3.5 bg-slate-900/60 rounded-xl border border-slate-800 items-center justify-between">
                      <span className="text-slate-400 font-bold">탑재된 아티스트</span>
                      <span className="font-extrabold text-[#D4AF37]">{currentFanName}</span>
                    </div>
                    {/* Mobile optimized Emoticon status row */}
                    <div className="md:hidden py-3 px-4 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/30 flex items-center justify-between">
                      <span className="text-amber-300 font-black">나의 레전드 뱃지</span>
                      <span className="text-lg font-black animate-bounce">{currentEmoticon} ✅</span>
                    </div>
                    
                    <div className="py-2.5 px-3.5 bg-slate-900/40 rounded-xl border border-slate-900 flex items-center justify-between">
                      <span className="text-slate-500">기본 연동 상태</span>
                      <span className="font-extrabold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> 실시간 동기화 완료
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center space-y-4 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto text-amber-400 border border-amber-500/20">
                    <Heart className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1 px-4">
                    <p className="text-white text-xs font-black">아직 선택된 레전드가 없습니다</p>
                    <p className="text-slate-500 text-[10px] leading-relaxed">우측 리스트에서 원하는 멤버를 클릭하시면 즉시 마이페이지 나의 정보에 표시됩니다.</p>
                  </div>
                </div>
              )}

              <Link 
                to="/mypage"
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-800 text-black font-black text-xs rounded-2xl hover:opacity-95 transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)]"
              >
                {/* Responsive label for Done/Mypage link */}
                <span className="hidden md:inline">나의 정보(마이페이지) 보러가기</span>
                <span className="md:hidden flex items-center gap-1">📱 마이페이지 즉시 확인</span>
                <AnimatePresence>
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    →
                  </motion.span>
                </AnimatePresence>
              </Link>
            </div>

            {/* Instruction Banner */}
            <div className="p-6 bg-slate-950 rounded-3xl border border-amber-500/10 space-y-2.5">
              <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 shrink-0" />
                <span>선택 동기화 원리</span>
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                R.ef 30주년 기념 시스템은 클라우드 데이터베이스와 연계되어 클릭하는 즉시 회원의 고유 식별 주소에 멤버 정보가 매칭되어 저장됩니다. 보관은 평생 무료로 유지되며, 언제든 다른 멤버로 자유롭게 교체하실 수 있습니다.
              </p>
            </div>
          </div>

          {/* Right Panel: Curated Selection of Fans */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Presets Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm md:text-lg font-black text-white flex items-center gap-1.5">
                    <span>🌟</span> 
                    <span className="hidden md:inline">실시간 멤버 사진 리스트 (클릭 시 사진 자동 선택 및 완료)</span>
                    <span className="md:hidden text-amber-200">멤버 클릭 즉시 선택 완료!</span>
                  </h3>
                  <p className="text-[10px] md:text-xs text-slate-400 mt-0.5 font-medium">원하는 R.ef 멤버 사진을 클릭하여 나의 정보로 즉각 저장해 보세요.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="presets-grid-wrapper">
                {PRESET_FANS.map((fan) => {
                  const isSelected = currentFanId === fan.id;
                  const isSaving = savingId === fan.id;

                  return (
                    <motion.div
                      key={fan.id}
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      onClick={() => !isSaving && handleSelectFan(fan.id, fan.name, fan.imageUrl)}
                      className={`relative aspect-[4/3] rounded-[2rem] overflow-hidden cursor-pointer group shadow-lg transition-all duration-300 ${
                        isSelected 
                          ? 'ring-4 ring-amber-500 ring-offset-4 ring-offset-slate-950 shadow-xl' 
                          : 'border border-slate-900 active:scale-[0.98]'
                      }`}
                    >
                      {/* Star image background */}
                      <img 
                        src={fan.imageUrl} 
                        alt={fan.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Gradient visual shield */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/30 to-black/10 group-hover:via-black/20 transition-all" />

                      {/* Header overlay for badge if selected */}
                      {isSelected && (
                        <div className="absolute top-4 left-4 bg-amber-600 text-black rounded-full px-3 py-1.5 text-[9px] md:text-[10px] font-black flex items-center gap-1 shadow-md">
                          <Check className="w-3 h-3" />
                          <span>선택됨</span>
                        </div>
                      )}

                      {/* Mobile Emoticon Floating Tag */}
                      <div className="absolute top-4 right-4 bg-slate-950/80 border border-slate-800 text-white text-xs px-2.5 py-1 rounded-lg font-black backdrop-blur-sm shadow-md">
                        {fan.emoticon}
                      </div>

                      {/* Hover action banner */}
                      <div className="absolute inset-0 bg-amber-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <div className="bg-slate-950/95 border border-amber-500/30 px-4 py-2.5 rounded-full text-amber-400 font-black text-xs flex items-center gap-1.5 shadow-2xl">
                          {isSaving ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>프로필 연계 보관중...</span>
                            </>
                          ) : isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>현재 나의 정보 탑재 완료 💖</span>
                            </>
                          ) : (
                            <>
                              <Heart className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
                              <span>이 멤버 선택</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Info on bottom */}
                      <div className="absolute bottom-5 left-5 right-5 space-y-1">
                        {/* On mobile, output Name with Emoticon, and hide description for a clean layout */}
                        <h4 className="text-white font-black text-sm tracking-tight truncate flex items-center gap-1.5">
                          <span>{fan.emoticon}</span>
                          <span className="hidden sm:inline">{fan.name}</span>
                          <span className="sm:hidden">{fan.name}</span>
                        </h4>
                        <p className="hidden md:block text-slate-300 text-[10px] leading-relaxed truncate font-medium">{fan.description}</p>
                      </div>

                      {/* Saving overlay spinner */}
                      {isSaving && (
                        <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center z-10">
                          <div className="text-center space-y-2">
                            <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                            <p className="text-xs font-black text-amber-300">클라우드에 멤버 탑재 중...</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Done button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => navigate('/mypage')}
                className="px-6 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-md transition-all self-end"
              >
                <span>선택 완료하고 나의 정보 돌아가기</span>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
