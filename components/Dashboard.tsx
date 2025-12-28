
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
      {/* Premium Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="hidden sm:block text-right">
                  <h1 className="font-black text-lg text-slate-900 leading-none">بيزنس ديفلوبرز</h1>
                  <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1 block">AI Accelerator</span>
                </div>
              </div>
              <nav className="hidden md:flex gap-6 items-center">
                <a href="#" className="text-sm font-black text-blue-600 border-b-2 border-blue-600 py-7">لوحة التحكم</a>
                <a href="#" className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">المسار التدريبي</a>
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
                  عرض الشهادة
                </button>
              )}

              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group"
                >
                  <div className="text-right hidden lg:block ml-2">
                    <p className="text-xs font-black text-slate-900 leading-none mb-1 group-hover:text-blue-600">{user.name}</p>
                    <p className="text-[10px] font-bold text-slate-400">{user.startupName}</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black shadow-md">
                    {user.name.charAt(0)}
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute left-0 mt-3 w-72 rounded-[2rem] shadow-2xl bg-white border border-slate-100 p-2 z-50 animate-fade-in-up">
                    <div className="p-4 bg-slate-50 rounded-[1.5rem] mb-2 text-right">
                       <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">مشروعك الحالي</p>
                       <h4 className="font-black text-slate-900 mb-1">{user.startupName}</h4>
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-700">
                         {user.industry}
                       </span>
                    </div>
                    <button 
                      onClick={onLogout}
                      className="w-full flex items-center justify-end gap-3 px-4 py-3 text-sm font-black text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      تسجيل الخروج
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between group transition-all duration-500 hover:bg-white/50 p-6 rounded-[2.5rem] -m-6">
           <div className="space-y-2 text-right">
             <h2 className="text-3xl font-black text-slate-900">أهلاً بك، {user.name} 👋</h2>
             <p className="text-slate-500 font-medium">أنت الآن في البرنامج التدريبي لمشروع {user.startupName}.</p>
           </div>
           
           <div className="w-full lg:w-96 relative group/search">
             <input 
               type="text"
               placeholder="ابحث عن مستوى أو مهارة..."
               className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-4 pr-12 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
             <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-blue-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
             </div>
           </div>
        </div>

        {/* Global Progress Card */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 mb-12 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-right space-y-2">
                 <p className="text-blue-400 text-xs font-black uppercase tracking-[0.2em]">نسبة الإنجاز الكلية</p>
                 <h3 className="text-5xl font-black">{Math.round(progress)}%</h3>
                 <p className="text-slate-400 text-sm max-w-xs leading-relaxed">أتممت {completedCount} من أصل {levels.length} مستويات بنجاح.</p>
              </div>
              
              <div className="flex-1 w-full max-w-md">
                 <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden mb-4">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-1000" 
                      style={{ width: `${progress}%` }}
                    ></div>
                 </div>
                 <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                    <span>البداية</span>
                    <span>خط النهاية</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLevels.map((level) => {
            const isCompleted = level.isCompleted;
            const isLocked = level.isLocked;
            
            return (
              <div 
                key={level.id}
                onClick={() => handleCardClick(level)}
                className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 cursor-pointer overflow-hidden
                  ${isLocked ? 'bg-slate-100 border-slate-200 grayscale opacity-60' : 'bg-white border-slate-100 hover:shadow-2xl hover:-translate-y-2'}
                  ${isCompleted ? 'ring-2 ring-green-500/20' : ''}
                `}
              >
                <div className="absolute top-6 left-6">
                  {isCompleted ? (
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth={3} /></svg>
                      مكتمل
                    </div>
                  ) : isLocked ? (
                    <div className="bg-slate-200 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      مغلق
                    </div>
                  ) : (
                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black animate-pulse">
                      ابدأ الآن
                    </div>
                  )}
                </div>

                <div className="mt-8 space-y-4 text-right">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all mr-auto
                    ${isLocked ? 'bg-slate-200 text-slate-400' : 'bg-blue-50 text-blue-600 group-hover:scale-110'}
                  `}>
                    {level.id}
                  </div>
                  
                  <div>
                    <h4 className={`text-xl font-black mb-2 ${isLocked ? 'text-slate-400' : 'text-slate-900 group-hover:text-blue-600'}`}>
                      {level.title}
                    </h4>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                      {level.description}
                    </p>
                  </div>
                  
                  <div className="pt-4 flex items-center justify-between flex-row-reverse">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isLocked ? 'text-slate-300' : 'text-blue-600'}`}>
                      {isLocked ? 'أكمل المتطلبات' : isCompleted ? 'تم الإنجاز' : 'ابدأ التعلم'}
                    </span>
                    {!isLocked && (
                      <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all">
                        <svg className="w-4 h-4 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center text-slate-400">
           <p className="text-[10px] font-black uppercase tracking-[0.4em]">Business Developers AI Ecosystem • v1.0</p>
        </div>
      </main>
    </div>
  );
};
