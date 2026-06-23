import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { useFirebase } from '../lib/FirebaseContext';
import { db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
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
    id: 'shinji_classic',
    name: '코요태 신지 (무대 엔딩 요정 에디션)',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    description: '빛나는 페스티벌 무대 위 독보적 보컬 매력의 콘서트 씬.'
  },
  {
    id: 'shinji_vocal',
    name: '코요태 신지 (청초한 화이트 보컬)',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    description: '차분하면서도 우아한 감성 프로필 레전드 스냅.'
  },
  {
    id: 'shinji_peach',
    name: '코요태 신지 (러블리 피치 슈트)',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    description: '봄 햇살처럼 밝고 청량함을 머금은 시그니처 화보.'
  },
  {
    id: 'shinji_diva',
    name: '코요태 신지 (카리스마 블랙 디바 에디션)',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
    description: '무대를 압도하는 디바의 모던 블랙 테일러링 포토.'
  }
];

export default function Apply() {
  const { user, profile, loading: authLoading } = useFirebase();
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
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        selectedFanId: fanId,
        selectedFanName: name,
        selectedFanPhotoUrl: imageUrl,
        selectedFanUpdatedAt: serverTimestamp()
      }, { merge: true });

      // Simulate subtle feedback duration
      await new Promise(resolve => setTimeout(resolve, 800));
    } catch (err: any) {
      console.warn("Error updating selected fan: ", err);
      // Fallback
      const demoAuthRaw = localStorage.getItem('demo_user_auth');
      if (demoAuthRaw) {
        try {
          const parsed = JSON.parse(demoAuthRaw);
          parsed.profile = {
            ...parsed.profile,
            selectedFanId: fanId,
            selectedFanName: name,
            selectedFanPhotoUrl: imageUrl,
            selectedFanUpdatedAt: new Date()
          };
          localStorage.setItem('demo_user_auth', JSON.stringify(parsed));
          await new Promise(resolve => setTimeout(resolve, 850));
          alert('최애 팬 선택이 임시 로컬 저장소에 반영되었습니다. 마이페이지에서 즉시 확인 가능합니다!');
          window.location.reload();
          return;
        } catch (e) {
          console.error(e);
        }
      }
      setErrorMessage('최애 팬 선택 저장에 실패했습니다: ' + err.message);
    } finally {
      setSavingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-blue-650 animate-spin mx-auto" />
          <p className="text-slate-400 text-xs font-semibold">팬 선택 및 로그인 데이터 수신 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-5 flex items-center justify-center bg-[#FAFAFA] relative overflow-hidden" id="login-required-container">
        <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-blue-100 rounded-full blur-[120px] opacity-30 pointer-events-none" />
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto text-blue-600">
            <Heart className="w-8 h-8 text-blue-500 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">나의 팬 선택 서비스</h1>
            <p className="text-xs text-slate-500 leading-relaxed px-4">
              본 서비스는 전일미디어 특별 팬 마일리지를 누적할 수 있는 최애 아티스트 선택 공간입니다.<br />
              로그인 후 어떠한 복잡한 가입 절차 없이 클릭 한 번으로 최애를 선택해 보세요.
            </p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-xs font-black hover:opacity-90 active:scale-[0.99] transition-all shadow-md shadow-blue-500/10"
          >
            로그인 하러 가기
          </button>
          <div className="text-center pt-2">
            <Link to="/" className="text-xs text-slate-400 underline font-medium hover:text-slate-600">메인 화면으로</Link>
          </div>
        </div>
      </div>
    );
  }

  const currentFanName = profile?.selectedFanName || '';
  const currentFanPhoto = profile?.selectedFanPhotoUrl || '';
  const currentFanId = profile?.selectedFanId || '';

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-[#FAFAFA] relative overflow-hidden" id="apply-page-content-wrapper">
      {/* Background blobs to keep theme pure, light background to save printer ink as required */}
      <div className="absolute top-[10%] left-[25%] w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[10%] w-[350px] h-[350px] bg-indigo-50/30 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-6xl mx-auto z-10 relative">
        {/* Title */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-blue-600 text-[9px] font-black uppercase tracking-wider">My Active Fan Selection</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            나의 팬 선택 🌟
          </h1>
          <p className="text-slate-500 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            원하는 최애 아티스트의 한정판 스타 사진을 마우스 클릭 단 한 번만으로 선택해 보세요!<br />
            선택하시는 순간, 마이페이지 나의 정보란에 실시간으로 반영되어 고유 엠블럼과 뱃지가 활성화됩니다.
          </p>
        </div>

        {errorMessage && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 text-red-700 text-xs font-bold rounded-2xl flex items-center gap-2 border border-red-100 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Realtime Choice Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-xl space-y-5">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">실시간 탑재 상태</span>
              
              {currentFanName ? (
                <div className="space-y-4">
                  {/* Selected Fan Preview Photo Display with premium Glassmorphism borders */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md border border-slate-100 group">
                    <img 
                      src={currentFanPhoto} 
                      alt={currentFanName} 
                      onError={(e) => {
                        // Fallback if image fails
                        e.currentTarget.src = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80";
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-full p-2.5 shadow-md">
                      <Heart className="w-4 h-4 fill-white" />
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[9px] bg-blue-600/90 text-white font-bold uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mb-1.5 backdrop-blur-sm shadow-sm">
                        CURRENT STAR
                      </span>
                      <h3 className="text-white text-base font-black truncate">{currentFanName}</h3>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <div className="py-2.5 px-3.5 bg-blue-50/50 rounded-xl border border-blue-100/50 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-bold">탑재된 아티스트명</span>
                      <span className="text-xs font-extrabold text-blue-600">{currentFanName}</span>
                    </div>
                    <div className="py-2.5 px-3.5 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">기본 연동 상태</span>
                      <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> 실시간 마이피포 동기화 완료
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center space-y-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto text-blue-400">
                    <Heart className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-700 text-xs font-black">아직 선택된 최애가 없습니다</p>
                    <p className="text-slate-400 text-[10px] leading-relaxed">우측 스타 리스트에서 원하는 사진을 클릭하시면 즉시 마이페이지 나의 정보에 표시됩니다.</p>
                  </div>
                </div>
              )}

              <Link 
                to="/mypage"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs rounded-2xl hover:opacity-95 transition-all shadow-md shadow-blue-500/10"
              >
                <span>나의 정보(마이페이지) 보러가기</span>
                <AnimatePresence>
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    →
                  </motion.span>
                </AnimatePresence>
              </Link>
            </div>

            {/* Instruction Banner */}
            <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50 space-y-2.5">
              <h3 className="text-xs font-black text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 shrink-0 text-blue-600" />
                <span>선택 동기화 원리</span>
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                클라우드 파이어스토어 데이터베이스와 연계된 특화 구조로, 클릭하는 즉시 회원의 고유 식별 주소에 스타 정보가 매칭되어 저장됩니다. 보관은 평생 무료로 유지되며, 언제든 다른 스타로 자유롭게 교체하실 수 있습니다.
              </p>
            </div>
          </div>

          {/* Right Panel: Curated Selection of Fans */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Presets Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-800">🌟 실시간 스타 사진 리스트 (클릭 시 사진 자동 선택 및 완료)</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">원하는 스타 에디션 사진을 클릭하여 나의 정보로 즉각 저장해 보세요.</p>
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
                          ? 'ring-4 ring-blue-600 ring-offset-4 shadow-xl' 
                          : 'border border-slate-200/50 active:scale-[0.98]'
                      }`}
                    >
                      {/* Star image background */}
                      <img 
                        src={fan.imageUrl} 
                        alt={fan.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      
                      {/* Gradient visual shield */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:via-black/20 transition-all" />

                      {/* Header overlay for badge if selected */}
                      {isSelected && (
                        <div className="absolute top-4 left-4 bg-blue-600 text-white rounded-full px-3 py-1.5 text-[10px] font-black flex items-center gap-1 shadow-md">
                          <Check className="w-3 h-3" />
                          <span>선택됨</span>
                        </div>
                      )}

                      {/* Hover action banner */}
                      <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <div className="bg-white/95 px-4 py-2.5 rounded-full text-blue-600 font-black text-xs flex items-center gap-1.5 shadow-xl">
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
                              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                              <span>이 스타 사진 클릭 선택</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Info on bottom */}
                      <div className="absolute bottom-5 left-5 right-5 space-y-1">
                        <h4 className="text-white font-black text-sm tracking-tight truncate">{fan.name}</h4>
                        <p className="text-white/80 text-[10px] leading-relaxed truncate font-medium">{fan.description}</p>
                      </div>

                      {/* Saving overlay spinner */}
                      {isSaving && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                          <div className="text-center space-y-2">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                            <p className="text-xs font-black text-blue-900">클라우드에 최애 탑재 중...</p>
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
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-md transition-all self-end"
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
