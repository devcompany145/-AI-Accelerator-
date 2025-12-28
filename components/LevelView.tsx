
import React, { useState, useEffect, useCallback } from 'react';
import { LevelData, UserProfile, Question } from '../types';
import { generateLevelMaterial, generateLevelQuiz, evaluateExerciseResponse } from '../services/geminiService';
import { playPositiveSound, playErrorSound, playCelebrationSound } from '../services/audioService';

interface LevelViewProps {
  level: LevelData;
  user: UserProfile;
  onComplete: () => void;
  onBack: () => void;
}

export const LevelView: React.FC<LevelViewProps> = ({ level, user, onComplete, onBack }) => {
  const [material, setMaterial] = useState<{ content: string; exercise: string } | null>(null);
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'exercise' | 'quiz'>('content');
  
  // Exercise state
  const [exerciseAnswer, setExerciseAnswer] = useState('');
  const [exerciseFeedback, setExerciseFeedback] = useState<{ passed: boolean; feedback: string } | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Quiz state
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Parallel execution with error check
      const [mat, qz] = await Promise.all([
        generateLevelMaterial(level.id, level.title, user),
        generateLevelQuiz(level.id, level.title, user)
      ]);

      if (!mat || !qz) {
        throw new Error("لم نتمكن من استلام بيانات صالحة من المعلم الذكي.");
      }

      setMaterial(mat);
      setQuiz(qz);
    } catch (err: any) {
      console.error("Failed to load level data", err);
      setError(err.message || "حدث خطأ غير متوقع أثناء تحميل محتوى المستوى.");
      playErrorSound();
    } finally {
      setIsLoading(false);
    }
  }, [level.id, level.title, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExerciseSubmit = async () => {
    if (!exerciseAnswer.trim() || isEvaluating) return;
    setIsEvaluating(true);
    try {
      const result = await evaluateExerciseResponse(material?.exercise || '', exerciseAnswer);
      setExerciseFeedback(result);
      if (result.passed) {
        playPositiveSound();
      } else {
        playErrorSound();
      }
    } catch (e) {
      console.error(e);
      setExerciseFeedback({ passed: false, feedback: "حدث خطأ أثناء تقييم الإجابة. يرجى المحاولة مرة أخرى." });
      playErrorSound();
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleQuizAnswer = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    
    const isCorrect = idx === quiz[currentQuizIdx].correctIndex;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      playPositiveSound();
    } else {
      playErrorSound();
    }

    setTimeout(() => {
      if (currentQuizIdx < quiz.length - 1) {
        setCurrentQuizIdx(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setQuizFinished(true);
        if (quizScore + (isCorrect ? 1 : 0) >= quiz.length * 0.6) {
          playCelebrationSound();
        }
      }
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold animate-pulse">جاري تحضير المحتوى التعليمي الذكي...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">عذراً، حدث خطأ</h2>
        <p className="text-slate-500 mb-8 max-w-md">{error}</p>
        <div className="flex gap-4">
          <button 
            onClick={onBack}
            className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            العودة للوحة التحكم
          </button>
          <button 
            onClick={fetchData}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">المستوى {level.id}</p>
              <h1 className="text-lg font-black text-slate-900">{level.title}</h1>
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <div key={i} className={`w-8 h-1 rounded-full ${activeTab === 'content' && i === 1 ? 'bg-blue-600' : activeTab === 'exercise' && i === 2 ? 'bg-blue-600' : activeTab === 'quiz' && i === 3 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Tab Navigation */}
        <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-100 mb-10 overflow-hidden">
          {(['content', 'exercise', 'quiz'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                ${activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}
              `}
            >
              <span>{tab === 'content' ? '📚 المادة التعليمية' : tab === 'exercise' ? '✍️ تمرين تطبيقي' : '❓ اختبار قصير'}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'content' && material && (
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="prose prose-slate prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-lg">
                  {material.content}
                </div>
              </div>
              <div className="mt-12 flex justify-end">
                <button 
                  onClick={() => setActiveTab('exercise')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all flex items-center gap-3 group"
                >
                  <span>الانتقال للتمرين</span>
                  <svg className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'exercise' && material && (
            <div className="space-y-8">
              <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
                <h3 className="text-xl font-black text-indigo-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📝</span> المهمة المطلوبة
                </h3>
                <p className="text-indigo-800 text-lg leading-relaxed">{material.exercise}</p>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <label className="block text-sm font-bold text-slate-500 mb-4">إجابتك المقترحة:</label>
                <textarea
                  className="w-full h-48 p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none text-slate-800"
                  placeholder="اكتب ردك هنا بناءً على مشروعك..."
                  value={exerciseAnswer}
                  onChange={(e) => setExerciseAnswer(e.target.value)}
                  disabled={exerciseFeedback?.passed}
                />
                {!exerciseFeedback?.passed && (
                  <div className="mt-6">
                    <button
                      onClick={handleExerciseSubmit}
                      disabled={!exerciseAnswer.trim() || isEvaluating}
                      className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                    >
                      {isEvaluating ? (
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>تقييم الإجابة بواسطة AI</span>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {exerciseFeedback && (
                  <div className={`mt-8 p-6 rounded-2xl border-2 animate-fade-in-up ${exerciseFeedback.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{exerciseFeedback.passed ? '✅' : '❌'}</span>
                      <h4 className={`font-black ${exerciseFeedback.passed ? 'text-green-800' : 'text-red-800'}`}>
                        {exerciseFeedback.passed ? 'تم قبول الإجابة' : 'تحتاج للمزيد من التفاصيل'}
                      </h4>
                    </div>
                    <p className={`text-sm leading-relaxed ${exerciseFeedback.passed ? 'text-green-700' : 'text-red-700'}`}>
                      {exerciseFeedback.feedback}
                    </p>
                    {exerciseFeedback.passed && (
                      <button 
                        onClick={() => setActiveTab('quiz')}
                        className="mt-6 w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
                      >
                        الانتقال للاختبار القصير
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="max-w-2xl mx-auto">
              {!quizFinished ? (
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100 animate-fade-in">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-xs font-black text-slate-400 uppercase">سؤال {currentQuizIdx + 1} من {quiz.length}</span>
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${((currentQuizIdx + 1) / quiz.length) * 100}%` }}></div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-800 mb-10 leading-relaxed">
                    {quiz[currentQuizIdx]?.text}
                  </h3>

                  <div className="space-y-4">
                    {quiz[currentQuizIdx]?.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(idx)}
                        disabled={selectedOption !== null}
                        className={`w-full p-6 text-right rounded-2xl border-2 transition-all font-bold relative
                          ${selectedOption === null ? 'bg-white border-slate-100 hover:border-blue-500 hover:bg-blue-50 text-slate-700' : 
                            idx === quiz[currentQuizIdx].correctIndex ? 'bg-green-50 border-green-500 text-green-700' :
                            idx === selectedOption ? 'bg-red-50 border-red-500 text-red-700' : 'bg-slate-50 border-slate-50 text-slate-400'}
                        `}
                      >
                        {opt}
                        {selectedOption !== null && idx === quiz[currentQuizIdx].correctIndex && (
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-green-600">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {selectedOption !== null && (
                    <div className="mt-8 p-4 bg-blue-50 rounded-xl text-blue-800 text-sm italic text-center animate-fade-in">
                      {quiz[currentQuizIdx]?.explanation}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-slate-100 text-center animate-cert-pop">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner">
                    {quizScore >= quiz.length * 0.6 ? '🎉' : '📚'}
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">نتيجتك النهائية</h2>
                  <p className="text-slate-500 mb-8 font-medium">لقد أجبت بشكل صحيح على {quizScore} من أصل {quiz.length} أسئلة.</p>
                  
                  <div className="bg-slate-50 p-6 rounded-2xl mb-10">
                    <div className="text-5xl font-black text-blue-600">{Math.round((quizScore / quiz.length) * 100)}%</div>
                    <div className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">معدل الإنجاز</div>
                  </div>

                  {quizScore >= quiz.length * 0.6 ? (
                    <button 
                      onClick={onComplete}
                      className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-100 transition-all transform hover:-translate-y-1"
                    >
                      إكمال المستوى والعودة للوحة التحكم
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-red-500 font-bold">تحتاج للحصول على 60% على الأقل لإتمام المستوى.</p>
                      <button 
                        onClick={() => {
                          setQuizFinished(false);
                          setCurrentQuizIdx(0);
                          setQuizScore(0);
                          setSelectedOption(null);
                        }}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg"
                      >
                        إعادة المحاولة
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Floating Progress Tracker (Mobile Only) */}
      <div className="fixed bottom-6 left-6 right-6 lg:hidden z-20">
        <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-2xl shadow-2xl flex justify-between items-center">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase">تقدمك</span>
              <span className="text-sm font-black text-slate-800">{activeTab === 'content' ? 'المادة العلمية' : activeTab === 'exercise' ? 'التطبيق' : 'الاختبار'}</span>
           </div>
           <button onClick={onBack} className="text-xs font-bold text-blue-600 px-4 py-2 bg-blue-50 rounded-lg">خروج</button>
        </div>
      </div>
    </div>
  );
};
