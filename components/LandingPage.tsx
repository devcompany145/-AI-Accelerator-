
import React from 'react';

interface LandingPageProps {
  onStart: () => void;
  onPathFinder: () => void;
  onSmartFeatures: () => void;
  onGovDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onPathFinder }) => {
  const levels = [
    { id: 1, title: 'التحقق من الفكرة', icon: '💡' },
    { id: 2, title: 'نموذج العمل', icon: '📊' },
    { id: 3, title: 'تحليل السوق', icon: '🔎' },
    { id: 4, title: 'المنتج الأولي', icon: '🛠️' },
    { id: 5, title: 'الخطة المالية', icon: '💰' },
    { id: 6, title: 'عرض الاستثمار', icon: '🚀' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 tracking-tight leading-none">مسرعة بيزنس ديفلوبرز</span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">AI Virtual Accelerator</span>
          </div>
        </div>
        <div className="hidden md:flex gap-8 items-center text-sm font-bold text-slate-500">
           <a href="#levels" className="hover:text-blue-600 transition-colors">مراحل البرنامج</a>
           <a href="#features" className="hover:text-blue-600 transition-colors">المميزات</a>
           <button onClick={onStart} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">ابدأ التسجيل</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32">
        <div className="absolute top-0 right-0 w-1/3 h-screen bg-blue-50/50 rounded-bl-[10rem] -z-10 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 bg-blue-100 text-blue-700 px-5 py-2 rounded-full text-xs font-black border border-blue-200">
               <span className="animate-bounce">⚡</span>
               <span className="uppercase tracking-widest text-[10px]">مسرعة أعمال مدعومة بـ Gemini AI</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.1] tracking-tight">
              ابنِ شركتك الناشئة <br/>
              <span className="text-blue-600 relative inline-block">
                بذكاء خارق.
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 358 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9C118.957 4.47226 239.043 4.47226 355 9" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-lg leading-relaxed font-medium">
              أول مسرعة أعمال افتراضية تأخذ بيدك من الفكرة إلى الجاهزية للاستثمار عبر 6 مستويات تدريبية تفاعلية بالكامل.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <button 
                onClick={onStart}
                className="px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white text-xl font-black rounded-[2rem] shadow-2xl shadow-blue-200 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group"
              >
                <span>ابدأ رحلة النجاح</span>
                <svg className="w-6 h-6 group-hover:translate-x-[-4px] transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <button 
                onClick={onPathFinder}
                className="px-10 py-6 bg-white border-2 border-slate-200 hover:border-blue-600 text-slate-700 hover:text-blue-600 text-lg font-black rounded-[2rem] transition-all shadow-sm flex items-center justify-center gap-3"
              >
                تحدث مع المرشد الذكي
              </button>
            </div>
            
            <div className="flex gap-10 pt-10">
               <div className="flex -space-x-3 space-x-reverse">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
                     <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Founder" />
                   </div>
                 ))}
                 <div className="w-12 h-12 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">+500</div>
               </div>
               <div>
                 <p className="text-sm font-black text-slate-900 leading-none">انضم لرواد الأعمال</p>
                 <p className="text-xs text-slate-500 font-bold mt-1">الذين بدأوا رحلتهم معنا اليوم</p>
               </div>
            </div>
          </div>

          <div className="relative hidden lg:block animate-fade-in">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/30 rounded-full blur-[100px] -z-10"></div>
             <div className="bg-white p-4 rounded-[4rem] border border-slate-200 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-700">
                <div className="bg-slate-900 rounded-[3rem] shadow-inner p-10 text-white min-h-[500px] flex flex-col">
                   <div className="flex justify-between items-center mb-12">
                      <div className="flex gap-2">
                         <div className="w-3 h-3 rounded-full bg-red-500"></div>
                         <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                         <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Accelerator OS v1.0</span>
                   </div>
                   
                   <div className="space-y-8 flex-1">
                      <div className="space-y-3">
                         <div className="h-2 w-24 bg-blue-500 rounded-full"></div>
                         <div className="h-8 w-full bg-white/10 rounded-2xl border border-white/5 animate-pulse"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="h-32 bg-white/5 rounded-3xl border border-white/5 p-4">
                            <div className="w-8 h-8 bg-blue-600/50 rounded-lg mb-4"></div>
                            <div className="h-2 w-12 bg-white/20 rounded-full"></div>
                         </div>
                         <div className="h-32 bg-white/5 rounded-3xl border border-white/5 p-4">
                            <div className="w-8 h-8 bg-purple-600/50 rounded-lg mb-4"></div>
                            <div className="h-2 w-12 bg-white/20 rounded-full"></div>
                         </div>
                      </div>
                      <div className="h-40 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-[2.5rem] border border-white/10 flex items-center justify-center relative overflow-hidden">
                         <div className="text-center z-10">
                            <p className="text-xs font-black text-blue-400 mb-2">تحليل الجاهزية</p>
                            <p className="text-4xl font-black">88%</p>
                         </div>
                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Levels Section */}
      <section id="levels" className="bg-slate-50 py-24 relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16 space-y-4">
               <h2 className="text-4xl font-black text-slate-900">برنامج مكثف من 6 مراحل</h2>
               <p className="text-slate-500 max-w-2xl mx-auto font-medium">صممنا لك رحلة متكاملة تضمن بناء مشروعك على أسس علمية وريادية صحيحة مدعومة بتقنيات الذكاء الاصطناعي.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
               {levels.map((level) => (
                 <div key={level.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-center group hover:shadow-xl hover:-translate-y-2 transition-all">
                    <div className="text-4xl mb-6 bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-500">
                       <span className="group-hover:filter group-hover:brightness-0 group-hover:invert">{level.icon}</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">المستوى {level.id}</p>
                    <h4 className="text-sm font-black text-slate-800">{level.title}</h4>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <div className="space-y-4">
                  <div className="text-3xl">🦾</div>
                  <h3 className="text-2xl font-black text-slate-900">توجيه ذكي 24/7</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">مدرب أعمال ذكي متاح دائماً للإجابة على تساؤلاتك ومراجعة مخرجاتك في كل مرحلة من مراحل البرنامج.</p>
               </div>
               <div className="space-y-4">
                  <div className="text-3xl">📊</div>
                  <h3 className="text-2xl font-black text-slate-900">تحليل فوري للفكرة</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">احصل على تقييم نقدي وموضوعي لفكرتك بناءً على 5 محاور أساسية (الوضوح، القيمة، الابتكار، السوق، الجاهزية).</p>
               </div>
               <div className="space-y-4">
                  <div className="text-3xl">📜</div>
                  <h3 className="text-2xl font-black text-slate-900">شهادة تخرج معتمدة</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">بمجرد إكمال المستويات الستة، ستحصل على شهادة تخرج رسمية من مسرعة "بيزنس ديفلوبرز" تبرز جاهزية مشروعك.</p>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
         <div className="max-w-5xl mx-auto bg-slate-900 rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full blur-[100px] opacity-20"></div>
            
            <div className="relative z-10 space-y-10">
               <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">جاهز لتحويل فكرتك <br/> إلى واقع استثماري؟</h2>
               <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium">انضم إلى مئات رواد الأعمال الذين بدؤوا رحلتهم اليوم. التسجيل مجاني لفترة محدودة.</p>
               <button 
                onClick={onStart}
                className="px-14 py-6 bg-white text-slate-900 text-xl font-black rounded-[2rem] hover:bg-blue-50 transition-all shadow-xl shadow-white/5 transform hover:scale-105 active:scale-95"
               >
                 سجل مشروعك الآن 🚀
               </button>
            </div>
         </div>
      </section>

      <footer className="py-12 border-t border-slate-100 bg-slate-50 text-center">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
               <div className="flex items-center gap-3 grayscale opacity-70">
                  <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-lg font-black text-slate-800">بيزنس ديفلوبرز</span>
               </div>
               <div className="flex gap-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <a href="#" className="hover:text-blue-600">سياسة الخصوصية</a>
                  <a href="#" className="hover:text-blue-600">الشروط والأحكام</a>
                  <a href="#" className="hover:text-blue-600">تواصل معنا</a>
               </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Business Developers Hub • 2024 • Powered by Gemini Flash 3</p>
         </div>
      </footer>
    </div>
  );
};
