import React from 'react';
import { motion } from 'motion/react';
import { Database, FileText, Layout, Users, Settings, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

const DB_MODULES = [
  {
    name: 'Applications',
    icon: <FileText className="w-5 h-5" />,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    description: '나의 팬 선택 및 멤버십 등록 신청 관리 시스템입니다.',
    path: '/admin'
  },
  {
    name: 'Designs',
    icon: <Layout className="w-5 h-5" />,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    description: '스타 고해상도 백그라운드 이미지 및 카드 디자인 템플릿 관리.',
    path: '/admin'
  },
  {
    name: 'Profiles',
    icon: <Users className="w-5 h-5" />,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    description: '회원 프로필, 멤버십 등급, 영업 파트너 권한 및 추천인 제어.',
    path: '/admin'
  },
  {
    name: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    description: '웹사이트 전반의 문구, 요금, 혜택 등 주요 환경 설정.',
    path: '/admin'
  }
];

export default function Partnership() {
  const { profile } = useAuth();

  // 관리자(Admin) 권한이 없으면 렌더링하지 않음
  if (profile?.role !== 'Admin') {
    return null;
  }

  return (
    <section className="py-24 px-6 md:px-12 relative overflow-hidden bg-transparent">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 text-amber-500 font-black text-xs tracking-[0.3em] uppercase">
              <Database className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-black text-white tracking-tight">
              ADMIN CONTROL <br />
              <span className="text-slate-500 text-2xl md:text-3xl">관리자 전용 페이지</span>
            </h2>
          </div>
          <div className="hidden lg:block">
            <Cpu className="w-16 h-16 text-amber-500/50 animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DB_MODULES.map((module, index) => (
            <Link to={module.path} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group p-8 rounded-[2rem] bg-white/5 backdrop-blur-xl border ${module.borderColor} hover:border-white/20 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:-translate-y-2 h-full flex flex-col`}
              >
                <div className={`w-12 h-12 rounded-2xl ${module.bgColor} flex items-center justify-center ${module.color} mb-6 shadow-lg group-hover:scale-110 transition-transform shrink-0`}>
                  {module.icon}
                </div>
                <h3 className="text-lg font-black text-white mb-3 tracking-tight group-hover:text-amber-400 transition-colors">
                  {module.name}
                </h3>
                <p className="hidden md:block text-xs text-slate-400 leading-relaxed font-medium flex-1">
                  {module.description}
                </p>
                
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black tracking-widest text-slate-500">MANAGE</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
