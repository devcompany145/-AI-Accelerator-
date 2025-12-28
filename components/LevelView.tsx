
import React, { useState, useEffect } from 'react';
import { LevelData, UserProfile, Question } from '../types';
import { generateLevelMaterial, generateLevelQuiz, evaluateExerciseResponse } from '../services/geminiService';
import { playPositiveSound, playCelebrationSound, playErrorSound } from '../services/audioService';

interface LevelViewProps {
  level: LevelData;
  user: UserProfile;
  onComplete: () => void;
  onBack: () => void;
}

enum Step {
  LOADING_CONTENT,
  LEARN,
  EXERCISE,
  LOADING_QUIZ,
  QUIZ,
  COMPLETED
}

export const LevelView: React.FC<LevelViewProps> = ({ level, user, onComplete, onBack }) => {
  const [step, setStep] = useState<Step>(Step.LOADING_CONTENT);
  const [content, setContent] = useState<string>('');
  const [exercisePrompt, setExercisePrompt] = useState<string>('');
  const [exerciseAnswer, setExerciseAnswer] = useState<string>('');
  const [exerciseFeedback, setExerciseFeedback] = useState<string>('');
  const [isExerciseSubmitting, setIsExerciseSubmitting] = useState(false);
  
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Scroll Progress State
  const [readingProgress, setReadingProgress] = useState(0);

  // Load content on mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await generateLevelMaterial(level.id, level.title, user);
        setContent(data.content);
        setExercisePrompt(data.exercise);
        setStep(Step.LEARN);
      } catch (err) {
        console.error(err);
      }
    };
    loadContent();
  }, [level.id, level.title, user]);

  // Track Reading Progress
  useEffect(() => {
    const handleScroll = () => {
      if (step !== Step.LEARN) {
        setReadingProgress(0);
        return;
      }
      
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      
      if (totalHeight <= 0) {
        setReadingProgress(100);
      } else {
        const progress = (currentScroll / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [step]);

  const handleExerciseSubmit = async () => {
    if (!exerciseAnswer.trim()) return;
    setIsExerciseSubmitting(true);
    try {
      const result = await evaluateExerciseResponse(exercisePrompt, exerciseAnswer);
      setExerciseFeedback(result.feedback);
      if (result.passed) {
        playPositiveSound();
      } else {
        playErrorSound();
      }
    } catch (e) {
      setExerciseFeedback("حدث خطأ. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsExerciseSubmitting(false);
    }
  };

  const startQuiz = async () => {
    setStep(Step.LOADING_QUIZ);
    try {
      const questions = await generateLevelQuiz(level.id, level.title, user);
      setQuizQuestions(questions);
      setQuizAnswers(new Array(questions.length).fill(-1));
      setStep(Step.QUIZ);
    } catch (e) {
      console.error(e);
      setStep(Step.LEARN); 
    }
  };

  const handleQuizSubmit = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (q.correctIndex === quizAnswers[idx]) score++;
    });
    setQuizScore(score);

    const passingScore = Math.ceil(quizQuestions.length * 0.6); 
    if (score >= passingScore) {
       playCelebrationSound();
       setTimeout(() => {
         setStep(Step.COMPLETED);
       }, 3000); 
    } else {
      playErrorSound();
    }
  };

  // Helper for Stepper UI
  const getStepStatus = (targetStep: number) => {
    let current = 0;
    if (step === Step.LEARN) current = 1;
    if (step === Step.EXERCISE) current = 2;
    if (step === Step.LOADING_QUIZ || step === Step.QUIZ) current = 3;
    if (step === Step.COMPLETED) current = 4;

    if (current > targetStep) return 'completed';
    if (current === targetStep) return 'current';
    return 'pending';
  };

  // Calculate Overall completion percentage for the level
  const calculateOverallProgress = () => {
    switch(step) {
      case Step.LOADING_CONTENT: return 0;
      case Step.LEARN: return 10 + (readingProgress * 0.23); // Max ~33%
      case Step.EXERCISE: return 33 + (exerciseFeedback ? 33 : 15); // Max ~66%
      case Step.LOADING_QUIZ: return 70;
      case Step.QUIZ: return 75 + (quizAnswers.filter(a => a !== -1).length / (quizQuestions.length || 1) * 20); // Max ~95%
      case Step.COMPLETED: return 100;
      default: return 0;
    }
  };

  const overallProgress = calculateOverallProgress();

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      <style>{`
        @keyframes aero-in {
          0% { opacity: 0; transform: translateY(30px) scale(0.96) skewX(-1deg); }
          60% { opacity: 1; transform: translateY(-5px) scale(1.005) skewX(0.5deg); }
          100% { transform: translateY(0) scale(1) skewX(0); }
        }
        .animate-aero-in {
          animation: aero-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        @keyframes aero-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-aero-float {
          animation: aero-float 4s ease-in-out infinite;
        }

        @keyframes pulse-ring {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        .animate-pulse-ring {
          animation: pulse-ring 2s infinite;
        }
      `}</style>

      {/* Top Bar */}
      <div className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-30 transition-all duration-500 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={onBack} className="p-2 -mr-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-5 h-5 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="flex flex-col">
              <h2 className="font-bold text-gray-800 text-sm md:text-base leading-none">{level.title}</h2>
              <span className="text-[10px] text-blue-600 font-bold mt-1 md:hidden">إنجاز المستوى: {Math.round(overallProgress)}%</span>
            </div>
          </div>

          {/* Stepper (Desktop) */}
          <div className="hidden md:flex items-center gap-2 text-sm font-medium">
             {[
               { id: 1, label: 'التعلم' },
               { id: 2, label: 'التطبيق' },
               { id: 3, label: 'الاختبار' }
             ].map((s, idx) => {
               const status = getStepStatus(s.id);
               return (
                 <div key={s.id} className="flex items-center">
                   {idx > 0 && <div className={`w-8 h-0.5 mx-2 rounded-full ${status === 'pending' ? 'bg-gray-200' : 'bg-green-500'}`}></div>}
                   <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors
                     ${status === 'current' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-500' : ''}
                     ${status === 'completed' ? 'text-green-600' : ''}
                     ${status === 'pending' ? 'text-gray-400' : ''}
                   `}>
                     <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border transition-all duration-300
                        ${status === 'current' ? 'border-blue-500 bg-blue-500 text-white shadow-md transform scale-110' : ''}
                        ${status === 'completed' ? 'border-green-500 bg-green-500 text-white' : ''}
                        ${status === 'pending' ? 'border-gray-300' : ''}
                     `}>
                       {status === 'completed' ? (
                         <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                         </svg>
                       ) : s.id}
                     </div>
                     <span>{s.label}</span>
                   </div>
                 </div>
               )
             })}
          </div>
        </div>

        {/* Global Level Progress Bar - Always Visible */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100/50">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(37,99,235,0.4)]" 
            style={{ width: `${overallProgress}%` }}
          >
             <div className="w-full h-full bg-white/30 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8">
        
        {step === Step.LOADING_CONTENT && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center animate-aero-float">
                 <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                 </svg>
              </div>
            </div>
            <p className="text-gray-500 font-medium animate-pulse">جاري تحضير المحتوى التدريبي الخاص بمشروعك...</p>
          </div>
        )}

        {step === Step.LEARN && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-aero-in group hover:shadow-xl transition-all duration-500">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-blue-100/50 flex flex-col md:flex-row md:items-center gap-4">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 animate-aero-float">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                   </svg>
                 </div>
                 <div>
                   <h3 className="text-2xl font-bold text-gray-900">المادة التعليمية</h3>
                   <p className="text-gray-500 mt-1">اقرأ المحتوى التالي بعناية، فهو مخصص لمجال عملك.</p>
                 </div>
               </div>
               {/* Contextual Reading Percent */}
               <div className="md:mr-auto flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full border border-blue-100">
                 <span className="text-xs font-bold text-blue-700">تقدم القراءة: {Math.round(readingProgress)}%</span>
                 <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${readingProgress}%` }}></div>
                 </div>
               </div>
            </div>
            <div className="p-8 md:p-10">
              <article className="prose prose-lg prose-indigo prose-headings:font-bold prose-p:text-gray-600 prose-li:text-gray-600 max-w-none">
                {content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4 leading-8 transition-opacity duration-700 delay-100" style={{ animationDelay: `${idx * 100}ms` }}>{paragraph}</p>
                ))}
              </article>
              <div className="mt-12 flex justify-end pt-6 border-t border-gray-100">
                <button 
                  onClick={() => {
                    playPositiveSound();
                    setStep(Step.EXERCISE);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-blue-200 transition-all transform hover:-translate-y-1 hover:scale-105 flex items-center gap-2 active:scale-95"
                >
                  <span>التالي: التطبيق العملي</span>
                  <svg className="w-5 h-5 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {step === Step.EXERCISE && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-aero-in">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-8 py-6 border-b border-yellow-100/50 flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg text-yellow-700 animate-aero-float">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                 </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">تمرين عملي</h3>
                <p className="text-yellow-800/70 text-sm">طبق ما تعلمته على مشروعك</p>
              </div>
            </div>
            
            <div className="p-8 md:p-10">
              <p className="text-xl text-gray-800 mb-6 font-medium leading-relaxed">{exercisePrompt}</p>
              
              <div className="relative group transform transition-transform duration-300 hover:scale-[1.01]">
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-t-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                <textarea
                  className="w-full p-6 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-0 focus:border-blue-100 outline-none min-h-[200px] mb-6 text-lg transition-all shadow-inner hover:shadow-md"
                  placeholder="اكتب إجابتك هنا بتفصيل..."
                  value={exerciseAnswer}
                  onChange={(e) => setExerciseAnswer(e.target.value)}
                  disabled={!!exerciseFeedback}
                />
              </div>

              {exerciseFeedback && (
                <div className={`mb-8 p-6 rounded-2xl border animate-aero-in ${exerciseFeedback.includes("مقبولة") || exerciseFeedback.includes("جيد") ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-900">تقييم المرشد الذكي</h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{exerciseFeedback}</p>
                </div>
              )}

              <div className="flex justify-end gap-4">
                {!exerciseFeedback ? (
                  <button 
                    onClick={handleExerciseSubmit}
                    disabled={isExerciseSubmitting || !exerciseAnswer.trim()}
                    className="bg-gray-900 hover:bg-black disabled:bg-gray-300 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95"
                  >
                    {isExerciseSubmitting ? 'جاري التحليل...' : 'إرسال الإجابة للتقييم'}
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      playPositiveSound();
                      startQuiz();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-green-200 transform hover:-translate-y-1 animate-pulse"
                  >
                    الانتقال للاختبار النهائي
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {step === Step.LOADING_QUIZ && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="text-gray-500">جاري إعداد أسئلة الاختبار...</p>
          </div>
        )}

        {step === Step.QUIZ && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-aero-in">
             <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-8 py-6 border-b border-purple-100/50 flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/50 rounded-lg flex items-center justify-center text-purple-600 animate-aero-float">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">اختبار المعلومات</h3>
                    <p className="text-purple-900/60 text-sm">أجب على جميع الأسئلة لتجاوز المستوى</p>
                  </div>
               </div>
               <span className="bg-white text-purple-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border border-purple-100">
                 {quizQuestions.length} أسئلة
               </span>
             </div>

             <div className="p-8 md:p-10 space-y-10">
               {quizQuestions.map((q, qIdx) => (
                 <div key={q.id} className="relative transition-all duration-500 hover:translate-x-1" style={{ transitionDelay: `${qIdx * 100}ms` }}>
                   <div className="flex items-start gap-4 mb-4">
                     <span className="flex-shrink-0 w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                       {qIdx + 1}
                     </span>
                     <p className="font-bold text-lg text-gray-800 leading-relaxed pt-1">{q.text}</p>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                     {q.options.map((opt, optIdx) => {
                       const isSelected = quizAnswers[qIdx] === optIdx;
                       const isCorrect = q.correctIndex === optIdx;
                       const isSubmitted = quizScore !== null;
                       
                       let containerClass = "border-gray-200 hover:border-purple-300 hover:bg-purple-50/50";
                       
                       if (isSubmitted) {
                         if (isCorrect) containerClass = "bg-green-100 border-green-500 ring-1 ring-green-500";
                         else if (isSelected) containerClass = "bg-red-50 border-red-300 opacity-60";
                         else containerClass = "border-gray-100 opacity-40 bg-gray-50";
                       } else if (isSelected) {
                         containerClass = "bg-purple-50 border-purple-500 ring-1 ring-purple-500 shadow-sm transform scale-[1.02]";
                       }

                       return (
                        <label 
                          key={optIdx} 
                          className={`
                            relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                            ${containerClass}
                          `}
                        >
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            className="hidden"
                            disabled={isSubmitted}
                            onChange={() => {
                              const newAnswers = [...quizAnswers];
                              newAnswers[qIdx] = optIdx;
                              setQuizAnswers(newAnswers);
                            }}
                          />
                          <div className={`w-5 h-5 rounded-full border-2 flex flex-shrink-0 items-center justify-center mr-0 ml-3 transition-colors
                              ${isSubmitted && isCorrect ? 'border-green-600 bg-green-600' : ''}
                              ${isSubmitted && isSelected && !isCorrect ? 'border-red-500 bg-red-500' : ''}
                              ${!isSubmitted && isSelected ? 'border-purple-600' : 'border-gray-300'}
                          `}>
                             {isSubmitted && isCorrect && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>}
                             {isSubmitted && isSelected && !isCorrect && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg>}
                             {!isSubmitted && isSelected && <div className="w-2.5 h-2.5 bg-purple-600 rounded-full" />}
                          </div>
                          <span className={`font-medium ${isSubmitted && isCorrect ? 'text-green-900' : 'text-gray-700'}`}>
                            {opt}
                          </span>
                        </label>
                       );
                     })}
                   </div>
                   
                   {/* Explanation */}
                   {quizScore !== null && (
                     <div className={`mt-4 ml-0 md:ml-0 md:mr-12 p-4 rounded-xl text-sm border-r-4 shadow-sm animate-aero-in
                       ${quizAnswers[qIdx] === q.correctIndex 
                         ? 'bg-green-50 border-green-500 text-green-900' 
                         : 'bg-red-50 border-red-500 text-red-900'}
                     `}>
                       <div className="flex items-center gap-2 mb-2 font-bold">
                          {quizAnswers[qIdx] === q.correctIndex 
                            ? <span className="text-green-600 flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> أحسنت! إجابة صحيحة</span> 
                            : <span className="text-red-600 flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> إجابة خاطئة</span>}
                       </div>
                       <p className="opacity-90 leading-relaxed">{q.explanation}</p>
                     </div>
                   )}
                 </div>
               ))}
             </div>

             {/* Footer / Results */}
             <div className="bg-gray-50 p-6 md:p-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                {quizScore !== null ? (
                   <div className="flex items-center gap-4 w-full md:w-auto">
                     <div className={`text-2xl font-bold ${quizScore >= Math.ceil(quizQuestions.length * 0.6) ? 'text-green-600' : 'text-red-600'}`}>
                       النتيجة: {quizScore} / {quizQuestions.length}
                     </div>
                     {quizScore < Math.ceil(quizQuestions.length * 0.6) && (
                       <button
                         onClick={() => {
                           setQuizAnswers(new Array(quizQuestions.length).fill(-1));
                           setQuizScore(null);
                         }}
                         className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-bold shadow-sm transition-colors"
                       >
                         إعادة المحاولة
                       </button>
                     )}
                   </div>
                ) : (
                  <div className="text-gray-400 text-sm hidden md:block">راجع إجاباتك قبل التسليم</div>
                )}

                <div className="w-full md:w-auto">
                   {quizScore === null ? (
                      <button
                        onClick={handleQuizSubmit}
                        disabled={quizAnswers.includes(-1)}
                        className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-purple-200 transform hover:-translate-y-0.5 active:scale-95"
                      >
                        تسليم الإجابات
                      </button>
                   ) : (
                      quizScore >= Math.ceil(quizQuestions.length * 0.6) && (
                        <div className="flex items-center text-green-600 font-bold animate-pulse">
                           <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                           </svg>
                           جاري إتمام المستوى...
                        </div>
                      )
                   )}
                </div>
             </div>
          </div>
        )}

        {step === Step.COMPLETED && (
           <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-3xl p-12 text-center shadow-xl animate-aero-in border border-gray-100">
             <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 shadow-inner animate-aero-float">
               <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
               </svg>
             </div>
             <h2 className="text-4xl font-extrabold text-gray-900 mb-4">مذهل!</h2>
             <p className="text-xl text-gray-600 mb-10 max-w-md mx-auto">لقد أتممت المستوى "{level.title}" بنجاح، أنت تقترب خطوة أخرى من هدفك.</p>
             <button
               onClick={() => {
                 playPositiveSound();
                 onComplete();
               }}
               className="bg-gray-900 hover:bg-black text-white px-10 py-4 rounded-xl font-bold shadow-xl transform hover:scale-105 transition-all active:scale-95"
             >
               العودة للوحة التحكم
             </button>
           </div>
        )}
      </div>
    </div>
  );
};
