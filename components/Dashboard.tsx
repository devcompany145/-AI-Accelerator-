
import React, { useState, useRef, useEffect } from 'react';
import { LevelData, UserProfile } from '../types';
import { playCelebrationSound, playPositiveSound } from '../services/audioService';

interface DashboardProps {
  user: UserProfile;
  levels: LevelData[];
  onSelectLevel: (id: number) => void;
  onShowCertificate: () => void;
  onLogout?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, levels, onSelectLevel, onShowCertificate, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);
  
  const completedCount = levels.filter(l => l.isCompleted).length;
  const progress = (completedCount / levels.length) * 100;
  const allCompleted = completedCount === levels.length;

  const handleCertificateClick = () => {
    playCelebrationSound();
    onShowCertificate();
  };

  const handleCardClick = (level: LevelData) => {
    if (!level.isLocked) {
      playPositiveSound();
      onSelectLevel(level.id);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLevels = levels.filter(level => 
    level.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    level.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      {/* Sticky Premium Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-black text-lg text-slate-900 leading-none">بيزنس ديفلوبرز</h1>
                  <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1 block">AI Accelerator</span>
                </div>
              </div>
              
              {/* Main Navigation */}
              <nav className="hidden md:flex gap-6 items-center">
                <a href="#" className="text-sm font-black text-blue-600 border-b-2 border-blue-600 py-7">لوحة التحكم</a>
                <a href="#" className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">المسار التدريبي</a>
                <a href="#" className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">المصادر</a>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {allCompleted && (
                <button
                  onClick={handleCertificateClick}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-green-100 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  الشهادة
                </button>
              )}

              {/* User Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group"
                >
                  <div className="text-left hidden lg:block mr-2">
                    <p className="text-xs font-black text-slate-900 leading-none mb-1 group-hover:text-blue-600">{user.name}</p>
                    <p className="text-[10px] font-bold text-slate-400">{user.startupName}</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white font-black shadow-md shadow-slate-200 transition-transform group-active:scale-95">
                    {user.name.charAt(0)}
                  </div>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute left-0 mt-3 w-72 rounded-[2rem] shadow-2xl bg-white border border-slate-100 p-2 animate-fade-in-up origin-top-left z-50">
                    <div className="p-4 bg-slate-50 rounded-[1.5rem] mb-2">
                       <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">مشروعك الحالي</p>
                       <h4 className="font-black text-slate-900 mb-1">{user.startupName}</h4>
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-700">
                         {user.industry}
                       </span>
                    </div>
                    <div className="space-y-1">
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        الملف الشخصي
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        الإعدادات
                      </button>
                      <div className="h-px bg-slate-100 my-1 mx-2"></div>
                      <button 
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-black text-rose-600 hover:bg-rose-50 rounded-xl transition-colors group"
                      >
                        <svg className="w-5 h-5 text-rose-400 group-hover:text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        تسجيل الخروج
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Welcome Section Combined for better UX */}
        <div className="mb-12 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
           <div className