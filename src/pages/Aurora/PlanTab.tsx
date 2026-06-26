import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Gift, 
  Star, 
  Award, 
  MapPin, 
  Compass, 
  ShieldCheck, 
  Heart, 
  Users, 
  Building, 
  Coins, 
  Percent, 
  Handshake, 
  UserCheck, 
  MessageSquare, 
  Flame, 
  Zap, 
  ArrowUpRight,
  ShieldAlert,
  HelpCircle,
  TrendingUp,
  Award as AwardIcon
} from 'lucide-react';

export default function PlanTab() {
  return (
    <div className="space-y-12 text-slate-200">
      
      {/* 2026 Fandom Aurora Partner Reward Plan - Header Section */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-950 border border-amber-500/20 shadow-[0_0_50px_rgba(251,191,36,0.08)] p-8 md:p-12 text-center space-y-6">
        {/* Subtle Cosmic Background effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-40 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-10 left-10 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />

        <div className="space-y-2">
          {/* Top tagline */}
          <div className="flex items-center justify-center gap-1 text-xs md:text-sm font-black text-amber-400 tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>팬과 함께 성장하고, 보상은 더 크게!</span>
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>

          {/* Logo & Platform Name */}
          <div className="flex flex-col items-center gap-0.5 pt-2">
            <div className="flex items-center gap-2">
              <Star className="w-7 h-7 text-amber-400 fill-amber-400" />
              <span className="text-xl md:text-2xl font-black text-white tracking-widest font-mono">FANDOM AURORA</span>
            </div>
            <span className="text-xs font-black text-slate-400 tracking-widest uppercase">팬덤 오로라</span>
          </div>
        </div>

        {/* Big Golden Main Title */}
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-100 drop-shadow-[0_2px_10px_rgba(251,191,36,0.3)] leading-tight">
            2026 팬덤 오로라 파트너 보상플랜
          </h1>
          
          {/* Purple Sub-banner */}
          <div className="inline-block bg-gradient-to-r from-purple-900/80 via-indigo-950 to-purple-900/80 border border-purple-500/30 px-6 py-2.5 rounded-full shadow-[0_4px_20px_rgba(139,92,246,0.15)]">
            <span className="text-xs md:text-sm font-black text-amber-300 tracking-wide">
              ✦ 팬을 연결하고, 추억을 만들고, 수익을 공유하는 최고의 기회! ✦
            </span>
          </div>
        </div>
      </div>

      {/* Three Columns of Partnership Tiers (left to right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Column 1: 팬덤 크리에이터 (전문 마케터) */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.3 }}
          className="rounded-[2.2rem] bg-slate-950 border border-blue-500/30 shadow-[0_4px_30px_rgba(59,130,246,0.05)] flex flex-col justify-between overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-950 to-slate-900 border-b border-blue-500/20 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex flex-col items-center justify-center text-slate-950 font-black shadow-lg shadow-blue-500/20 shrink-0">
              <UserCheck className="w-6 h-6 text-slate-950" />
              <span className="text-[9px] -mt-1">01</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">팬덤 크리에이터 <span className="text-xs font-bold text-blue-400">(전문 마케터)</span></h3>
              <p className="text-[10.5px] font-bold text-slate-400 mt-0.5">팬과 연결하고, 수익을 만드는 첫걸음!</p>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 md:p-8 space-y-6 flex-grow">
            {/* Left Parameters List */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-blue-500/5">
                <div className="text-blue-400 font-extrabold text-xs mt-0.5 shrink-0">📌 가입 조건</div>
                <div className="text-xs text-slate-300 font-bold">멤버십 6개 선구매 <span className="text-blue-400 font-black">(330만원)</span></div>
              </div>
              <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-blue-500/5">
                <div className="text-blue-400 font-extrabold text-xs mt-0.5 shrink-0">🤝 활동 지원</div>
                <div className="text-xs text-slate-300 font-bold">월 150만원 × 3개월 <span className="text-blue-400 font-black">(총 450만원)</span></div>
              </div>
              <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-blue-500/5">
                <div className="text-blue-400 font-extrabold text-xs mt-0.5 shrink-0">⚡ 주요 활동</div>
                <div className="text-xs text-slate-300 font-semibold leading-relaxed">회원 모집, SNS 홍보, 커뮤니티 운영, 행사 홍보, 룬맨츠 공유</div>
              </div>
              <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-blue-500/5">
                <div className="text-blue-400 font-extrabold text-xs mt-0.5 shrink-0">📦 상품 반환</div>
                <div className="text-xs text-slate-300 font-bold">미판매 상품 <span className="text-red-400 font-black">90% 환급</span> (퇴사 시)</div>
              </div>
            </div>

            {/* Right Reward Box (Integrated inside the card body) */}
            <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-b from-blue-950/40 to-slate-950 p-4 text-center space-y-1">
              <span className="text-[10px] font-black tracking-wider text-blue-400 uppercase bg-blue-500/10 px-2.5 py-0.5 rounded-full">팬덤 리워드</span>
              <div className="text-xs text-slate-300 font-extrabold pt-1">회원 1명 가입 시 상품 판매가의</div>
              <div className="text-3xl font-black text-amber-400 font-mono tracking-tight my-1">20%</div>
              <div className="text-[10px] text-slate-400 font-bold border-t border-slate-900 pt-1.5 mt-1">지급 기간: 3개월 누적 지급</div>
            </div>

            {/* Bottom Special Block 1: 크리에이터 스타트 지원금 */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-blue-950/30 rounded-2xl border border-blue-500/10 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400">
                  <Coins className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-xs font-black text-white">크리에이터 스타트 지원금</span>
              </div>
              <div className="flex justify-between items-baseline">
                <div className="text-sm font-black text-blue-400">월 150만원 <span className="text-[10px] text-slate-400 font-bold">(3개월 총 450만원 지원)</span></div>
                <span className="text-[9px] font-black bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">1회성 보너스</span>
              </div>
            </div>

            {/* Bottom Special Block 2: 파트너 추천 보상 */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-purple-950/20 rounded-2xl border border-purple-500/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded bg-purple-500/10">추천 보상</span>
                  <span className="text-xs font-black text-white">파트너 추천 보너스</span>
                </div>
                <span className="text-[9px] font-black bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">1회성 보너스</span>
              </div>
              <div className="text-xs text-slate-400 font-bold">
                신규 지역 파트너 추천 시 <strong className="text-amber-400 text-sm font-black">250만원</strong> 지급
              </div>
            </div>
          </div>
        </motion.div>

        {/* Column 2: 지역 파트너 라운지 (대리점) */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.3 }}
          className="rounded-[2.2rem] bg-slate-950 border border-emerald-500/30 shadow-[0_4px_30px_rgba(16,185,129,0.05)] flex flex-col justify-between overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-950 to-slate-900 border-b border-emerald-500/20 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex flex-col items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 shrink-0">
              <Building className="w-6 h-6 text-slate-950" />
              <span className="text-[9px] -mt-1">02</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">지역 파트너 라운지 <span className="text-xs font-bold text-emerald-400">(대리점)</span></h3>
              <p className="text-[10.5px] font-bold text-slate-400 mt-0.5">지역에서 팬덤 비즈니스를 이끄는 핵심 파트너!</p>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 md:p-8 space-y-6 flex-grow">
            {/* Left Parameters List */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-emerald-500/5">
                <div className="text-emerald-400 font-extrabold text-xs mt-0.5 shrink-0">📌 가입 조건</div>
                <div className="text-xs text-slate-300 font-bold">지역 파트너 라이선스 <span className="text-emerald-400 font-black">1,000만원</span> (상품 18개 제공)</div>
              </div>
              <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-emerald-500/5">
                <div className="text-emerald-400 font-extrabold text-xs mt-0.5 shrink-0">⚡ 주요 역할</div>
                <div className="text-xs text-slate-300 font-semibold leading-relaxed">지역 회원 관리, 팬덤 행사 지원, 팬 커뮤니티 운영, 팬 크리에이터 육성</div>
              </div>
              <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-emerald-500/5">
                <div className="text-emerald-400 font-extrabold text-xs mt-0.5 shrink-0">🎁 지원 혜택</div>
                <div className="text-xs text-slate-300 font-bold">파트너 라운지 운영 보조금 <span className="text-emerald-400 font-black">매월 250만원</span> 지급</div>
              </div>
            </div>

            {/* Right Reward Box (Integrated inside the card body) */}
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-950/40 to-slate-950 p-4 text-center space-y-1">
              <span className="text-[10px] font-black tracking-wider text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-0.5 rounded-full">지역 운영 리워드</span>
              <div className="text-xs text-slate-300 font-extrabold pt-1">총 매출의</div>
              <div className="text-3xl font-black text-amber-400 font-mono tracking-tight my-1">10%</div>
              <div className="text-[10px] text-slate-400 font-bold border-t border-slate-900 pt-1.5 mt-1">지급 기간: 3개월 누적 지급</div>
            </div>

            {/* Bottom Special Block 1: 파트너 확장 보너스 */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-emerald-950/30 rounded-2xl border border-emerald-500/10 space-y-2">
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-400/10 flex items-center justify-center text-emerald-400">
                    <Handshake className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-xs font-black text-white">파트너 확장 보너스</span>
                </div>
                <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">1회성 보너스</span>
              </div>
              <div className="text-xs text-slate-400 font-bold">
                신규 지역 파트너 추천 시 <strong className="text-amber-400 text-sm font-black">350만원</strong> 지원
              </div>
            </div>

            {/* Bottom Special Block 2: 추천 파트너 매출 감사 보너스 */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-amber-950/20 rounded-2xl border border-amber-500/10 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400">
                  <Coins className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-xs font-black text-white">추천 파트너 매출 감사 보너스</span>
              </div>
              <div className="text-xs text-slate-400 font-bold">
                추천한 파트너의 매출 중 <strong className="text-amber-400 text-sm font-black">1%</strong> <span className="text-emerald-400 font-bold">지속 지급</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Column 3: 광역 파트너센터 (지사) */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.3 }}
          className="rounded-[2.2rem] bg-slate-950 border border-purple-500/30 shadow-[0_4px_30px_rgba(139,92,246,0.05)] flex flex-col justify-between overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-950 to-slate-900 border-b border-purple-500/20 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex flex-col items-center justify-center text-slate-950 font-black shadow-lg shadow-purple-500/20 shrink-0">
              <Building className="w-6 h-6 text-slate-950" />
              <span className="text-[9px] -mt-1">03</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">광역 파트너센터 <span className="text-xs font-bold text-purple-400">(지사)</span></h3>
              <p className="text-[10.5px] font-bold text-slate-400 mt-0.5">더 큰 규모로 네트워크를 확장하는 리더!</p>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 md:p-8 space-y-6 flex-grow">
            {/* Left Parameters List */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-purple-500/5">
                <div className="text-purple-400 font-extrabold text-xs mt-0.5 shrink-0">📌 가입 조건</div>
                <div className="text-xs text-slate-300 font-bold leading-relaxed">사무실 50평 이상 운영 가능자, 광역 본부장 허가 득한 자</div>
              </div>
              <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-purple-500/5">
                <div className="text-purple-400 font-extrabold text-xs mt-0.5 shrink-0">⚡ 주요 역할</div>
                <div className="text-xs text-slate-300 font-semibold leading-relaxed">지역 파트너 관리, 교육, 행사 운영 지원, 성과 관리</div>
              </div>
              <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-purple-500/5">
                <div className="text-purple-400 font-extrabold text-xs mt-0.5 shrink-0">🎁 지원 혜택</div>
                <div className="text-xs text-slate-300 font-bold">파트너 센터 사무실 <span className="text-purple-400 font-black">월 임대료 50% 지원</span></div>
              </div>
            </div>

            {/* Right Reward Box (Integrated inside the card body) */}
            <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-b from-purple-950/40 to-slate-950 p-4 text-center space-y-1">
              <span className="text-[10px] font-black tracking-wider text-purple-400 uppercase bg-purple-500/10 px-2.5 py-0.5 rounded-full">광역 운영 리워드</span>
              <div className="text-xs text-slate-300 font-extrabold pt-1">관리 매출의</div>
              <div className="text-3xl font-black text-amber-400 font-mono tracking-tight my-1">5%</div>
              <div className="text-[10px] text-slate-400 font-bold border-t border-slate-900 pt-1.5 mt-1">지급 기간: 3개월 누적 지급</div>
            </div>

            {/* Bottom Special Block 1: 추천 파트너 라운지 운영지원금 */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-purple-950/30 rounded-2xl border border-purple-500/10 space-y-2">
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-400/10 flex items-center justify-center text-purple-400">
                    <Coins className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-xs font-black text-white">추천 파트너 라운지 운영지원금</span>
                </div>
                <span className="text-[9px] font-black bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">1회성 보너스</span>
              </div>
              <div className="text-xs text-slate-400 font-bold">
                지원 명목 정액 <strong className="text-amber-400 text-sm font-black">400만원</strong> 지급
              </div>
            </div>

            {/* Bottom Spacer/Placeholder to match lengths */}
            <div className="p-4 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800/60 flex items-center justify-center text-slate-600 text-[10px] h-[72px]">
              최상위 리더 전용 특별 엑스트라 프로모션 적용 대기
            </div>
          </div>
        </motion.div>
      </div>

      {/* Horizontal Section: 추천 보상 한눈에 보기! (Recommendation Rewards at a Glance) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 md:p-8 bg-slate-950 border border-amber-500/20 rounded-[2rem] space-y-6"
      >
        <div className="flex items-center gap-2.5 border-b border-slate-900 pb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 font-black">
            ✦
          </div>
          <div>
            <h3 className="text-lg font-black text-white">추천 보상 한눈에 보기!</h3>
            <p className="text-[10px] text-slate-400 font-bold">지역 파트너 추천 개설 및 크리에이터 추천에 따른 풍성한 정액 보너스 합산</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Box 1 */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">대리점 추천</span>
              <h4 className="text-xs font-black text-slate-300">추천 대리점 + 광역 파트너센터(지사)</h4>
            </div>
            
            <div className="flex items-center gap-2 justify-center py-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 text-xs font-bold">대리점 350만</div>
              <span className="text-slate-500 font-bold">+</span>
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 text-xs font-bold">지사 50만</div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
              <span className="text-[10px] text-slate-400 block font-bold">총 지급액</span>
              <span className="text-base font-black text-emerald-400">총 400만원 <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-black">1회성</span></span>
            </div>
          </div>

          {/* Box 2 */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">크리에이터 추천</span>
              <h4 className="text-xs font-black text-slate-300">크리에이터 + 대리점 + 광역 파트너센터(지사)</h4>
            </div>
            
            <div className="flex items-center gap-1.5 justify-center py-2 text-[10px]">
              <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400 font-bold">크리에이터 250만</div>
              <span className="text-slate-500 font-bold">+</span>
              <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 font-bold">대리점 100만</div>
              <span className="text-slate-500 font-bold">+</span>
              <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400 font-bold">지사 50만</div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
              <span className="text-[10px] text-slate-400 block font-bold">총 지급액</span>
              <span className="text-base font-black text-blue-400">총 400만원 <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-black">1회성</span></span>
            </div>
          </div>

          {/* Box 3 */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 text-center">
            <div className="space-y-1 text-left">
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block">추천 대리점 개설 시 추가 보상</span>
              <h4 className="text-xs font-black text-slate-300">추천된 대리점이 최종 개설될 경우</h4>
            </div>
            
            <div className="flex flex-col items-center justify-center py-2 space-y-1">
              <Users className="w-8 h-8 text-amber-400" />
              <span className="text-[10px] text-slate-400 font-semibold">소속 대리점 연대 혜택</span>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 block font-bold">소속 대리점 보상</span>
              <span className="text-base font-black text-purple-400">100만원 지급</span>
            </div>
          </div>

        </div>
      </motion.div>

      {/* Bottom Grid/Table: 수익 구조 요약 (Revenue Structure Summary) & Additional Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Table layout left */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-[2rem] p-6 space-y-5"
        >
          <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
            <div className="w-2.5 h-6 bg-amber-500 rounded" />
            <h3 className="text-sm font-black text-white">수익 구조 요약 (Revenue Structure Table)</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 font-bold">
              <thead>
                <tr className="bg-slate-900 text-slate-400 border-b border-slate-850">
                  <th className="p-3 font-black text-[10px] uppercase">구분</th>
                  <th className="p-3 font-black text-[10px] uppercase">보상 명칭</th>
                  <th className="p-3 font-black text-[10px] uppercase">지급 기준</th>
                  <th className="p-3 font-black text-[10px] uppercase">지급률 / 금액</th>
                  <th className="p-3 font-black text-[10px] uppercase">지급 기간</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                <tr className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3 font-black text-blue-400">01 팬덤 크리에이터</td>
                  <td className="p-3">팬덤 리워드</td>
                  <td className="p-3 text-slate-400 font-medium">회원 1명 가입 시</td>
                  <td className="p-3 text-amber-400 font-black">판매가의 20%</td>
                  <td className="p-3 text-slate-500 font-semibold">3개월 누적 지급</td>
                </tr>
                <tr className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3 font-black text-emerald-400">02 지역 파트너 라운지</td>
                  <td className="p-3">지역 운영 리워드</td>
                  <td className="p-3 text-slate-400 font-medium">총 매출 기준</td>
                  <td className="p-3 text-amber-400 font-black">10%</td>
                  <td className="p-3 text-slate-500 font-semibold">3개월 누적 지급</td>
                </tr>
                <tr className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3 font-black text-purple-400">03 광역 파트너센터</td>
                  <td className="p-3">광역 운영 리워드</td>
                  <td className="p-3 text-slate-400 font-medium">관리 매출 기준</td>
                  <td className="p-3 text-amber-400 font-black">5%</td>
                  <td className="p-3 text-slate-500 font-semibold">3개월 누적 지급</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Additional details row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-850 flex items-center gap-3">
              <Coins className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block">크리에이터 스타트 지원금</span>
                <span className="text-xs font-bold text-slate-200">월 150만원 × 3개월 = <strong className="text-blue-400">총 450만원 지원!</strong></span>
                <span className="text-[9px] text-slate-500 block mt-0.5">※ 가입 후 활동 조건 충족 시 지급</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-850 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 shrink-0">
                📦
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">상품 반환 혜택 (Safety Refund)</span>
                <span className="text-xs font-bold text-slate-200">퇴사 시 미판매 상품 <strong className="text-red-400">90% 즉시 환급</strong></span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bullet points right */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-[2rem] p-6 space-y-4 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <div className="w-2.5 h-6 bg-purple-500 rounded" />
              <h3 className="text-sm font-black text-white">팬덤 오로라 파트너 혜택</h3>
            </div>

            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-xs text-slate-300 font-bold bg-slate-900/50 p-2.5 rounded-xl border border-slate-850">
                <span className="text-base shrink-0">🎤</span>
                <span>연예인 팬미팅 참여 기회</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-slate-300 font-bold bg-slate-900/50 p-2.5 rounded-xl border border-slate-850">
                <span className="text-base shrink-0">🎫</span>
                <span>공연 VIP 초청</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-slate-300 font-bold bg-slate-900/50 p-2.5 rounded-xl border border-slate-850">
                <span className="text-base shrink-0">🥂</span>
                <span>팬파티 초청</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-slate-300 font-bold bg-slate-900/50 p-2.5 rounded-xl border border-slate-850">
                <span className="text-base shrink-0">⛵</span>
                <span>크루즈 팬여행 참여 기회</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-slate-300 font-bold bg-slate-900/50 p-2.5 rounded-xl border border-slate-850">
                <span className="text-base shrink-0">🎁</span>
                <span>우수 파트너 특별 포상</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20 text-center text-[10px] text-amber-400 font-black tracking-wide">
            🏆 ALL SEASON PASS UNLOCKED
          </div>
        </motion.div>
      </div>

      {/* Footer Banner */}
      <div className="text-center py-6 space-y-4 border-t border-slate-900">
        <p className="text-sm md:text-lg font-black tracking-tight text-amber-300 font-serif italic">
          &quot;좋아하는 아티스트와 함께! 즐거운 추억도 만들고, 수익도 만드는 특별한 기회!&quot;
        </p>
        <button className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 font-black rounded-full text-xs md:text-sm tracking-widest uppercase hover:scale-105 transition-all shadow-lg shadow-amber-500/10 border border-amber-300/30">
          지금 바로 도전하세요! ✦
        </button>
      </div>

    </div>
  );
}

