import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  ChevronRight, 
  UserCheck, 
  Calendar, 
  ShieldAlert, 
  Sparkles, 
  TrendingUp, 
  Award,
  Loader2,
  ArrowLeft,
  Mail,
  Smartphone,
  Heart,
  ChevronLeft,
  Settings,
  HelpCircle,
  Gem,
  Check
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useFirebase } from '../lib/FirebaseContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  tier: string;
  role: string;
  referredByEmail: string;
  ancestors: string[];
  phoneNumber?: string;
  createdAt: any;
  selectedFanName?: string;
  selectedFanPhotoUrl?: string;
}

interface TreeNode {
  email: string;
  user: UserProfile;
  children: TreeNode[];
}

export default function MyPage() {
  const { user, profile, loading } = useFirebase();
  const navigate = useNavigate();
  const [downlineUsers, setDownlineUsers] = useState<UserProfile[]>([]);
  const [fetching, setFetching] = useState(false);
  const [errorOriginal, setErrorOriginal] = useState('');

  const isSalesOrAdmin = user && (user.email === 'new2020.jeonil@gmail.com' || (profile && (profile.role === 'Sales' || profile.role === 'Admin')));

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user && isSalesOrAdmin && user.email) {
      const fetchDownline = async () => {
        try {
          setFetching(true);
          const q = query(
            collection(db, 'users'), 
            where('ancestors', 'array-contains', user.email)
          );
          const snapshot = await getDocs(q);
          const usersList: UserProfile[] = [];
          snapshot.forEach((doc) => {
            usersList.push(doc.data() as UserProfile);
          });
          setDownlineUsers(usersList);
        } catch (err: any) {
          console.error("Error fetching downline users:", err);
          setErrorOriginal('추천 회원 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
          setFetching(false);
        }
      };
      fetchDownline();
    }
  }, [user, isSalesOrAdmin]);

  // Build recommendation tree starting from current sales member
  const buildTree = (rootEmail: string, list: UserProfile[]): TreeNode[] => {
    const directRecruits = list.filter(u => u.referredByEmail === rootEmail);
    return directRecruits.map(rec => ({
      email: rec.email,
      user: rec,
      children: buildTree(rec.email, list)
    }));
  };

  const treeData = user && user.email ? buildTree(user.email, downlineUsers) : [];

  // Statistics calculation
  const totalDirectCount = downlineUsers.filter(u => u.referredByEmail === user?.email).length;
  const totalIndirectCount = downlineUsers.length - totalDirectCount;
  const legendTierCount = downlineUsers.filter(u => u.tier === 'Legend Tier').length;

  if (loading || (fetching && isSalesOrAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-blue-650 animate-spin mx-auto" />
          <p className="text-slate-400 text-xs font-semibold">나의 정보 및 비즈니스 데이터 동기화 중...</p>
        </div>
      </div>
    );
  }

  // Recursive Tree Node Renderer
  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
    const formattedDate = node.user.createdAt
      ? new Date((node.user.createdAt.seconds || 0) * 1000).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '가입일 정보 없음';

    return (
      <div key={node.email} className="relative pl-6 md:pl-10 mt-6 select-none group">
        {/* Connection Line to children (vertical line) */}
        {node.children.length > 0 && (
          <div className="absolute left-[9px] top-10 bottom-0 w-[2px] bg-gradient-to-b from-blue-300 via-blue-200 to-slate-100 rounded" />
        )}
        
        {/* Horizontal Connection line from parent */}
        <div className="absolute left-0 top-7 w-[20px] md:w-[32px] h-[2px] bg-blue-300 rounded" />
        
        {/* Node point marker */}
        <div className="absolute left-[-4px] top-[22px] w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow shadow-blue-500/50 group-hover:scale-125 transition-transform" />

        {/* Member Card */}
        <motion.div 
          whileHover={{ y: -2, scale: 1.01 }}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_24px_-10px_rgba(0,0,0,0.05)] hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
              node.user.tier === 'Legend Tier' ? 'from-amber-400 to-amber-600 shadow-amber-500/10' :
              node.user.tier === 'Gold' ? 'from-slate-300 to-slate-500 shadow-slate-500/10' :
              'from-blue-100 to-blue-200'
            } flex items-center justify-center text-white font-black text-xs shadow-md`}>
              {node.user.displayName ? node.user.displayName.substring(0, 2) : '유저'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{node.user.displayName}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                  node.user.tier === 'Legend Tier' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  node.user.tier === 'Gold' ? 'bg-slate-100 text-slate-800' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {node.user.tier}
                </span>

                {node.user.selectedFanName && (
                  <span className="text-[9px] px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full font-black flex items-center gap-0.5 border border-rose-100">
                    <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                    <span>{node.user.selectedFanName.split(' ')[1] || node.user.selectedFanName.split('(')[0]} 팬</span>
                  </span>
                )}

                {node.user.role === 'Sales' && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded font-black">
                    영업사원
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-400 text-[11px] font-semibold">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{node.user.email}</span>
                {node.user.phoneNumber && (
                  <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" />{node.user.phoneNumber}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-50 text-slate-400 text-xs font-semibold">
            <Calendar className="w-4 h-4 text-slate-300" />
            <span>가입일: {formattedDate}</span>
          </div>
        </motion.div>

        {/* Render children recursively */}
        {node.children.length > 0 && (
          <div className="space-y-2 mt-2">
            {node.children.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const selectedFanName = profile?.selectedFanName || '';
  const selectedFanPhoto = profile?.selectedFanPhotoUrl || '';

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-10 bg-[#FAFAFA] relative overflow-hidden" id="mypage-master-wrapper">
      {/* Dynamic Background decor - purely white and bright palettes to save printer ink as specified */}
      <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-100px] w-[400px] h-[400px] bg-slate-100/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/50 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Link to="/" className="p-2 bg-white rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 transition-colors shadow-sm">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100">
                <Sparkles className="w-3 h-3 text-blue-500" />
                <span>My Information Hub</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">나의 정보 & 마이페이지</h1>
            <p className="text-slate-400 text-xs font-semibold">최애 지정 상태 확인 및 맞춤형 혜택에 접속할 수 있는 종합 멤버십 센터입니다.</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-md flex items-center gap-4">
            <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <div className="text-[9px] font-black text-slate-450 uppercase tracking-widest">현재 본인 ID</div>
              <div className="font-extrabold text-slate-800 text-xs truncate max-w-[180px]">{profile?.displayName || '가입된 회원'}님</div>
              <div className="text-[10px] text-slate-400 font-medium truncate max-w-[180px]">{user?.email}</div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* NEW UNIFIED USER INFORMATION & FAN DISPLAY SECTION      */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" id="user-info-and-fan-grid">
          
          {/* Fandom Display Block (Displays who they are a fan of) */}
          <div className="lg:col-span-4 flex">
            <div className="w-full bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/70 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50/40 rounded-full blur-xl pointer-events-none" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    <span>내가 지지하는 아티스트</span>
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">Real-time Matching</span>
                </div>

                {selectedFanName ? (
                  <div className="space-y-4 text-center py-2">
                    <div className="relative w-36 h-36 mx-auto rounded-full overflow-hidden border-4 border-slate-200 shadow-md group">
                      <img 
                        src={selectedFanPhoto} 
                        alt={selectedFanName} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/10" />
                    </div>

                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 rounded-full border border-rose-100 text-[10px] font-black text-rose-600">
                        <span>COYOTE SHINJI VIP</span>
                      </div>
                      <h3 className="text-base font-black text-slate-800 leading-tight">{selectedFanName}</h3>
                      <p className="text-[10px] text-slate-400 font-semibold">탑재일자 수시 동기화 보장</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 border border-dashed border-slate-300 rounded-full flex items-center justify-center mx-auto text-slate-350">
                      <Heart className="w-8 h-8 opacity-40" />
                    </div>
                    <div className="space-y-1 px-4">
                      <p className="text-slate-700 text-xs font-black">선택 완료된 팬이 없습니다</p>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">원하는 최애 스타 멤버 사진을 선택하시면 마이페이지에 아름다운 엠블럼과 함께 즉각 탑재됩니다!</p>
                    </div>
                  </div>
                )}
              </div>

              <Link 
                to="/apply"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-center font-black text-xs rounded-xl shadow-lg transition-transform active:scale-[0.99] mt-4 block"
              >
                {selectedFanName ? '최애 팬 정보/사진 수정하기 🌟' : '지금 즉시 최애 스타 선택하러 가기 ✨'}
              </Link>
            </div>
          </div>

          {/* User Profile Info Card (Always accessible for all users) */}
          <div className="lg:col-span-8 flex">
            <div className="w-full bg-white/90 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-slate-200/70 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/40 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-800 flex items-center gap-1.5">
                    <Gem className="w-5 h-5 text-blue-500" />
                    <span>나의 마이 멤버십 기본 정보</span>
                  </h3>
                  <span className="text-[10px] bg-slate-150 text-slate-650 px-2.5 py-0.5 rounded font-black uppercase font-mono">STATUS</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">사용자 성명 / 닉네임</span>
                      <p className="text-sm font-extrabold text-slate-800 mt-0.5">{profile?.displayName || user?.email?.split('@')[0]}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">등록 승인 이메일</span>
                      <p className="text-sm font-extrabold text-slate-850 mt-0.5">{user?.email}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">권한 레벨</span>
                      <p className="text-xs font-black inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full mt-1 border border-blue-100">
                        {profile?.role === 'Sales' ? '정비공인 파트너 영업사원' : profile?.role === 'Admin' ? '통합 최고 관리자' : '팬덤 서포터 정회원'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">지정 멤버십 등급</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-xs px-3 py-1 font-black rounded-lg uppercase tracking-wider ${
                          profile?.tier === 'Legend Tier' ? 'bg-gradient-to-r from-amber-50 to-amber-100/60 text-amber-700 border border-amber-250/50' :
                          'bg-blue-50 text-blue-600 border border-blue-100'
                        }`}>
                          {profile?.tier || 'Basic Tier'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">비상 연락망 연동</span>
                      <p className="text-sm font-extrabold text-slate-800 mt-0.5">{profile?.phoneNumber || '미연치됨 (신청 시 번들 등록)'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">현재 탑재 상태</span>
                      <p className="text-xs font-black text-emerald-600 mt-0.5 flex items-center gap-1">
                        <Check className="w-4 h-4" /> 가상 응원 ID 활성화 중 (지정서 정상 발급)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                  ※ 전일미디어 특별 조항: 모든 정보는 오로라 분산 서버 데이터에 즉각 저장되어 임의로 분실하지 않습니다.
                </span>
                <button
                  onClick={() => alert(`본인 등급: ${profile?.tier || 'Basic'} / 본사 고객지원 연락처: 010-0000-0000`)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all text-right shrink-0"
                >
                  보완 문의하기
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* IF USER HAS PARTNER / SALES ACCESS                      */}
        {/* ======================================================== */}
        {isSalesOrAdmin ? (
          <div className="space-y-10 pt-4" id="sales-exclusive-workspace-wrapper">
            
            <div className="flex items-center gap-2 px-1">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-wider">영업 수석 매니저 전용 작업 영역</h2>
            </div>

            {/* Bento Grid Banners */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-[2rem] bg-gradient-to-r from-blue-650 via-indigo-650 to-slate-900 border border-blue-500/10 shadow-xl flex flex-col justify-between text-white gap-6 relative overflow-hidden"
              >
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 text-white shadow-xl shrink-0">
                    <Award className="w-6 h-6 text-amber-305 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black tracking-tight text-white">나의 지정 팬 정보/디자인 선택</h3>
                    <p className="text-[11px] text-white/75 leading-relaxed font-semibold">
                      원하는 최애 팬 사진 또는 정교한 템플릿을 연계하고 나만의 전용 멤버십을 실시간 탑재하세요.
                    </p>
                  </div>
                </div>
                <Link
                  to="/apply"
                  className="w-full text-center py-3 bg-white text-blue-600 tracking-tight font-black text-xs rounded-xl shadow-lg hover:bg-slate-50 transition-all block"
                >
                  나의 팬 선택 및 실시간 등록 🌟
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-[2rem] bg-white border border-slate-200 shadow-xl flex flex-col justify-between text-slate-800 gap-6 relative overflow-hidden"
              >
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 text-blue-600 shadow-sm shrink-0">
                    <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-blue-600 tracking-wider uppercase block font-mono">Support center</span>
                    <h3 className="text-base font-black tracking-tight text-slate-900">팬덤 오로라 영업 지원 포털</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                      2026 한정판 영업계획서, 전국 조직 위탁 전개 제안서, 마케터 대모집 포스터 및 수당 계산기 툴킷.
                    </p>
                  </div>
                </div>
                <Link
                  to="/mypage/aurora"
                  className="w-full text-center py-3 bg-gradient-to-r from-blue-600 to-indigo-650 text-white tracking-tight font-black text-xs rounded-xl shadow-lg hover:shadow-blue-600/10 transition-all block"
                >
                  오로라 영업 지원 및 계획 가이드 보기 📄
                </Link>
              </motion.div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">나의 직속 추천인 (1차)</span>
                  <div className="w-10 h-10 bg-blue-50 text-blue-650 rounded-xl flex items-center justify-center font-bold text-xs">1차</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black text-slate-900">{totalDirectCount}명</div>
                  <p className="text-[11px] text-slate-450 font-semibold">나의 영업 이메일로 직속 가입한 회원</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">연쇄 영업 추천인 (하위)</span>
                  <div className="w-10 h-10 bg-[#e0e7ff] text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xs">N차</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black text-slate-900">{totalIndirectCount}명</div>
                  <p className="text-[11px] text-slate-450 font-semibold">내 추천회원들이 추가로 유치한 회원</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">총 네트워킹 가입 수</span>
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black text-slate-900 text-emerald-600">{downlineUsers.length}명</div>
                  <p className="text-[11px] text-slate-450 font-semibold">동료 네트워크를 통한 총합 수치</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">레전드 멤버수</span>
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black text-slate-900 text-amber-500">{legendTierCount}명</div>
                  <p className="text-[11px] text-slate-450 font-semibold">우수 레전드 티어 가입자 실적</p>
                </div>
              </motion.div>
            </div>

            {/* Tree Render Panel */}
            <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-200/50 shadow-sm space-y-8">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
                <div className="w-11 h-11 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/15">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900">추천 영업 네트워크 트리</h2>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mt-0.5 font-mono">My Recruitment Downline Tree Graph</p>
                </div>
              </div>

              {treeData.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-slate-300 rounded-2xl flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-700 font-extrabold text-base">가입된 추천 회원이 없습니다</p>
                    <p className="text-slate-400 text-xs font-medium px-4 leading-relaxed">당신의 비즈니스 이메일 주소({user?.email})를 신규 회원의 가입 시 추천인란에 기입하도록 안내해 주십시오.</p>
                  </div>
                </div>
              ) : (
                <div className="relative pl-0 md:pl-2 select-none overflow-x-auto pb-6">
                  {/* Root Node Representing Myself */}
                  <div className="relative pl-4 mt-2">
                    <div className="absolute left-[9px] top-10 bottom-0 w-[2px] bg-gradient-to-b from-blue-300 via-blue-200 to-slate-100 rounded" />
                    <div className="absolute left-[-4px] top-[14px] w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow shadow-blue-600/50" />
                    
                    <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-650 text-white rounded-2xl shadow-lg border border-blue-500/10">
                      <Sparkles className="w-4 h-4 text-white animate-pulse" />
                      <span className="font-black text-xs">{profile?.displayName || '나'} (영업 수석 기획자)</span>
                    </div>

                    <div className="mt-4 space-y-4">
                      {treeData.map(node => renderTreeNode(node))}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        ) : (
          /* ======================================================== */
          /* FOR NORMAL FANDOM SUPPORTERS (NON-SALES)                 */
          /* ======================================================== */
          <div className="space-y-8 pt-4" id="standard-user-welcome-workspace">
            
            <div className="flex items-center gap-2 px-1">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <h2 className="text-base font-black text-slate-800 uppercase tracking-wider">회원님을 위한 특별 추천 혜택 코너</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              
              {/* Special Partnership Invitation Option */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-zinc-50 rounded-full blur-2xl" />
                <div className="space-y-5">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-105 shadow-sm">
                    <Award className="w-6 h-6 animate-bounce" style={{ animationDuration: '4s' }} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">오로라 특별 영업사원 신청하기</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      단순 응원을 넘어, 비즈니스 동반자로써 마일리지를 정밀 누적하고 연간 60%에 수렴하는 한정판 영업 수수료 수당 권한을 획득하고 싶으신가요?
                      지금 파트너 영업사원으로 무료 승격 신청을 접수할 수 있습니다.
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center gap-3">
                  <a 
                    href="tel:010-0000-0000"
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center rounded-xl text-xs font-black shadow-lg hover:opacity-90 active:scale-[0.99] transition-all"
                  >
                    본사에 무료 승격 문의 📞
                  </a>
                  <button 
                    onClick={() => alert('본사의 심사를 진행합니다. 영업 담당자 유선 상담(010-0000-0000) 진행 후 등급이 즉각 조정됩니다.')}
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-705 rounded-xl text-xs font-extrabold transition-all"
                  >
                    온라인 심사 접수
                  </button>
                </div>
              </div>

              {/* Supporter Digital Pass layout (Visual Premium Card) */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
                <div className="absolute top-[20%] right-[-50px] w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono tracking-widest text-blue-400 uppercase">Interactive Fan Pass</span>
                    <h3 className="text-base font-black text-white">현 세계 1호 한정판 프리패스</h3>
                  </div>
                  <div className="w-12 h-8 rounded-lg bg-gradient-to-r from-amber-300 to-yellow-500 opacity-80 shadow-md flex items-center justify-center font-mono text-[9px] text-amber-950 font-black tracking-widest">
                    VIP
                  </div>
                </div>

                {/* Simulated Chip ornamentation etc */}
                <div className="space-y-4 py-6">
                  <div className="font-mono text-base md:text-lg tracking-[0.25em] text-blue-200">
                    SJT {profile?.userId ? profile.userId.substring(0, 5).toUpperCase() : '8839'} 0029 FANDOM
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[8px] uppercase tracking-wider text-white/50 block font-mono">SUPPORTER NAME</span>
                      <span className="text-xs font-black tracking-normal uppercase text-white">{profile?.displayName || 'Supporter'}</span>
                    </div>
                    {selectedFanName && (
                      <div className="border-l border-white/20 pl-4">
                        <span className="text-[8px] uppercase tracking-wider text-white/50 block font-mono">STANDS BY</span>
                        <span className="text-xs font-black tracking-normal text-rose-300 flex items-center gap-1">
                          <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
                          <span>{selectedFanName.split(' ')[1] || selectedFanName.split('(')[0]}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-white/40 pt-4 border-t border-white/10 font-medium">
                  <span>전일미디어 FANDOM PASS</span>
                  <span className="italic">Special Platinum Tag</span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
