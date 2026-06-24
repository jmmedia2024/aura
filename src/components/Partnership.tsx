import React from 'react';
import { motion } from 'motion/react';
import { Database, FileText, Layout, Users, Settings, Cpu } from 'lucide-react';

const DB_MODULES = [
  {
    name: 'Applications',
    icon: <FileText className="w-5 h-5" />,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    description: 'Management system for VIP card applications and status tracking.'
  },
  {
    name: 'Designs',
    icon: <Layout className="w-5 h-5" />,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    description: 'Repository for exclusive card visual assets and premium UI templates.'
  },
  {
    name: 'Profiles',
    icon: <Users className="w-5 h-5" />,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    description: 'Secure user data handling including tiers, roles, and fandom history.'
  },
  {
    name: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    description: 'Centralized configuration for app parameters and environment states.'
  }
];

export default function Partnership() {
  return (
    <section className="py-24 px-6 md:px-12 relative overflow-hidden bg-transparent">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 text-amber-500 font-black text-xs tracking-[0.3em] uppercase">
              <Database className="w-4 h-4" />
              <span>System Architecture</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-black text-white tracking-tight">
              AURORA PARTNERSHIP <br />
              <span className="text-slate-500 text-2xl md:text-3xl">DATA INFRASTRUCTURE</span>
            </h2>
          </div>
          <div className="hidden lg:block">
            <Cpu className="w-16 h-16 text-slate-800 animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DB_MODULES.map((module, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group p-8 rounded-[2rem] bg-white/5 backdrop-blur-xl border ${module.borderColor} hover:border-white/20 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:-translate-y-2`}
            >
              <div className={`w-12 h-12 rounded-2xl ${module.bgColor} flex items-center justify-center ${module.color} mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                {module.icon}
              </div>
              <h3 className="text-lg font-black text-white mb-3 tracking-tight group-hover:text-amber-400 transition-colors">
                {module.name}
              </h3>
              <p className="hidden md:block text-xs text-slate-400 leading-relaxed font-medium">
                {module.description}
              </p>
              
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-black tracking-widest text-slate-500">DB.ENTITY</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
