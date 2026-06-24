import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserCheck, 
  Sparkles, 
  TrendingUp, 
  Award,
  Loader2,
  ArrowLeft,
  Mail,
  Smartphone,
  Heart,
  Gem,
  Check,
  Save,
  ChevronRight,
  ShieldAlert,
  Trophy,
  Compass,
  Ticket,
  MessageSquare,
  Flame,
  Zap
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.tsx';

interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  tier: string;
  role: string;
  referred_by_email: string;
  ancestors: string[];
  phone_number?: string;
  created_at: any;
  selected_fan_name?: string;
  selected_fan_photo_url?: string;
  fandom_interests?: string[];
}

interface TreeNode {
  email: string;
  user: UserProfile;
  children: TreeNode[];
}

export default function MyPage() {
  const { user, profile, loading, getToken, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [downlineUsers, setDownlineUsers] = useState<UserProfile[]>([]);
  const [fetching, setFetching] = useState(false);
  const [errorOriginal, setErrorOriginal] = useState('');
  const [copied, setCopied] = useState(false);

  // User activity metrics for interactive level up
  const [certifiedTickets, setCertifiedTickets] = useState(() => {
    const saved = localStorage.getItem('demo_certified_tickets');
    if (saved) return parseInt(saved, 10);
    if (profile?.tier === 'Legend Tier') return 12;
    if (profile?.tier === 'Gold') return 6;
    return 2;
  });

  const [fandomInterests, setFandomInterests] = useState<string[]>(profile?.fandom_interests || []);
  const [isUpdatingInterests, setIsUpdatingInterests] = useState(false);

  const [activityPoints, setActivityPoints] = useState(() => {
    const saved = localStorage.getItem('demo_activity_points');
    if (saved) return parseInt(saved, 10);
    if (profile?.tier === 'Legend Tier') return 450;
    if (profile?.tier === 'Gold') return 220;
    return 80;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('demo_certified_tickets', certifiedTickets.toString());
  }, [certifiedTickets]);

  useEffect(() => {
    localStorage.setItem('demo_activity_points', activityPoints.toString());
  }, [activityPoints]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleCertifyTicket = () => {
    const nextCount = certifiedTickets + 1;
    setCertifiedTickets(nextCount);
    
    if (nextCount === 5) {
      showToast('🎉 축하합니다! 티켓 5회 인증 달성으로 [골드 등급]으로 승격되었습니다! ✨');
    } else if (nextCount === 10) {
      showToast('👑 축하합니다! 티켓 10회 인증 달성으로 최고 권위의 [플래티넘 등급]으로 승격되었습니다! 💖');
    } else {
      showToast(`🎟️ 티켓 인증이 완료되었습니다! (현재 인증 수: ${nextCount}개)`);
    }
  };

  const handleContributeActivity = () => {
    const nextPoints = activityPoints + 40;
    setActivityPoints(nextPoints);

    if (activityPoints < 200 && nextPoints >= 200) {
      showToast('🎉 축하합니다! 활동 점수 200점 달성으로 [골드 등급]으로 승격되었습니다! ✨');
    } else if (activityPoints < 400 && nextPoints >= 400) {
      showToast('👑 축하합니다! 활동 점수 400점 달성으로 최고 권위의 [플래티넘 등급]으로 승격되었습니다! 💖');
    } else {
      showToast(`💬 커뮤니티 기여 활동 완료! +40점 획득 (현재 점수: ${nextPoints}점)`);
    }
  };

  const handleResetLevel = () => {
    setCertifiedTickets(2);
    setActivityPoints(80);
    showToast('🌱 등급 가상 시뮬레이션 데이터가 초기화되었습니다.');
  };

  const getDynamicTier = () => {
    if (certifiedTickets >= 10 || activityPoints >= 400 || profile?.tier === 'Legend Tier') {
      return {
        id: 'platinum',
        name: '플래티넘 (Platinum)',
        badgeClass: 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.45)]',
        accentColor: 'text-amber-400',
        barColor: 'bg-gradient-to-r from-amber-400 to-yellow-500',
        bgGlow: 'bg-amber-500/5 border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.12)]',
        emoji: '👑',
        pointsNeeded: 0,
        nextTier: null,
        desc: '최고 등급: 모든 프리미엄 권한과 현물 혜택이 상시 개방됩니다.'
      };
    }
    if (certifiedTickets >= 5 || activityPoints >= 200 || profile?.tier === 'Gold') {
      return {
        id: 'gold',
        name: '골드 (Gold)',
        badgeClass: 'bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 text-slate-950 border-white shadow-[0_0_20px_rgba(226,232,240,0.35)]',
        accentColor: 'text-slate-300',
        barColor: 'bg-gradient-to-r from-slate-400 to-slate-200',
        bgGlow: 'bg-slate-500/5 border-slate-500/20 shadow-[0_0_30px_rgba(226,232,240,0.08)]',
        emoji: '🪙',
        pointsNeeded: 10 - certifiedTickets,
        pointsScoreNeeded: 400 - activityPoints,
        nextTier: '플래티넘',
        desc: '우수 등급: 선예매권 발급 및 비즈니스 추천 영업 권한이 활성화됩니다.'
      };
    }
    return {
      id: 'silver',
      name: '실버 (Silver)',
      badgeClass: 'bg-gradient-to-r from-blue-500/15 to-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.25)]',
      accentColor: 'text-cyan-400',
      barColor: 'bg-gradient-to-r from-blue-500 to-cyan-400',
      bgGlow: 'bg-blue-500/5 border-blue-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]',
      emoji: '🥈',
      pointsNeeded: 5 - certifiedTickets,
      pointsScoreNeeded: 200 - activityPoints,
      nextTier: '골드',
      desc: '기본 등급: 마이 멤버십 디지털 팬 패스 발급 및 기본 리베이트 혜택이 적용됩니다.'
    };
  };

  const currentTierInfo = getDynamicTier();

  const getOverallProgress = () => {
    if (currentTierInfo.id === 'platinum') return 100;
    if (currentTierInfo.id === 'gold') {
      const ticketProgress = Math.min(100, Math.max(0, ((certifiedTickets - 5) / 5) * 100));
      const pointsProgress = Math.min(100, Math.max(0, ((activityPoints - 200) / 200) * 100));
      return Math.round(Math.max(ticketProgress, pointsProgress));
    }
    const ticketProgress = Math.min(100, Math.max(0, (certifiedTickets / 5) * 100));
    const pointsProgress = Math.min(100, Math.max(0, (activityPoints / 200) * 100));
    return Math.round(Math.max(ticketProgress, pointsProgress));
  };

  const overallProgress = getOverallProgress();

  const handleCopyLink = () => {
    if (!user || !user.email) return;
    const link = `${window.location.origin}/signup?ref=${encodeURIComponent(user.email)}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.error("Clipboard copy failed, trying fallback:", err);
        fallbackCopyText(link);
      });
    } else {
      fallbackCopyText(link);
    }
  };

  const fallbackCopyText = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Fallback copy error:", err);
    }
  };

  const isSalesOrAdmin = profile && (profile.role === 'Sales' || profile.role === 'Admin');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user && isSalesOrAdmin) {
      const fetchDownline = async () => {
        try {
          setFetching(true);
          const token = await getToken();
          const response = await fetch('/api/profile/downline', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!response.ok) throw new Error('Failed to fetch downline');
          const data = await response.json();
          setDownlineUsers(data || []);
        } catch (err: any) {
          console.error("Error loading downline users:", err);
          setErrorOriginal(err.message || "추천인 목록을 불러오는 중 오류가 발생했습니다.");
        } finally {
          setFetching(false);
        }
      };
      fetchDownline();
    }
  }, [user, isSalesOrAdmin]);

  const buildTree = (rootEmail: string, list: UserProfile[]): TreeNode[] => {
    const directRecruits = list.filter(u => u.referred_by_email === rootEmail);
    return directRecruits.map(rec => ({
      email: rec.email,
      user: rec,
      children: buildTree(rec.email, list)
    }));
  };

  const treeData = user && user.email ? buildTree(user.email, downlineUsers) : [];

  const totalDirectCount = downlineUsers.filter(u => u.referred_by_email === user?.email).length;
  const totalIndirectCount = downlineUsers.length - totalDirectCount;

  const achievements = [
    {
      id: 'first_booking',
      title: '첫 티켓 인증 (First Booking)',
      description: '첫 번째 공연 티켓 인증을 완료하여 Fandom Aurora에 정식 탑승했습니다.',
      icon: Ticket,
      unlocked: certifiedTickets >= 1,
      current: certifiedTickets,
      target: 1,
      unit: '장',
      color: 'from-cyan-400 to-blue-500',
    },
    {
      id: 'frequent_cruiser',
      title: '단골 크루저 (Frequent Cruiser)',
      description: '5장 이상의 공연 티켓을 인증한 아티스트의 열성적인 여정 동반자입니다.',
      icon: Flame,
      unlocked: certifiedTickets >= 5,
      current: certifiedTickets,
      target: 5,
      unit: '장',
      color: 'from-amber-400 to-orange-500',
    },
    {
      id: 'active_supporter',
      title: '활발한 서포터 (Active Supporter)',
      description: '커뮤니티 활동 점수 200점 이상을 달성하여 팬덤 소통에 크게 기여했습니다.',
      icon: MessageSquare,
      unlocked: activityPoints >= 200,
      current: activityPoints,
      target: 200,
      unit: '점',
      color: 'from-purple-400 to-pink-500',
    },
    {
      id: 'gold_creator',
      title: '골드 크리에이터 (Gold Creator)',
      description: '골드 등급을 활성화하여 전용 비즈니스 조직 구축 권한을 획득했습니다.',
      icon: Zap,
      unlocked: certifiedTickets >= 5 || activityPoints >= 200 || profile?.tier === 'Legend Tier' || profile?.tier === 'Gold',
      current: certifiedTickets >= 5 || activityPoints >= 200 || profile?.tier === 'Legend Tier' || profile?.tier === 'Gold' ? 1 : 0,
      target: 1,
      unit: '단계',
      color: 'from-yellow-400 to-amber-600',
    },
    {
      id: 'fandom_ambassador',
      title: '추천 전도사 (Fandom Ambassador)',
      description: '나의 링크를 통해 하부 조직에 새로운 팬을 1명 이상 영입하는 데 성공했습니다.',
      icon: Compass,
      unlocked: totalDirectCount >= 1,
      current: totalDirectCount,
      target: 1,
      unit: '명',
      color: 'from-emerald-400 to-teal-500',
    },
    {
      id: 'vip_legend',
      title: '레전드 팬덤 (VIP Fan Legend)',
      description: '티켓 10장 인증 또는 전설적인 멤버십 등급에 도달한 최상위 로열 클래스입니다.',
      icon: Trophy,
      unlocked: certifiedTickets >= 10 || profile?.tier === 'Legend Tier',
      current: certifiedTickets >= 10 || profile?.tier === 'Legend Tier' ? 1 : 0,
      target: 1,
      unit: '단계',
      color: 'from-rose-400 to-red-600',
    }
  ];

  if (loading || (fetching && isSalesOrAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
          <p className="text-slate-400 text-xs font-semibold">나의 정보 및 비즈니스 데이터 동기화 중...</p>
        </div>
      </div>
    );
  }

  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
    const formattedDate = node.user.created_at ? new Date(node.user.created_at).toLocaleDateString() : '-';

    return (
      <div key={node.email} className="relative pl-6 md:pl-10 mt-6 select-none group">
        {node.children.length > 0 && (
          <div className="absolute left-[9px] top-10 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/40 via-purple-500/20 to-slate-900 rounded" />
        )}
        
        <div className="absolute left-0 top-7 w-[20px] md:w-[32px] h-[2px] bg-blue-500/35 rounded" />
        
        <div className="absolute left-[-4px] top-[22px] w-3 h-3 rounded-full bg-cyan-400 border border-slate-950 shadow-[0_0_10px_rgba(34,211,238,0.8)] group-hover:scale-125 transition-transform" />

        <motion.div 
          whileHover={{ y: -2, scale: 1.01 }}
          className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
              node.user.tier === 'Legend Tier' ? 'from-amber-400 to-amber-600 shadow-amber-500/20' :
              node.user.tier === 'Gold' ? 'from-slate-700 to-slate-900 border border-slate-700' :
              'from-blue-900 to-slate-950 border border-blue-800/40'
            } flex items-center justify-center text-white font-black text-xs shadow-md`}>
              {node.user.display_name ? node.user.display_name.substring(0, 2) : '유저'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-white text-sm">{node.user.display_name}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                  node.user.tier === 'Legend Tier' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  node.user.tier === 'Gold' ? 'bg-slate-800 text-slate-300' :
                  'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  {node.user.tier === 'Legend Tier' ? '👑 레전드' : node.user.tier === 'Gold' ? '🪙 골드' : '🌱 일반'}
                </span>

                {node.user.selected_fan_name && (
                  <span className="text-[9px] px-2 py-0.5 bg-rose-500/10 text-rose-400 rounded font-black flex items-center gap-1 border border-rose-500/20">
                    <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                    <span>{node.user.selected_fan_name.split(' ')[1] || node.user.selected_fan_name.split('(')[0]}</span>
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-400 text-[11px] font-semibold">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-500" />{node.user.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-900 text-slate-500 text-xs font-semibold shrink-0">
            <span>📆</span>
            <span className="text-[11px] text-slate-400 font-bold">
              {formattedDate}
            </span>
          </div>
        </motion.div>

        {node.children.length > 0 && (
          <div className="space-y-2 mt-2">
            {node.children.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const selectedFanName = profile?.selected_fan_name || '';
  const selectedFanPhoto = profile?.selected_fan_photo_url || '';
  const selectedFanId = profile?.selected_fan_id || '';

  const matchingEmoticon = selectedFanId === 'shinji_classic' ? '🎤🌟🧚‍♀️' :
                           selectedFanId === 'shinji_vocal' ? '👗✨🤍' :
                           selectedFanId === 'shinji_peach' ? 'Peach 🍑🌸☀️' :
                           selectedFanId === 'shinji_diva' ? '🖤👑🔥' : '💖🌟';

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-10 bg-transparent text-slate-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-100px] w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Link to="/" className="p-2.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-slate-400 hover:text-white transition-colors shadow-lg">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div className="flex items-center gap-1.5 px-3.5 py-1 bg-cyan-500/10 text-cyan-300 rounded-full text-[9px] font-black uppercase tracking-widest border border-cyan-500/20">
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>My Information Hub</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight text-white">
              나의 정보 & 마이페이지
            </h1>
            <p className="text-slate-400 text-xs md:text-sm font-bold">
              최애 지정 상태 확인 및 맞춤형 혜택에 접속할 수 있는 종합 멤버십 센터입니다.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-4.5 rounded-2xl border border-white/10 shadow-xl flex items-center gap-4 max-w-sm">
            <div className="w-11 h-11 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 border border-cyan-500/20 shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">현재 본인 ID</div>
              <div className="font-extrabold text-white text-sm truncate max-w-[180px]">{profile?.display_name || '가입된 회원'}님</div>
              <div className="text-[10px] text-slate-400 font-medium truncate max-w-[180px]">{user?.email}</div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white/10 border border-cyan-500/50 px-6 py-4 rounded-2xl shadow-[0_0_25px_rgba(34,211,238,0.35)] flex items-center gap-3 max-w-md backdrop-blur-xl"
            >
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <Sparkles className="w-4.5 h-4.5 animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <p className="text-xs md:text-sm font-extrabold text-slate-100 leading-relaxed text-left">
                {toastMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
              <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-4 flex flex-col items-center justify-center relative z-10 shadow-2xl ${currentTierInfo.badgeClass}`}>
                <span className="text-5xl md:text-6xl mb-2">{currentTierInfo.emoji}</span>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-80">Current Rank</span>
                <span className="text-sm md:text-base font-black uppercase tracking-tight">{currentTierInfo.name.split(' ')[0]}</span>
              </div>
            </div>

            <div className="flex-1 w-full space-y-6 text-center md:text-left">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">멤버십 승급 달성도</h2>
                  {currentTierInfo.nextTier && (
                    <div className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-[10px] font-black uppercase animate-pulse">
                      Next Goal: {currentTierInfo.nextTier}
                    </div>
                  )}
                </div>
                <p className="text-slate-400 text-sm font-medium">
                  {currentTierInfo.nextTier 
                    ? `서포터 활동을 통해 [${currentTierInfo.nextTier}] 등급의 프리미엄 혜택을 잠금 해제하세요.`
                    : '축하합니다! 오로라 팬덤의 최정점에 도달하셨습니다. 모든 독점 권한이 활성화되었습니다.'
                  }
                </p>
              </div>

              {currentTierInfo.nextTier ? (
                <div className="space-y-6">
                  {/* Overall Multi-stage Progress Bar */}
                  <div className="bg-slate-950/60 p-5 rounded-2xl border border-white/5 space-y-4 text-left">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                          Fandom Aurora 카드 등급 통합 달성률
                        </h3>
                        <p className="text-[10px] text-slate-400 font-medium">다음 등급 특권 해제까지 남은 종합 진행도입니다.</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-400 font-mono">
                          {overallProgress}%
                        </span>
                      </div>
                    </div>

                    <div className="relative pt-2 pb-1">
                      {/* Track line */}
                      <div className="absolute top-[18px] left-3 right-3 h-1 bg-slate-800 rounded-full" />
                      
                      {/* Active Fill line */}
                      <div 
                        className="absolute top-[18px] left-3 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `calc(${overallProgress}% - (${overallProgress} > 95 ? 0px : 12px))` }}
                      />

                      {/* Milestones */}
                      <div className="relative flex justify-between px-1">
                        {/* Silver Milestone */}
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center text-[10px] shadow-[0_0_10px_rgba(34,211,238,0.5)] z-10">
                            🥈
                          </div>
                          <span className="text-[9px] font-black mt-1 text-cyan-400">실버</span>
                          <span className="text-[7px] text-slate-500 font-bold">기본 개방</span>
                        </div>

                        {/* Gold Milestone */}
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full bg-slate-950 border-2 flex items-center justify-center text-[10px] z-10 transition-all duration-500 ${
                            certifiedTickets >= 5 || activityPoints >= 200 || profile?.tier === 'Legend Tier' || profile?.tier === 'Gold'
                              ? 'border-slate-300 shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                              : 'border-slate-800 text-slate-600'
                          }`}>
                            🪙
                          </div>
                          <span className={`text-[9px] font-black mt-1 ${
                            certifiedTickets >= 5 || activityPoints >= 200 || profile?.tier === 'Legend Tier' || profile?.tier === 'Gold'
                              ? 'text-slate-200'
                              : 'text-slate-500'
                          }`}>골드</span>
                          <span className="text-[7px] text-slate-500 font-bold">티켓5 / 200점</span>
                        </div>

                        {/* Platinum Milestone */}
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full bg-slate-950 border-2 flex items-center justify-center text-[10px] z-10 transition-all duration-500 ${
                            certifiedTickets >= 10 || activityPoints >= 400 || profile?.tier === 'Legend Tier'
                              ? 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                              : 'border-slate-800 text-slate-600'
                          }`}>
                            👑
                          </div>
                          <span className={`text-[9px] font-black mt-1 ${
                            certifiedTickets >= 10 || activityPoints >= 400 || profile?.tier === 'Legend Tier'
                              ? 'text-amber-400'
                              : 'text-slate-500'
                          }`}>플래티넘</span>
                          <span className="text-[7px] text-slate-500 font-bold">티켓10 / 400점</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                            <Award className="w-4.5 h-4.5" />
                          </div>
                          <span className="text-xs font-black text-slate-300">티켓 인증 현황</span>
                        </div>
                        <span className="text-xs font-black text-cyan-400">
                          {certifiedTickets} / {currentTierInfo.id === 'silver' ? 5 : 10}
                        </span>
                      </div>
                      <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden border border-white/5 p-0.5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (certifiedTickets / (currentTierInfo.id === 'silver' ? 5 : 10)) * 100)}%` }}
                          className={`h-full rounded-full ${currentTierInfo.barColor} shadow-[0_0_15px_rgba(34,211,238,0.4)]`}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <TrendingUp className="w-4.5 h-4.5" />
                          </div>
                          <span className="text-xs font-black text-slate-300">커뮤니티 활동 점수</span>
                        </div>
                        <span className="text-xs font-black text-blue-400">
                          {activityPoints} / {currentTierInfo.id === 'silver' ? 200 : 400}
                        </span>
                      </div>
                      <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden border border-white/5 p-0.5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (activityPoints / (currentTierInfo.id === 'silver' ? 200 : 400)) * 100)}%` }}
                          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/20 flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-black text-amber-400">Legendary Fan Status Active</div>
                    <div className="text-xs text-slate-400 font-medium">최고 권위의 멤버십 혜택이 상시 개방되어 있습니다.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-cyan-500/20 p-6 md:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/10">
                <Gem className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                  오로라 팬덤 멤버십 등급 & 혜택 센터
                </h2>
                <p className="text-[11px] text-slate-400 font-bold mt-0.5">활동 수준 및 공연 티켓 인증 횟수에 따라 등급과 혜택이 실시간으로 활성화됩니다.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleResetLevel}
                className="px-3.5 py-1.5 bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 text-[10px] text-slate-400 hover:text-white rounded-lg font-bold transition-all flex items-center gap-1.5"
              >
                🔄 가상데이터 초기화
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            <div className="lg:col-span-5 bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-6 relative overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-5">
                <div className="text-[9px] font-black tracking-widest text-slate-500 uppercase font-mono">My Active Member Badge</div>
                
                <div className="flex items-center gap-4.5 bg-white/5 p-5 rounded-2xl border border-white/10 shadow-inner">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shrink-0 border-2 ${currentTierInfo.badgeClass}`}>
                    {currentTierInfo.emoji}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-black uppercase">현재 멤버십 등급</span>
                    <h3 className={`text-xl font-black tracking-tight ${currentTierInfo.accentColor}`}>{currentTierInfo.name}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold">{currentTierInfo.desc}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 text-center">
                    <div className="text-[9px] text-slate-500 font-black">🎟️ 인증된 공연 티켓</div>
                    <div className="text-xl font-black text-cyan-400 mt-1">{certifiedTickets} <span className="text-xs text-slate-400 font-bold">장</span></div>
                  </div>
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 text-center">
                    <div className="text-[9px] text-slate-500 font-black">💬 커뮤니티 활동 점수</div>
                    <div className="text-xl font-black text-purple-400 mt-1">{activityPoints} <span className="text-xs text-slate-400 font-bold">점</span></div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex justify-between items-center text-[11px] font-bold">
                    <span className="text-slate-400">다음 등급 달성도</span>
                    {currentTierInfo.nextTier ? (
                      <span className="text-cyan-400">
                        [{currentTierInfo.nextTier}] 달성 도전 중
                      </span>
                    ) : (
                      <span className="text-amber-400 font-black flex items-center gap-1">👑 최고 레벨 도달 완료!</span>
                    )}
                  </div>

                <div className="relative w-full h-3 bg-black/20 rounded-full overflow-hidden border border-white/10">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ease-out ${currentTierInfo.barColor}`}
                      style={{ 
                        width: !currentTierInfo.nextTier 
                          ? '100%' 
                          : `${Math.min(100, (currentTierInfo.id === 'silver' 
                               ? (certifiedTickets / 5) * 100 
                               : ((certifiedTickets - 5) / 5) * 100))}%` 
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-900 space-y-2.5">
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-left">Fandom Activity Simulator</div>
                <div className="flex gap-2.5">
                  <button
                    onClick={handleCertifyTicket}
                    className="flex-1 py-3 bg-cyan-500/10 hover:bg-cyan-500/15 border border-cyan-500/20 hover:border-cyan-500/45 text-cyan-300 rounded-xl text-[11px] font-black shadow-sm transition-all active:scale-[0.98]"
                  >
                    티켓 추가 인증 🎟️
                  </button>
                  <button
                    onClick={handleContributeActivity}
                    className="flex-1 py-3 bg-purple-500/10 hover:bg-purple-500/15 border border-purple-500/20 hover:border-purple-500/45 text-purple-300 rounded-xl text-[11px] font-black shadow-sm transition-all active:scale-[0.98]"
                  >
                    활동 기여하기 💬
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div className="text-[9px] font-black tracking-widest text-slate-500 uppercase font-mono">Fandom Tier Benefits Roadmap</div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full items-stretch">
                <div className={`rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 ${
                  currentTierInfo.id === 'silver' 
                    ? 'bg-[#060e22] border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] scale-[1.01]' 
                    : 'bg-slate-950/40 border-slate-900 opacity-65 hover:opacity-100'
                }`}>
                  <div className="space-y-4">
                    <span className="text-[10px] font-black px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded">🥈 실버 등급</span>
                    <ul className="space-y-1.5 text-[11px] font-bold text-slate-300">
                      <li className="flex items-start gap-1">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>기본 커뮤니티 입장</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>디지털 팬 패스 발급</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className={`rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 ${
                  currentTierInfo.id === 'gold' 
                    ? 'bg-[#151c2e] border-slate-300 shadow-[0_0_20px_rgba(255,255,255,0.15)] scale-[1.01]' 
                    : 'bg-slate-950/40 border-slate-900 opacity-65 hover:opacity-100'
                }`}>
                  <div className="space-y-4">
                    <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 text-slate-950 rounded">🪙 골드 등급</span>
                    <ul className="space-y-1.5 text-[11px] font-bold text-slate-200">
                      <li className="flex items-start gap-1">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>단독 콘서트 선예매권</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>영업 하위 링크 활성화</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className={`rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 ${
                  currentTierInfo.id === 'platinum' 
                    ? 'bg-[#1e170a] border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.2)] scale-[1.01]' 
                    : 'bg-slate-950/40 border-slate-900 opacity-65 hover:opacity-100'
                }`}>
                  <div className="space-y-4">
                    <span className="text-[10px] font-black px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-black rounded font-black">👑 플래티넘</span>
                    <ul className="space-y-1.5 text-[11px] font-bold text-amber-100">
                      <li className="flex items-start gap-1">
                        <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>전국 투어 VIP 프리패스</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>실물 순금 기념 주화</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements & Milestones Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-6 md:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] space-y-6 text-left"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/10">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                  나의 업적 & 명예 뱃지 (My Achievements)
                </h2>
                <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                  티켓 인증, 소통 참여 및 추천인 가입 실적을 바탕으로 영구적인 디지털 업적을 달성하세요.
                </p>
              </div>
            </div>
            
            <div className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-black flex items-center gap-2 self-start md:self-center shrink-0">
              <span>🏆 달성 업적:</span>
              <span className="font-mono">{achievements.filter(a => a.unlocked).length} / {achievements.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((ach) => {
              const IconComp = ach.icon;
              return (
                <motion.div
                  key={ach.id}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className={`relative rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                    ach.unlocked
                      ? 'bg-gradient-to-b from-slate-950 to-[#0e172a]/90 border-slate-700/50 shadow-[0_4px_20px_rgba(251,191,36,0.05)]'
                      : 'bg-slate-950/40 border-slate-900/60 opacity-60'
                  }`}
                >
                  {ach.unlocked && (
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                  )}

                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        ach.unlocked
                          ? `bg-gradient-to-br ${ach.color} text-slate-950 font-black shadow-lg shadow-amber-500/10`
                          : 'bg-slate-900 text-slate-600 border border-slate-800'
                      }`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full tracking-wide uppercase border ${
                        ach.unlocked
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}>
                        {ach.unlocked ? '🔓 UNLOCKED' : '🔒 LOCKED'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className={`text-sm font-black tracking-tight ${ach.unlocked ? 'text-white' : 'text-slate-400'}`}>
                        {ach.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                        {ach.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-900/60 space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-500">달성 진행도</span>
                      <span className={ach.unlocked ? 'text-amber-400' : 'text-slate-400'}>
                        {Math.min(ach.target, ach.current)} / {ach.target} {ach.unit}
                      </span>
                    </div>
                    
                    <div className="relative w-full h-1.5 bg-black/45 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (ach.current / ach.target) * 100)}%` }}
                        className={`h-full rounded-full ${
                          ach.unlocked 
                            ? `bg-gradient-to-r ${ach.color}` 
                            : 'bg-slate-800'
                        }`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-4 flex">
            <div className="w-full bg-slate-950/80 backdrop-blur-md rounded-3xl p-6 border border-blue-500/20 shadow-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="space-y-5">
                <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                  <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
                    <span>내가 지지하는 아티스트</span>
                  </span>
                </div>

                {selectedFanName ? (
                  <div className="space-y-4 text-center py-2">
                    <div className="relative w-36 h-36 mx-auto rounded-full overflow-hidden border-4 border-slate-800 shadow-xl group">
                      <img 
                        src={selectedFanPhoto} 
                        alt={selectedFanName} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80";
                        }}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                    </div>

                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded text-[10px] font-black text-rose-400">
                        <span>COYOTE SHINJI {matchingEmoticon}</span>
                      </div>
                      <h3 className="text-base font-black text-white leading-tight">{selectedFanName}</h3>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-900 border border-dashed border-slate-850 rounded-full flex items-center justify-center mx-auto text-slate-600">
                      <Heart className="w-8 h-8 opacity-20" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-white text-xs font-black">선택된 최애 스타가 없습니다</p>
                      <p className="text-slate-500 text-[10px] px-6 leading-relaxed font-semibold">팬 선택 메뉴에서 나의 정보를 빛내줄 스타를 선택해 보세요.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6">
                <Link 
                  to="/apply"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-[11px] font-black hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  {selectedFanName ? '최애 스타 변경하기' : '나의 팬(스타) 선택하러 가기'}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="bg-slate-950/80 backdrop-blur-md rounded-3xl p-8 border border-slate-900 shadow-2xl space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-900 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">나의 추천 비즈니스 하부 조직</h2>
                    <p className="text-xs text-slate-500 font-bold">회원님의 추천을 통해 가입된 팬덤 조직도입니다.</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">My Referral Link</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-mono text-blue-400 bg-blue-500/5 px-3 py-1.5 rounded-lg border border-blue-500/10">
                        {user?.email ? `ref=${user.email.substring(0, 8)}...` : '로그인 필요'}
                      </span>
                      <button 
                        onClick={handleCopyLink}
                        className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"
                        title="추천 링크 복사"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {isSalesOrAdmin ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center space-y-1">
                      <div className="text-[9px] font-black text-slate-500 uppercase">직추천 인원</div>
                      <div className="text-xl font-black text-white">{totalDirectCount}명</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center space-y-1">
                      <div className="text-[9px] font-black text-slate-500 uppercase">전체 하부 인원</div>
                      <div className="text-xl font-black text-blue-400">{downlineUsers.length}명</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center space-y-1">
                      <div className="text-[9px] font-black text-slate-500 uppercase">간접 추천</div>
                      <div className="text-xl font-black text-indigo-400">{totalIndirectCount}명</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center space-y-1 text-emerald-400 border-emerald-500/20 bg-emerald-500/5">
                      <div className="text-[9px] font-black uppercase">활성 리베이트</div>
                      <div className="text-xl font-black">2.4%</div>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 min-h-[300px]">
                    {downlineUsers.length > 0 ? (
                      <div className="overflow-x-auto pb-4">
                        <div className="min-w-[500px]">
                          {treeData.map(node => renderTreeNode(node))}
                        </div>
                      </div>
                    ) : (
                      <div className="py-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto text-slate-700">
                          <Users className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-slate-500 text-xs font-bold px-10">
                          아직 하부 추천 조직이 구성되지 않았습니다.<br />
                          회원님의 추천 코드를 공유하여 함께 팬덤을 키워보세요!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center space-y-6 bg-white/5 rounded-3xl border border-dashed border-white/20">
                  <div className="w-20 h-20 bg-indigo-500/5 rounded-full flex items-center justify-center mx-auto text-indigo-400 border border-indigo-500/10">
                    <ShieldAlert className="w-10 h-10 opacity-40" />
                  </div>
                  <div className="space-y-2 max-w-sm mx-auto">
                    <h3 className="text-white font-black text-lg">비즈니스 권한 제한</h3>
                    <p className="text-slate-500 text-xs leading-relaxed font-bold">
                      추천 하부 조직도 조회 및 리베이트 관리는 <span className="text-indigo-400">골드(크리에이터)</span> 이상의 등급부터 활성화됩니다. 티켓 인증을 완료하여 등급을 승급해 보세요.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
