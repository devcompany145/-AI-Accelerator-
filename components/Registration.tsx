
import React, { useState } from 'react';
import { UserProfile, ProjectEvaluationResult, ApplicantProfile } from '../types';
import { evaluateProjectIdea } from '../services/geminiService';
import { playPositiveSound, playCelebrationSound, playErrorSound } from '../services/audioService';

interface RegistrationProps {
  onRegister: (profile: UserProfile) => void;
}

const INDUSTRIES = [
  { value: 'Technology', label: 'تقنية وتكنولوجيا' },
  { value: 'E-commerce', label: 'تجارة إلكترونية' },
  { value: 'Health', label: 'صحة وطب' },
  { value: 'Education', label: 'تعليم' },
  { value: 'Food', label: 'أغذية ومشروبات' },
  { value: 'Services', label: 'خدمات' },
  { value: 'RealEstate', label: 'عقارات وإنشاءات' },
  { value: 'Finance', label: 'مالية واستثمار' },
  { value: 'Tourism', label: 'سياحة وسفر' },
  { value: 'Agriculture', label: 'زراعة' },
  { value: 'Manufacturing', label: 'صناعة وإنتاج' },
  { value: 'Media', label: 'إعلام وتسويق' },
  { value: 'Logistics', label: 'لوجستيات ونقل' },
  { value: 'Energy', label: 'طاقة وبيئة' },
  { value: 'Fashion', label: 'أزياء وموضة' },
  { value: 'Other', label: 'أخرى' }
];

export const Registration: React.FC<RegistrationProps> = ({ onRegister }) => {
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    startupName: '',
    startupDescription: '',
    industry: 'Technology'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ProjectEvaluationResult | null>(null);

  const filteredIndustries = INDUSTRIES.filter(ind => 
    ind.label.includes(searchTerm)
  );

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'يرجى إدخل اسم رائد الأعمال';
    if (!formData.startupName.trim()) newErrors.startupName = 'يرجى إدخال اسم المشروع';
    if (!formData.startupDescription.trim()) {
      newErrors.startupDescription = 'يرجى إدخال وصف الفكرة';
    } else if (formData.startupDescription.length < 20) {
      newErrors.startupDescription = 'وصف الفكرة قصير جداً (يجب أن يكون 20 حرفاً على الأقل)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAnalyzeIdea = async () => {
    if (!formData.startupDescription || formData.startupDescription.length < 20) {
      setErrors(prev => ({ ...prev, startupDescription: 'يرجى كتابة 20 حرفاً على الأقل للتحليل' }));
      playErrorSound();
      return;
    }
    
    setErrors(prev => ({ ...prev, startupDescription: '' }));
    setIsAnalyzing(true);
    playPositiveSound();

    try {
      const tempProfile: ApplicantProfile = {
        codeName: formData.name,
        projectStage: 'Idea',
        sector: formData.industry,
        goal: 'Registration Analysis',
        techLevel: 'Medium'
      };

      const result = await evaluateProjectIdea(formData.startupDescription, tempProfile);
      setAnalysisResult(result);
      playCelebrationSound();
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onRegister(formData);
    } else {
      playErrorSound();
    }
  };

  const getClassColor = (cls: string) => {
    switch (cls) {
      case 'Green': return 'bg-green-50 border-green-200 text-green-800';
      case 'Yellow': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'Red': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const descLength = formData.startupDescription.length;
  const isDescValid = descLength >= 20;

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side - Visual & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-900 overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 z-0 opacity-20">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="url(#grad)" />
             <defs>
               <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                 <stop offset="0%" style={{stopColor:'white', stopOpacity:1}} />
                 <stop offset="100%" style={{stopColor:'transparent', stopOpacity:0}} />
               </linearGradient>
             </defs>
          </svg>
        </div>
        
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-wide">AI Accelerator</span>
          </div>
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            ابدأ رحلة <br/> نجاحك اليوم.
          </h1>
          <p className="text-blue-100 text-lg max-w-md leading-relaxed">
            انضم إلى برنامج مسرعة الأعمال الأول من نوعه الذي يدمج الذكاء الاصطناعي في كل خطوة من خطوات تأسيس مشروعك.
          </p>
        </div>

        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg">
            <div className="flex gap-1 mb-3">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm font-medium italic opacity-90">"تجربة فريدة نقلت مشروعي من مجرد فكرة على ورق إلى شركة ناشئة جاهزة للاستثمار في أقل من شهرين."</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-300"></div>
              <div>
                <p className="text-xs font-bold">سارة أحمد</p>
                <p className="text-[10px] opacity-75">مؤسسة TechHome</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative overflow-y-auto">
        <div className="max-w-md w-full animate-fade-in-up">
           <div className="lg:hidden mb-8 text-center">
             <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg transform rotate-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">مسرعة الأعمال الذكية</h2>
           </div>

           <div className="mb-10">
             <h2 className="text-3xl font-bold text-gray-900 mb-2">تسجيل رائد أعمال</h2>
             <p className="text-gray-500">أدخل بياناتك وبيانات مشروعك للبدء.</p>
           </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">اسم رائد الأعمال</label>
              <div className="relative">
                <input
                  type="text"
                  className={`w-full pl-4 pr-10 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 outline-none transition-all duration-200 
                    ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-500/20 focus:border-blue-500'}`}
                  placeholder="الاسم الثلاثي"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                />
                <div className="absolute left-3 top-3.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1 mr-1 animate-pulse">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">اسم المشروع</label>
                <div className="relative">
                  <input
                    type="text"
                    className={`w-full pl-4 pr-10 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 outline-none transition-all duration-200 
                      ${errors.startupName ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-500/20 focus:border-blue-500'}`}
                    placeholder="اسم الشركة الناشئة"
                    value={formData.startupName}
                    onChange={(e) => {
                      setFormData({ ...formData, startupName: e.target.value });
                      if (errors.startupName) setErrors({ ...errors, startupName: '' });
                    }}
                  />
                   <div className="absolute left-3 top-3.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                {errors.startupName && <p className="text-red-500 text-xs mt-1 mr-1 animate-pulse">{errors.startupName}</p>}
              </div>

              <div className="group relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">المجال</label>
                
                {isDropdownOpen && (
                  <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />
                )}

                <div className="relative z-40">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(!isDropdownOpen);
                      if (!isDropdownOpen) setSearchTerm('');
                    }}
                    className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-right flex items-center justify-between text-gray-800"
                  >
                    <span className="truncate">
                      {INDUSTRIES.find(i => i.value === formData.industry)?.label || formData.industry}
                    </span>
                    <div className="absolute left-3 top-3.5 text-gray-400 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-hidden flex flex-col animate-fade-in-up">
                      <div className="p-2 border-b border-gray-100 bg-gray-50/50">
                         <div className="relative">
                           <input
                              type="text"
                              autoFocus
                              placeholder="ابحث عن المجال..."
                              className="w-full pl-3 pr-9 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              onClick={(e) => e.stopPropagation()} 
                           />
                           <div className="absolute right-3 top-2.5 text-gray-400">
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                             </svg>
                           </div>
                         </div>
                      </div>
                      <div className="overflow-y-auto flex-1 p-1">
                         {filteredIndustries.length > 0 ? (
                           filteredIndustries.map((ind) => (
                              <div
                                key={ind.value}
                                onClick={() => {
                                  setFormData({ ...formData, industry: ind.value });
                                  setIsDropdownOpen(false);
                                }}
                                className={`px-4 py-2.5 rounded-lg text-sm cursor-pointer transition-colors flex items-center justify-between
                                  ${formData.industry === ind.value ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-50 text-gray-700'}
                                `}
                              >
                                {ind.label}
                                {formData.industry === ind.value && (
                                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                           ))
                         ) : (
                           <div className="p-4 text-center text-gray-400 text-sm">
                             لا توجد نتائج
                           </div>
                         )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700 group-focus-within:text-blue-600 transition-colors">
                  وصف الفكرة
                </label>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors duration-300 ${isDescValid ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {descLength} / 20 حرف كحد أدنى
                </span>
              </div>
              <div className="relative">
                <textarea
                  rows={4}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 outline-none transition-all duration-200 resize-none 
                    ${errors.startupDescription ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-500/20 focus:border-blue-500'}`}
                  placeholder="اشرح المشكلة التي تحلها والحل المقترح..."
                  value={formData.startupDescription}
                  onChange={(e) => {
                    setFormData({ ...formData, startupDescription: e.target.value });
                    if (errors.startupDescription) setErrors({ ...errors, startupDescription: '' });
                    if (analysisResult) setAnalysisResult(null);
                  }}
                />
                <div className="absolute bottom-0 right-0 left-0 h-1 overflow-hidden rounded-b-xl pointer-events-none">
                  <div 
                    className={`h-full transition-all duration-500 ${isDescValid ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-blue-400 opacity-40'}`} 
                    style={{ width: `${Math.min((descLength / 20) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              {errors.startupDescription && <p className="text-red-500 text-xs mt-1 mr-1 animate-pulse">{errors.startupDescription}</p>}
              
              {/* AI Analysis Button */}
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleAnalyzeIdea}
                  disabled={isAnalyzing}
                  className="text-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      جاري التحليل...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      تحليل الفكرة بالذكاء الاصطناعي
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Analysis Result Display */}
            {analysisResult && (
              <div className={`rounded-xl border p-5 animate-fade-in-up ${getClassColor(analysisResult.classification)}`}>
                 <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold flex items-center gap-2">
                      <span className="text-xl">🤖</span>
                      نتيجة تحليل الفكرة
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      analysisResult.classification === 'Green' ? 'bg-green-200 text-green-800' :
                      analysisResult.classification === 'Yellow' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'
                    }`}>
                       {analysisResult.totalScore}/100 - {
                         analysisResult.classification === 'Green' ? 'فكرة واعدة' :
                         analysisResult.classification === 'Yellow' ? 'تحتاج تطوير' : 'غير واضحة'
                       }
                    </div>
                 </div>
                 <p className="text-sm opacity-90 leading-relaxed mb-4">
                   "{analysisResult.aiOpinion}"
                 </p>
                 
                 {/* Mini Stats */}
                 <div className="grid grid-cols-2 gap-3 text-xs">
                   <div>
                     <span className="block opacity-70">الجدوى السوقية</span>
                     <div className="w-full bg-black/5 h-1.5 rounded-full mt-1">
                       <div className="bg-current h-1.5 rounded-full" style={{width: `${(analysisResult.market / 20) * 100}%`}}></div>
                     </div>
                   </div>
                   <div>
                     <span className="block opacity-70">الابتكار</span>
                     <div className="w-full bg-black/5 h-1.5 rounded-full mt-1">
                       <div className="bg-current h-1.5 rounded-full" style={{width: `${(analysisResult.innovation / 20) * 100}%`}}></div>
                     </div>
                   </div>
                 </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
            >
              <span>إنشاء حساب وبدء البرنامج</span>
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-4">
              بالتسجيل، أنت توافق على شروط الاستخدام وسياسة الخصوصية
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
