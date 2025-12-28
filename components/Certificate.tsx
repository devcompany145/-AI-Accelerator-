
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface CertificateProps {
  user: UserProfile;
  onClose: () => void;
}

const FONTS = [
  { id: 'font-amiri', name: 'أميري (كلاسيك)', family: "'Amiri', serif" },
  { id: 'font-cairo', name: 'كايرو (عصري)', family: "'Cairo', sans-serif" },
  { id: 'font-tajawal', name: 'تجول (أنيق)', family: "'Tajawal', sans-serif" },
];

const COLOR_SCHEMES = [
  { id: 'gold', name: 'ذهبي ملكي', primary: '#C5A059', secondary: '#8C7355', bg: '#F9F6F0' },
  { id: 'silver', name: 'فضي بلاتيني', primary: '#94a3b8', secondary: '#475569', bg: '#f8fafc' },
  { id: 'blue', name: 'أزرق احترافي', primary: '#3b82f6', secondary: '#1e40af', bg: '#eff6ff' },
  { id: 'emerald', name: 'أخضر النمو', primary: '#10b981', secondary: '#065f46', bg: '#ecfdf5' },
];

const BORDER_STYLES = [
  { id: 'double', name: 'إطار مزدوج', class: 'border-double' },
  { id: 'solid', name: 'إطار صلب', class: 'border-solid' },
  { id: 'dashed', name: 'إطار منقط', class: 'border-dashed' },
];

export const Certificate: React.FC<CertificateProps> = ({ user, onClose }) => {
  const [activeFont, setActiveFont] = useState(FONTS[0]);
  const [activeColor, setActiveColor] = useState(COLOR_SCHEMES[0]);
  const [activeBorder, setActiveBorder] = useState(BORDER_STYLES[0]);
  const [isCompact, setIsCompact] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const shareText = `لقد تخرجت للتو من مسرعة الأعمال الذكية AI Accelerator! 🚀 مشروع: ${user.startupName}`;
  const shareUrl = window.location.href;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'شهادة تخرج AI Accelerator',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      setIsShareMenuOpen(!isShareMenuOpen);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-md">
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=Tajawal:wght@400;700;900&display=swap" rel="stylesheet" />
      
      <style>{`
        @keyframes cert-pop {
          0% { opacity: 0; transform: scale(0.95) translateY(30px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-cert-pop {
          animation: cert-pop 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @media print {
          body * { visibility: hidden; }
          #certificate-container, #certificate-container * { visibility: visible; }
          #certificate-container {
            position: absolute; left: 0; top: 0; width: 100%; height: 100%;
            margin: 0; padding: 0; box-shadow: none; border: none;
            background: white !important; -webkit-print-color-adjust: exact;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="relative max-w-6xl w-full rounded-3xl shadow-2xl animate-cert-pop flex flex-col bg-white max-h-[95vh] overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 bg-black/5 hover:bg-black/10 p-2 rounded-full transition-colors z-50 no-print"
        >
          <svg className="w-6 h-6 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col lg:flex-row h-full">
          
          {/* Main Certificate View Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-12 bg-stone-100/50 flex items-center justify-center">
            <div 
              id="certificate-container" 
              className={`relative transition-all duration-700 ease-in-out shadow-2xl overflow-hidden bg-white
                ${isCompact ? 'w-full max-w-[600px] aspect-[1/1.414]' : 'w-full max-w-[850px] aspect-[1.414/1]'}
              `}
              style={{ fontFamily: activeFont.family, backgroundColor: activeColor.bg }}
            >
              <div className={`absolute inset-0 border-[20px] m-4 transition-all duration-500 ${activeBorder.class}`} style={{ borderColor: activeColor.primary }}></div>
              <div className={`absolute inset-0 border-[1px] m-10 opacity-30`} style={{ borderColor: activeColor.secondary }}></div>
              
              {/* Corner Ornaments */}
              <div className="absolute top-0 right-0 w-32 h-32 border-t-[10px] border-r-[10px] m-6" style={{ borderColor: activeColor.secondary }}></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 border-b-[10px] border-l-[10px] m-6" style={{ borderColor: activeColor.secondary }}></div>

              <div className="relative z-10 h-full flex flex-col justify-between items-center text-center p-12 md:p-20">
                
                {/* Logo Area */}
                <div className="relative group">
                  <div className="absolute inset-0 blur-2xl opacity-20 transition-all group-hover:opacity-40" style={{ backgroundColor: activeColor.primary }}></div>
                  <div className="relative w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl mb-6 border-2" style={{ backgroundColor: activeColor.secondary, borderColor: activeColor.primary }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter" style={{ color: activeColor.secondary }}>
                    شهادة تخرج
                  </h1>
                  <div className="h-1 w-48 mx-auto rounded-full" style={{ backgroundColor: activeColor.primary }}></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: activeColor.primary }}>Virtual AI Accelerator Hub</p>
                </div>

                <div className="my-8 md:my-12">
                  <p className="text-xl italic mb-6" style={{ color: activeColor.secondary }}>نشهد بكل فخر واعتزاز بأن</p>
                  <h2 className="text-5xl md:text-7xl font-black mb-8 px-10 py-4 relative inline-block">
                    <span style={{ color: activeColor.secondary }}>{user.name}</span>
                    <div className="absolute bottom-0 left-0 right-0 h-1 rounded-full opacity-30" style={{ backgroundColor: activeColor.primary }}></div>
                  </h2>
                  <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: activeColor.secondary }}>
                    قد أتم بنجاح البرنامج التدريبي المتكامل لتأسيس وريادة الأعمال، وقام بتطوير وتقديم مشروعه الابتكاري:
                  </p>
                  <h3 className="text-3xl md:text-4xl font-black mt-6 italic" style={{ color: activeColor.primary }}>
                    "{user.startupName}"
                  </h3>
                </div>

                <div className="w-full flex justify-between items-end px-4">
                  <div className="text-center w-40">
                    <p className="text-[10px] uppercase font-black opacity-40 mb-2">التاريخ</p>
                    <div className="border-b pb-2 font-bold" style={{ borderColor: activeColor.primary, color: activeColor.secondary }}>
                      {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>

                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-dashed rounded-full animate-spin-slow opacity-10" style={{ borderColor: activeColor.primary }}></div>
                    <div className="w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center shadow-lg bg-white" style={{ borderColor: activeColor.primary }}>
                       <span className="text-2xl">🛡️</span>
                       <span className="text-[8px] font-black uppercase tracking-widest mt-1" style={{ color: activeColor.secondary }}>Verified AI</span>
                    </div>
                  </div>

                  <div className="text-center w-40">
                    <p className="text-[10px] uppercase font-black opacity-40 mb-2">التوقيع</p>
                    <div className="border-b pb-2 h-10 flex items-end justify-center" style={{ borderColor: activeColor.primary }}>
                      <span className="font-serif italic text-2xl opacity-60" style={{ color: activeColor.secondary }}>AI Director</span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-6 text-[8px] font-mono opacity-20">
                  ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}-BD-V2
                </div>
              </div>
            </div>
          </div>

          {/* Customization Sidebar (No Print) */}
          <div className="w-full lg:w-96 bg-white border-r border-stone-100 p-8 flex flex-col justify-between no-print z-20">
            <div className="space-y-10 overflow-y-auto">
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                   <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                   تخصيص الشهادة
                </h3>
                <p className="text-xs text-slate-400 font-bold mb-8">قم بتعديل مظهر الشهادة بما يناسب ذوقك قبل الطباعة.</p>
              </div>

              {/* Layout Toggle */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">نمط التنسيق (Layout)</label>
                <div className="flex bg-stone-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setIsCompact(false)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!isCompact ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >أفقي (قياسي)</button>
                  <button 
                    onClick={() => setIsCompact(true)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isCompact ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >رأسي (طولي)</button>
                </div>
              </div>

              {/* Font Choice */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">اختر الخط</label>
                <div className="grid grid-cols-1 gap-2">
                  {FONTS.map(f => (
                    <button 
                      key={f.id}
                      onClick={() => setActiveFont(f)}
                      style={{ fontFamily: f.family }}
                      className={`w-full text-right px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-between
                        ${activeFont.id === f.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-stone-100 hover:border-stone-200 text-stone-600'}
                      `}
                    >
                      {f.name}
                      {activeFont.id === f.id && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth={3} /></svg>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Scheme */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">نظام الألوان</label>
                <div className="grid grid-cols-2 gap-3">
                  {COLOR_SCHEMES.map(c => (
                    <button 
                      key={c.id}
                      onClick={() => setActiveColor(c)}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2
                        ${activeColor.id === c.id ? 'border-blue-500 bg-blue-50' : 'border-stone-100 hover:border-stone-200'}
                      `}
                    >
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full border border-white" style={{ backgroundColor: c.primary }}></div>
                        <div className="w-6 h-6 rounded-full border border-white" style={{ backgroundColor: c.secondary }}></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Border Style */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">نمط الإطار</label>
                <div className="grid grid-cols-1 gap-2">
                  {BORDER_STYLES.map(b => (
                    <button 
                      key={b.id}
                      onClick={() => setActiveBorder(b)}
                      className={`w-full text-right px-4 py-3 rounded-xl border-2 transition-all text-xs font-bold
                        ${activeBorder.id === b.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-stone-100 hover:border-stone-200 text-stone-600'}
                      `}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-10 space-y-3">
              <div className="flex gap-2">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2"
                >
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                   طباعة الشهادة
                </button>
                <button 
                  onClick={handleShare}
                  className="p-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" strokeWidth={2} /></svg>
                </button>
              </div>
              <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest">تأكد من اختيار الإعدادات قبل الحفظ كـ PDF</p>
            </div>
          </div>
        </div>
      </div>

      {/* Share Menu Dropdown (Overlay) */}
      {isShareMenuOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40" onClick={() => setIsShareMenuOpen(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <h4 className="font-black text-center text-slate-800">مشاركة الشهادة</h4>
            <div className="grid grid-cols-2 gap-3">
               <button onClick={copyToClipboard} className="p-4 bg-stone-50 rounded-2xl hover:bg-stone-100 transition-all flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${copySuccess ? 'bg-green-600 text-white' : 'bg-stone-200 text-stone-600'}`}>
                    {copySuccess ? '✓' : '📋'}
                  </div>
                  <span className="text-[10px] font-bold">{copySuccess ? 'تم النسخ' : 'نسخ الرابط'}</span>
               </button>
               <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')} className="p-4 bg-stone-50 rounded-2xl hover:bg-stone-100 transition-all flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">X</div>
                  <span className="text-[10px] font-bold">تويتر</span>
               </button>
            </div>
            <button onClick={() => setIsShareMenuOpen(false)} className="w-full py-3 text-slate-400 text-xs font-bold">إغلاق</button>
          </div>
        </div>
      )}
    </div>
  );
};
