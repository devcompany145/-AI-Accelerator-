
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface CertificateProps {
  user: UserProfile;
  onClose: () => void;
}

const TEMPLATES = {
  classic: {
    id: 'classic',
    name: 'كلاسيكي ذهبي',
    previewColor: 'bg-[#F9F6F0]',
    styles: {
      containerBg: 'bg-[#F9F6F0]',
      outerBorder: 'border-[#8C7355]',
      innerBorder: 'border-[#C5A059]/40',
      innerBorder2: 'border-[#C5A059]/20',
      textTitle: 'text-[#4A3F35]',
      textBody: 'text-[#6B5E51]',
      textName: 'text-[#2D241E]',
      accent: 'text-[#967B4F]',
      sealBorder: 'border-[#C5A059]',
      sealBg: 'bg-gradient-to-br from-[#FDFBF7] to-[#F1E9DB]',
      sealIcon: 'text-[#B8860B]',
      sealText: 'text-[#4A3F35]',
      sealSubText: 'text-[#967B4F]',
      logoBg: 'bg-[#4A3F35]',
      logoBorder: 'border-[#C5A059]',
      logoIcon: 'text-[#F1E9DB]',
      cornerBorder: 'border-[#8C7355]',
      cornerInner: 'border-[#C5A059]/50',
      patternFill: '#C5A059',
      watermarkClass: 'text-[#8C7355]'
    }
  },
  modern: {
    id: 'modern',
    name: 'فضي عصري',
    previewColor: 'bg-slate-50',
    styles: {
      containerBg: 'bg-slate-50',
      outerBorder: 'border-slate-400',
      innerBorder: 'border-slate-300/40',
      innerBorder2: 'border-slate-300/20',
      textTitle: 'text-slate-800',
      textBody: 'text-slate-600',
      textName: 'text-slate-900',
      accent: 'text-slate-500',
      sealBorder: 'border-slate-400',
      sealBg: 'bg-gradient-to-br from-white to-slate-100',
      sealIcon: 'text-slate-500',
      sealText: 'text-slate-800',
      sealSubText: 'text-slate-500',
      logoBg: 'bg-slate-800',
      logoBorder: 'border-slate-400',
      logoIcon: 'text-white',
      cornerBorder: 'border-slate-400',
      cornerInner: 'border-slate-300',
      patternFill: '#94a3b8',
      watermarkClass: 'text-slate-400'
    }
  },
  elegant: {
    id: 'elegant',
    name: 'بيج ملكي',
    previewColor: 'bg-[#F2EFE9]',
    styles: {
      containerBg: 'bg-[#F2EFE9]',
      outerBorder: 'border-[#5D574F]',
      innerBorder: 'border-[#A39B8F]',
      innerBorder2: 'border-[#D1CDC5]',
      textTitle: 'text-[#3D3832]',
      textBody: 'text-[#5D574F]',
      textName: 'text-[#2D2A26]',
      accent: 'text-[#8C8375]',
      sealBorder: 'border-[#8C8375]',
      sealBg: 'bg-[#EAE5DC]',
      sealIcon: 'text-[#5D574F]',
      sealText: 'text-[#3D3832]',
      sealSubText: 'text-[#5D574F]',
      logoBg: 'bg-[#3D3832]',
      logoBorder: 'border-[#8C8375]',
      logoIcon: 'text-[#F2EFE9]',
      cornerBorder: 'border-[#5D574F]',
      cornerInner: 'border-[#A39B8F]',
      patternFill: '#A39B8F',
      watermarkClass: 'text-[#3D3832]'
    }
  },
  creative: {
    id: 'creative',
    name: 'إبداعي هادئ',
    previewColor: 'bg-[#F8F5F2]',
    styles: {
      containerBg: 'bg-[#F8F5F2]',
      outerBorder: 'border-[#4A4A4A]',
      innerBorder: 'border-[#D4AF37]/40',
      innerBorder2: 'border-[#D4AF37]/20',
      textTitle: 'text-[#2C2C2C]',
      textBody: 'text-[#555555]',
      textName: 'text-transparent bg-clip-text bg-gradient-to-r from-[#8C7355] to-[#C5A059]',
      accent: 'text-[#C5A059]',
      sealBorder: 'border-[#C5A059]',
      sealBg: 'bg-white',
      sealIcon: 'text-[#C5A059]',
      sealText: 'text-[#2C2C2C]',
      sealSubText: 'text-[#C5A059]',
      logoBg: 'bg-gradient-to-r from-[#4A4A4A] to-[#2C2C2C]',
      logoBorder: 'border-[#C5A059]',
      logoIcon: 'text-white',
      cornerBorder: 'border-[#4A4A4A]',
      cornerInner: 'border-[#C5A059]',
      patternFill: '#C5A059',
      watermarkClass: 'text-[#2C2C2C]'
    }
  }
};

type TemplateKey = keyof typeof TEMPLATES;

export const Certificate: React.FC<CertificateProps> = ({ user, onClose }) => {
  const [activeTemplate, setActiveTemplate] = useState<TemplateKey>('classic');
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const theme = TEMPLATES[activeTemplate].styles;

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

  const shareViaTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareViaLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareViaWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
  };

  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent('شهادة تخرج من مسرعة الأعمال الذكية')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
      <style>{`
        @keyframes cert-pop {
          0% { opacity: 0; transform: scale(0.9) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-cert-pop {
          animation: cert-pop 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes glow-pulse {
          0%, 100% { 
            box-shadow: 0 0 10px rgba(197, 160, 89, 0.1), 0 0 5px rgba(197, 160, 89, 0.05) inset;
            filter: brightness(1) drop-shadow(0 0 2px rgba(197, 160, 89, 0.2));
          }
          50% { 
            box-shadow: 0 0 40px rgba(197, 160, 89, 0.3), 0 0 20px rgba(197, 160, 89, 0.1) inset;
            filter: brightness(1.1) drop-shadow(0 0 6px rgba(197, 160, 89, 0.3));
          }
        }
        .animate-logo-glow {
          animation: glow-pulse 4s infinite ease-in-out;
        }
        @keyframes shimmer-slide {
          0% { transform: translateX(-150%) skewX(-15deg); }
          50% { transform: translateX(150%) skewX(-15deg); }
          100% { transform: translateX(150%) skewX(-15deg); }
        }
        .animate-shimmer-slide {
          animation: shimmer-slide 8s infinite ease-in-out;
        }
        @keyframes neural-pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.02); }
        }
        .animate-neural-pulse {
          animation: neural-pulse 6s infinite ease-in-out;
        }
        @keyframes circuit-flow {
          0% { stroke-dashoffset: 1000; opacity: 0.05; }
          50% { opacity: 0.15; }
          100% { stroke-dashoffset: 0; opacity: 0.05; }
        }
        .animate-circuit-flow {
          stroke-dasharray: 40, 60;
          animation: circuit-flow 35s linear infinite;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          #certificate-container, #certificate-container * {
            visibility: visible;
          }
          #certificate-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none;
            border: none;
            background: white !important;
            -webkit-print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="relative max-w-5xl w-full rounded-xl shadow-2xl animate-cert-pop flex flex-col bg-[#FDFBF7] max-h-[95vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full transition-colors z-30 no-print shadow-sm"
        >
          <svg className="w-6 h-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex-1 overflow-y-auto p-2 md:p-8 bg-[#FDFBF7]">
           <div id="certificate-container" className={`relative p-2 md:p-4 transition-colors duration-500 ${theme.containerBg}`}>
          <div className={`relative border-[16px] border-double p-8 md:p-12 text-center overflow-hidden min-h-[700px] flex flex-col justify-between shadow-inner transition-colors duration-500 ${theme.outerBorder} ${theme.containerBg}`}>
            
            <div className={`absolute inset-2 border pointer-events-none z-10 transition-colors duration-500 ${theme.innerBorder}`}></div>
            <div className={`absolute inset-3 border pointer-events-none z-10 transition-colors duration-500 ${theme.innerBorder2}`}></div>

            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden no-print">
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-slide"></div>
            </div>
            
            {/* Custom Muted AI-Themed Abstract Pattern */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0">
               <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                 <defs>
                   <pattern id="cert-pattern-classic" x="0" y="0" width="220" height="220" patternUnits="userSpaceOnUse">
                     {/* Muted Neural Nodes */}
                     <g className="animate-neural-pulse">
                       <circle cx="20" cy="20" r="2" fill={theme.patternFill} />
                       <circle cx="180" cy="50" r="1.5" fill={theme.patternFill} />
                       <circle cx="110" cy="110" r="3" fill={theme.patternFill} />
                       <circle cx="50" cy="170" r="1.5" fill={theme.patternFill} />
                       <circle cx="160" cy="190" r="2.5" fill={theme.patternFill} />
                     </g>
                     
                     {/* Muted Circuit Paths */}
                     <path d="M20 20 L 110 110 L 180 50" stroke={theme.patternFill} strokeWidth="0.4" fill="none" className="animate-circuit-flow" />
                     <path d="M50 170 L 110 110 L 160 190" stroke={theme.patternFill} strokeWidth="0.4" fill="none" className="animate-circuit-flow" style={{ animationDelay: '2s' }} />
                     
                     {/* Subtle Grid */}
                     <path d="M0 110 H 220" stroke={theme.patternFill} strokeWidth="0.1" opacity="0.3" />
                     <path d="M110 0 V 220" stroke={theme.patternFill} strokeWidth="0.1" opacity="0.3" />
                   </pattern>
                 </defs>
                 <rect width="100%" height="100%" fill="url(#cert-pattern-classic)" />
               </svg>
            </div>
            
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.02] ${theme.watermarkClass}`}>
               <svg viewBox="0 0 24 24" className="w-[500px] h-[500px] animate-neural-pulse" fill="currentColor">
                  <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 0 0-8 8c0 4.418 3.582 8 8 8s8-3.582 8-8-3.582-8-8-8zm-1 5h2v2h-2V9zm0 4h2v6h-2v-6z" /> 
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
            </div>

            <div className={`absolute top-0 left-0 w-32 h-32 border-t-[8px] border-l-[8px] z-10 transition-colors duration-500 ${theme.cornerBorder}`}>
                <div className={`absolute top-2 left-2 w-full h-full border-t-[1px] border-l-[1px] ${theme.cornerInner}`}></div>
            </div>
            <div className={`absolute top-0 right-0 w-32 h-32 border-t-[8px] border-r-[8px] z-10 transition-colors duration-500 ${theme.cornerBorder}`}>
                <div className={`absolute top-2 right-2 w-full h-full border-t-[1px] border-r-[1px] ${theme.cornerInner}`}></div>
            </div>
            <div className={`absolute bottom-0 left-0 w-32 h-32 border-b-[8px] border-l-[8px] z-10 transition-colors duration-500 ${theme.cornerBorder}`}>
                 <div className={`absolute bottom-2 left-2 w-full h-full border-t-[1px] border-l-[1px] ${theme.cornerInner}`}></div>
            </div>
            <div className={`absolute bottom-0 right-0 w-32 h-32 border-b-[8px] border-r-[8px] z-10 transition-colors duration-500 ${theme.cornerBorder}`}>
                 <div className={`absolute bottom-2 right-2 w-full h-full border-t-[1px] border-r-[1px] ${theme.cornerInner}`}></div>
            </div>

            <div className="relative z-10 pt-6">
               <div className="relative mx-auto w-28 h-28 mb-4">
                 {/* Muted Animated Glow */}
                 <div className={`absolute inset-0 rounded-full blur-2xl opacity-40 animate-logo-glow ${theme.logoBg.replace('bg-', 'bg-opacity-30 bg-')}`}></div>
                 <div className={`relative w-full h-full rounded-full flex items-center justify-center border-4 z-20 shadow-lg transition-all duration-500 animate-logo-glow ${theme.logoBg} ${theme.logoBorder}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-14 w-14 transition-colors duration-500 ${theme.logoIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                 </div>
                 
                 <div className={`absolute top-1/2 -left-16 w-16 h-0.5 opacity-10 ${theme.outerBorder.replace('border-', 'bg-')}`}></div>
                 <div className={`absolute top-1/2 -right-16 w-16 h-0.5 opacity-10 ${theme.outerBorder.replace('border-', 'bg-')}`}></div>
               </div>
               
               <h1 className={`text-6xl font-serif font-bold mb-2 tracking-wide transition-colors duration-500 ${theme.textTitle}`}>
                 شهادة تخرج
               </h1>
               <div className={`h-0.5 w-48 mx-auto mb-3 bg-gradient-to-r from-transparent via-current to-transparent opacity-40 ${theme.accent}`}></div>
               <p className={`font-bold tracking-[0.2em] text-[10px] uppercase transition-colors duration-500 ${theme.accent}`}>مسرعة الأعمال الذكية AI Accelerator</p>
            </div>

            <div className="my-10 space-y-6 relative z-10 flex-grow flex flex-col justify-center">
              <p className={`text-xl font-serif italic transition-colors duration-500 ${theme.textBody}`}>يشهد هذا المستند بأن</p>
              
              <div className="relative inline-block py-2">
                <h2 className={`text-5xl md:text-6xl font-bold font-serif px-8 pb-4 relative z-10 transition-colors duration-500 ${theme.textName}`}>
                  {user.name}
                </h2>
                <div className={`h-[1px] w-2/3 mx-auto relative mt-2 opacity-40 ${theme.accent.replace('text-', 'bg-')}`}>
                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border ${theme.containerBg} ${theme.accent.replace('text-', 'bg-')}`}></div>
                </div>
              </div>

              <p className={`text-lg font-serif italic max-w-3xl mx-auto leading-relaxed transition-colors duration-500 ${theme.textBody}`}>
                قد أتم بنجاح البرنامج التدريبي المتكامل لتأسيس وريادة الأعمال، وتمكن من بناء وتطوير مشروع
              </p>
              
              <div className="relative mt-2">
                 <h3 className={`relative text-3xl md:text-4xl font-bold py-2 px-10 inline-block mx-auto border-b transition-colors duration-500 ${theme.textTitle} ${theme.innerBorder2}`}>
                    "{user.startupName}"
                 </h3>
              </div>
              
              <p className={`max-w-4xl mx-auto mt-6 text-sm leading-relaxed font-serif transition-colors duration-500 ${theme.textBody}`}>
                تم منح هذه الشهادة بعد اجتياز <span className={`font-bold ${theme.textTitle}`}>6 مستويات تفاعلية مكثفة</span> تشمل التحقق من الفكرة، نموذج العمل التجاري، تحليل السوق، بناء المنتج الأولي، التخطيط المالي، ومهارات العرض والتمويل.
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-end mt-12 px-8 md:px-16 relative z-10 pb-6">
              <div className="text-center mb-8 md:mb-0">
                <p className={`text-[10px] mb-2 uppercase tracking-widest font-bold opacity-40 ${theme.accent}`}>التاريخ Date</p>
                <div className={`w-48 border-b mb-2 pb-2 text-lg font-medium font-serif ${theme.innerBorder} ${theme.textTitle}`}>
                  {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
              
              <div className="w-32 h-32 -mb-4 flex-shrink-0 mx-auto md:mx-0 order-last md:order-none relative">
                 <div className="w-full h-full relative flex items-center justify-center">
                   <div className={`w-full h-full border-[2px] rounded-full flex items-center justify-center relative shadow-md transition-colors duration-500 ${theme.sealBorder} ${theme.sealBg}`}>
                     <div className={`absolute inset-1 border border-dashed rounded-full opacity-20 ${theme.sealBorder}`}></div>
                     <div className="text-center z-10">
                       <svg className={`w-5 h-5 mx-auto mb-1 transition-colors duration-500 ${theme.sealIcon}`} fill="currentColor" viewBox="0 0 20 20">
                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                       </svg>
                       <span className={`block font-serif font-bold text-lg leading-none transition-colors duration-500 ${theme.sealText}`}>AI</span>
                       <span className={`block font-bold text-[7px] uppercase tracking-wider mt-0.5 transition-colors duration-500 ${theme.sealSubText}`}>Accelerator</span>
                     </div>
                   </div>
                 </div>
              </div>

              <div className="text-center mt-8 md:mt-0">
                 <p className={`text-[10px] mb-2 uppercase tracking-widest font-bold opacity-40 ${theme.accent}`}>المدير التنفيذي Director</p>
                 <div className={`w-48 border-b mb-2 pb-2 relative h-10 flex items-end justify-center ${theme.innerBorder}`}>
                    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgNjAiPjxwYXRoIGQ9Ik0xMCw1MCBDNDAsMTAgNjAsNTAgOTAsMjAgQzEyMCwwIDE1MCw0MCAxOTAsMTAiIHN0cm9rZT0iIzRBM0YzNSIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiIC8+PC9zdmc+" alt="Signature" className="h-10 w-auto opacity-50 grayscale" />
                 </div>
              </div>
            </div>
            
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-[8px] font-mono tracking-widest opacity-20">
                CERTIFICATE ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}-{Date.now().toString(36).toUpperCase()}
            </div>
          </div>
        </div>
        </div>

        <div className="bg-white p-6 border-t border-gray-100 no-print rounded-b-xl z-40">
           <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex-1 w-full overflow-hidden">
                 <p className="text-[10px] font-bold text-stone-400 mb-3 uppercase tracking-wider">اختر مظهر الشهادة</p>
                 <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {Object.entries(TEMPLATES).map(([key, tpl]) => (
                      <button
                        key={key}
                        onClick={() => setActiveTemplate(key as TemplateKey)}
                        className={`flex flex-col items-center gap-2 group min-w-[100px]`}
                      >
                        <div className={`w-24 h-16 rounded-xl border transition-all ${tpl.previewColor} ${activeTemplate === key ? 'border-[#C5A059] ring-4 ring-[#C5A059]/10 scale-105' : 'border-stone-100 group-hover:border-stone-200'}`}>
                           <div className="w-full h-full flex items-center justify-center opacity-20">
                              <div className="w-10 h-1 bg-stone-400 rounded-full"></div>
                           </div>
                        </div>
                        <span className={`text-[10px] font-bold ${activeTemplate === key ? 'text-[#C5A059]' : 'text-stone-400'}`}>
                          {tpl.name}
                        </span>
                      </button>
                    ))}
                 </div>
              </div>

              <div className="flex-shrink-0 w-full lg:w-auto flex flex-col md:flex-row gap-4 items-center relative">
                {/* Custom Share Dropdown */}
                {isShareMenuOpen && (
                  <div className="absolute bottom-full mb-4 right-0 w-64 bg-white border border-stone-200 rounded-2xl shadow-2xl p-3 z-50 flex flex-col gap-1 animate-cert-pop origin-bottom-right">
                    <button onClick={shareViaWhatsApp} className="flex items-center gap-3 p-3 hover:bg-green-50 text-stone-700 rounded-xl text-xs font-bold transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      </div>
                      واتساب (WhatsApp)
                    </button>
                    <button onClick={shareViaTwitter} className="flex items-center gap-3 p-3 hover:bg-sky-50 text-stone-700 rounded-xl text-xs font-bold transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                      </div>
                      تويتر (X)
                    </button>
                    <button onClick={shareViaLinkedIn} className="flex items-center gap-3 p-3 hover:bg-blue-50 text-stone-700 rounded-xl text-xs font-bold transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </div>
                      لينكد إن (LinkedIn)
                    </button>
                    <button onClick={shareViaEmail} className="flex items-center gap-3 p-3 hover:bg-amber-50 text-stone-700 rounded-xl text-xs font-bold transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      </div>
                      البريد الإلكتروني
                    </button>
                    <div className="h-px bg-stone-100 my-1 mx-2"></div>
                    <button onClick={copyToClipboard} className="flex items-center gap-3 p-3 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-bold transition-colors group">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${copySuccess ? 'bg-green-600 text-white' : 'bg-stone-100 text-stone-500 group-hover:bg-stone-800 group-hover:text-white'}`}>
                        {copySuccess ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                        )}
                      </div>
                      {copySuccess ? 'تم النسخ بنجاح!' : 'نسخ رابط الشهادة'}
                    </button>
                  </div>
                )}

                <button 
                  onClick={handleShare}
                  className="w-full md:w-auto bg-[#8C7355] hover:bg-[#735F46] text-white px-8 py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 font-bold transition-all transform hover:-translate-y-1 hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  مشاركة الإنجاز
                </button>

                <button 
                  onClick={() => window.print()} 
                  className="w-full md:w-auto bg-[#3D3832] hover:bg-[#2D2A26] text-white px-8 py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 font-bold transition-all transform hover:-translate-y-1 hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  طباعة (PDF)
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
