import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, CheckCircle2, DollarSign, GitFork, Network, Landmark, Building, Briefcase, Target, ShieldCheck } from 'lucide-react';

export default function OrganizationTab() {
  const steps = [
    {
      role: "오로라 본사 (HQ)",
      desc: "온라인 대외 마케팅, 방송 콘텐츠 제작, 연예인 매니지먼트, 오프라인 이벤트 운영, 리워드 조달 및 고객 서비스 컨트롤",
      color: "bg-blue-600 text-white shadow-blue-500/10 border-blue-500"
    },
    {
      role: "지사 (17개 연합)",
      desc: "전국 권역별 대리점 모집 및 관리 교육, 연쇄 실적 관리 감독, 소속 대리점 통합 서포트",
      color: "bg-indigo-50 border-indigo-200 text-indigo-900"
    },
    {
      role: "지역 대리점 (400개 목표)",
      desc: "지방 거점 오프라인 상품 홍보 대리점 개설, 소속 영업사원 정례 모집, 지역 마케팅 및 회원 대리 케어",
      color: "bg-slate-50 border-slate-200 text-slate-800"
    },
    {
      role: "전문 영업사원 (5,000명)",
      desc: "온/오프라인 팬덤 멤버십 회원 밀착 수습, 개인 SNS 광고 및 라이브 방송 연계 활동, VIP 특별 케어",
      color: "bg-amber-50/80 border-amber-200 text-amber-900"
    },
    {
      role: "팬덤 회원 (10만 누적)",
      desc: "한정판 팬클럽 멤버십 혜택을 온전히 수령하고 평생 소장의 유대감을 만끽하는 최종 수혜 오너 군집",
      color: "bg-emerald-50 border-emerald-100 text-emerald-900"
    }
  ];

  const details = [
    {
      category: "지사 운영 제도 (Branch)",
      highlights: [
        "지사 수익: 산하 개설 및 관리 대리점 총매출의 5% 매월 누적 지급 (산하 대리점 볼륨 성장 시 폭증)",
        "주요 역할: 지역 하부 네트워킹 구축, 영업 마케터 대상 멘토링 프로그램, 정례 실적 정합성 확인"
      ],
      icon: <Landmark className="w-5 h-5 text-indigo-600" />
    },
    {
      category: "지역 대리점 제도 (Agency)",
      highlights: [
        "개설 요건: 대리점 운영 임시 보증금 1,000만원 납입 (본사 100% 안전 보증)",
        "본사 원조: 팬덤 오로라 전용 웰컴 패키지 100개 무상 포진, 오프라인 포스터 및 대형 브로셔 풀 지원",
        "수익 보장: 대리점 관내에서 발생하는 총매출액의 10% 일괄 평생 누적 정산 (3개월 누적 지속형 지급)"
      ],
      icon: <Building className="w-5 h-5 text-slate-700" />
    },
    {
      category: "전문 영업 마케터 제도 (Representative)",
      highlights: [
        "가입 지원: 팬덤 오로라 정규 멤버십 최초 6개 선구매 (55만원 * 6 = 총 330만원 리테일 스타트)",
        "활동 지원금 보조: 본사 지원 월 150만원 고정 배수 (총 3개월 연속 무상 보조, 총 450만원의 실탄 지원)",
        "유통 마진 셰어: 단독 모집 가입 발생 시, 즉각 가입금의 20% (평균 건당 100,000원 상당) 정산",
        "소속 추천 보너스: 사원 간 신규 동행 영입 시, 추천인에게 월 50만원 특별 활동 보조비 3개월간 균등 지급"
      ],
      icon: <Briefcase className="w-5 h-5 text-amber-600" />
    }
  ];

  const compensationMatrix = [
    { trigger: "대리점 ➔ 신규 대리점 추천 시", receiver: "추천 대리점 본인", amount: "350만 원 일시불 지급", note: "지사에 별도로 50만원 수수료 오버라이드 지원" },
    { trigger: "영업사원 ➔ 신규 대리점 유치 시", receiver: "추천 영업사원 본인", amount: "250만 원 특별 포상", note: "소속 대리점에 100만원 지원, 지사에 50만원 동시 분배" },
    { trigger: "소속 대리점 산하 대리점 신규 가맹", receiver: "모(母) 소속 대리점", amount: "100만 원 보조 포상", note: "네트워크 확장 기여도로 귀속" }
  ];

  return (
    <div className="space-y-12">
      {/* Visual Hierarchy Tree Flow */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-8 md:p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl text-center space-y-8"
      >
        <div className="space-y-1">
          <span className="text-[10px] font-black text-blue-600 tracking-widest uppercase">NATIONWIDE NETWORK FLOW</span>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">전국 5단계 영업 네트워크 연계 구조</h3>
          <p className="text-slate-400 text-xs font-semibold">각 거점이 상호 보완하고 고정 마일리지를 공유하는 무한 유통 구조체</p>
        </div>

        <div className="flex flex-col items-center gap-4 max-w-4xl mx-auto pt-4 relative">
          {steps.map((st, sIdx) => (
            <React.Fragment key={sIdx}>
              {sIdx > 0 && <ArrowDown className="w-5 h-5 text-slate-300 animate-bounce" />}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`w-full p-5 rounded-2xl border text-left flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all shadow-sm ${st.color}`}
              >
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-white/20 border border-slate-200/20 flex items-center justify-center font-black text-xs">
                    0{sIdx + 1}
                  </div>
                  <h4 className="font-extrabold text-sm md:text-base">{st.role}</h4>
                </div>
                <p className="text-xs md:text-sm font-semibold opacity-90 leading-relaxed max-w-2xl text-left md:text-right">
                  {st.desc}
                </p>
              </motion.div>
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      {/* Structural Requirements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {details.map((dt, dIdx) => (
          <motion.div
            key={dIdx}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -3 }}
            className="p-6 bg-white border border-slate-150 rounded-[2rem] shadow-md flex flex-col justify-between"
          >
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                  {dt.icon}
                </div>
                <h4 className="font-black text-slate-800 text-sm md:text-base tracking-tight">{dt.category}</h4>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="space-y-4">
                {dt.highlights.map((hl, hlIdx) => (
                  <div key={hlIdx} className="flex gap-2.5 items-start text-xs text-slate-600 font-semibold leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Referral Rewards Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-8 bg-white border border-slate-150 rounded-[2.5rem] shadow-xl space-y-6"
      >
        <div className="space-y-1">
          <span className="text-[10px] font-black text-amber-600 tracking-widest block uppercase">COMMISSION & OVERRIDE MATRIX</span>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">수평적 추천 대리 개설 파격 보상 체계</h3>
          <p className="text-slate-400 text-xs font-semibold">동료 영입 및 지사 대리 개척 시 누수 없이 실시간 지급되는 직접적인 인센티브 리스트</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-sans">
                <th className="p-4 rounded-l-xl font-black">추천 발생 트리거</th>
                <th className="p-4 font-black">수혜 정액 대상</th>
                <th className="p-4 font-black text-blue-600">지급 포상 실질 가치</th>
                <th className="p-4 rounded-r-xl font-black">추가 오버라이딩 비고</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-semibold text-slate-600">
              {compensationMatrix.map((cm, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-black text-slate-900">{cm.trigger}</td>
                  <td className="p-4">{cm.receiver}</td>
                  <td className="p-4 font-black text-blue-600 text-sm">{cm.amount}</td>
                  <td className="p-4 text-slate-400 text-[11px]">{cm.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Business Goal Targets (Bento Block) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="p-8 bg-blue-50/40 rounded-[2rem] border border-blue-100 text-center space-y-5"
      >
        <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
          <Target className="w-3.5 h-3.5 animate-spin" />
          <span>AURORA NATIONWIDE ROADMAP</span>
        </div>
        <h4 className="font-black text-slate-800 text-lg">2026 오로라 전국 로드맵 및 예상 조직 목표</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
          {[
            { label: "전국 거점 지사", value: "17개", color: "text-blue-600" },
            { label: "지역 오프라인 대리점", value: "400개", color: "text-indigo-600" },
            { label: "소속 활동 영업사원", value: "5,000명", color: "text-amber-500" },
            { label: "최종 가입 목표 회원", value: "100,000명", color: "text-emerald-500" }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-blue-50 relative overflow-hidden shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{item.label}</span>
              <span className={`text-2xl md:text-3xl font-display font-black tracking-tight ${item.color} block mt-1`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
