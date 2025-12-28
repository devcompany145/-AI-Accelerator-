
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

declare var process: any;

interface AdminDashboardProps {
  onBack: () => void;
}

interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [command, setCommand] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [hoveredMaturity, setHoveredMaturity] = useState<number | null>(null);

  const maturityData: ChartDataPoint[] = [
    { label: 'فكرة (Idea)', value: 60, color: '#3b82f6' },
    { label: 'نموذج (Prototype)', value: 25, color: '#6366f1' },
    { label: 'منتج (Product)', value: 15, color: '#22c55e' },
  ];

  const handleCommand = async () => {
    if (!command.trim()) return;
    setIsProcessing(true);
    setAiResponse(null);

    try {
      // Create a new instance right before the call as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `أنت مساعد ذكي لمدير مسرعة أعمال. نفذ الأمر التالي بناءً على بيانات وهمية ولكن واقعية: "${command}". 
        إذا طلب تحليل متقدم، قدمه في شكل نقاط واضحة باللغة العربية.`,
      });
      setAiResponse(response.text || "لم يتم استلام رد.");
    } catch (e) {
      setAiResponse("حدث خطأ في معالجة الأمر. يرجى التحقق من المفتاح أو المحاولة لاحقاً.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper for Donut Chart
  let cumulativeValue = 0;
  const donutRadius = 40;
  const donutCenter = 50;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * donutRadius;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans overflow-x-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10 text-center sm:text-right">
          <div className="flex flex-col sm:flex-row items-center gap-4">
             <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl transform -rotate-3 shrink-0">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
             </div>
             <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">بوابة الإدارة المركزية</h1>
                <p className="text-slate-500 font-bold text-sm">بيزنس ديفلوبرز • Business Developers Hub</p>
             </div>
          </div>
          <button 
            onClick={onBack} 
            className="w-full sm:w-auto bg-white border-2 border-slate-200 text-slate-600 px-8 py-3 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            خروج من النظام
          </button>
        </div>

        {/* AI Command Center - Improved Responsiveness */}
        <div className="mb-10 bg-gradient-to-br from-slate-900 to-blue-900 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-10 pointer-events-none"></div>
           <h3 className="text-white font-black text-lg mb-6 flex items-center gap-2">
             <span className="text-blue-400">🤖</span> مركز الأوامر الذكي
           </h3>
           <div className="flex flex-col lg:flex-row gap-4">
              <input 
                type="text"
                className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white outline-none focus:ring-4 focus:ring-blue-500/30 placeholder-white/30 text-base md:text-lg transition-all"
                placeholder="مثال: حلّل فكرة المتقدّم [الرائد المبتكر] ..."
                value={command}
                onChange={e => setCommand(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCommand()}
              />
              <button 
                onClick={handleCommand}
                disabled={isProcessing || !command.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white px-8 py-4 rounded-2xl font-black text-sm md:text-base transition-all shrink-0 active:scale-95 shadow-lg"
              >
                {isProcessing ? 'جاري التنفيذ...' : 'تنفيذ الأمر'}
              </button>
           </div>
           
           {aiResponse && (
             <div className="mt-6 p-5 md:p-6 bg-white/5 border border-white/10 rounded-2xl animate-fade-in relative">
                <div className="flex justify-between items-center mb-4">
                   <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">مخرجات الذكاء الاصطناعي</span>
                   <button onClick={() => setAiResponse(null)} className="text-white/30 hover:text-white transition-colors p-1">✕</button>
                </div>
                <div className="text-white leading-relaxed whitespace-pre-wrap text-sm md:text-base italic">
                  {aiResponse}
                </div>
             </div>
           )}
        </div>

        {/* Main Grid - Stacks on tablet and mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
           
           {/* Top 5 Ideas Section */}
           <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-200">
              <h3 className="font-black text-slate-800 text-lg mb-6 flex items-center gap-2">
                <span className="text-yellow-500">🏆</span> أعلى 5 أفكار ابتكاراً
              </h3>
              <div className="space-y-4">
                 {[
                   { name: 'منصة ربط المستقلين العرب', score: 92, color: 'bg-green-500' },
                   { name: 'نظام إدارة المخزون الذكي', score: 88, color: 'bg-green-500' },
                   { name: 'تطبيق التدوير المنزلي', score: 85, color: 'bg-blue-500' },
                   { name: 'منصة التعليم الغامر', score: 82, color: 'bg-blue-500' },
                   { name: 'محرك البحث العقاري', score: 79, color: 'bg-amber-500' }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl group hover:bg-slate-100 transition-all">
                      <span className="text-lg font-black text-slate-400">#{i+1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-800 truncate">{item.name}</p>
                        <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                           <div className={`h-full ${item.color}`} style={{ width: `${item.score}%` }}></div>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-slate-900 shrink-0">{item.score}%</span>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-3 bg-slate-50 text-slate-400 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-colors">عرض التقرير الجماعي للدفعة</button>
           </div>

           {/* Metrics Breakdown */}
           <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-slate-800 text-lg">مؤشرات نضج الأفكار</h3>
                <div className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded">Metrics</div>
              </div>

              <div className="space-y-6">
                {[
                  { label: 'معدل وضوح الأفكار', value: 76, color: '#3b82f6' },
                  { label: 'متوسط الجاهزية السوقية', value: 64, color: '#6366f1' },
                  { label: 'معدل التميز والابتكار', value: 81, color: '#8b5cf6' },
                  { label: 'القيمة المقترحة للعملاء', value: 70, color: '#ec4899' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] font-black text-slate-500 mb-2">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-1000" 
                        style={{ width: `${item.value}%`, backgroundColor: item.color }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-5 bg-blue-50 rounded-3xl border border-blue-100 text-center">
                 <p className="text-[10px] font-black text-blue-900 mb-1 uppercase tracking-widest">توصية AI للمدير</p>
                 <p className="text-xs text-blue-800 leading-relaxed font-bold">"معظم الأفكار في هذه الدفعة تمتاز بوضوح جيد ولكنها تفتقر للجاهزية التنفيذية. نوصي بتكثيف جلسات نموذج العمل."</p>
              </div>
           </div>

           {/* Classification Donut - Centered and scaled */}
           <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-200 md:col-span-2 lg:col-span-1">
              <h3 className="font-black text-slate-800 text-lg mb-8">تصنيف المشاريع</h3>
              
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 md:w-48 md:h-48 mb-8">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {maturityData.map((item, i) => {
                      const offset = (cumulativeValue / 100) * circumference;
                      cumulativeValue += item.value;
                      const isHovered = hoveredMaturity === i;
                      
                      return (
                        <circle
                          key={i}
                          cx={donutCenter}
                          cy={donutCenter}
                          r={donutRadius}
                          fill="transparent"
                          stroke={item.color}
                          strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                          strokeDasharray={`${(item.value / 100) * circumference} ${circumference}`}
                          strokeDashoffset={-offset}
                          onMouseEnter={() => setHoveredMaturity(i)}
                          onMouseLeave={() => setHoveredMaturity(null)}
                          className="transition-all duration-300 cursor-pointer"
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-slate-400 text-[8px] md:text-[10px] font-black">إجمالي المشاريع</span>
                     <span className="text-2xl md:text-3xl font-black text-slate-800">142</span>
                  </div>
                </div>

                <div className="w-full space-y-2">
                  {maturityData.map((item, i) => (
                    <div 
                      key={i} 
                      className={`flex items-center justify-between p-3 rounded-2xl transition-all cursor-default ${hoveredMaturity === i ? 'bg-slate-50 shadow-inner scale-[1.02]' : ''}`}
                      onMouseEnter={() => setHoveredMaturity(i)}
                      onMouseLeave={() => setHoveredMaturity(null)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <p className="text-xs font-black text-slate-700">{item.label}</p>
                      </div>
                      <span className="text-xs font-bold text-slate-400">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
           </div>
        </div>

        {/* Stats Bar - Responsive grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
           {[
             { label: 'وضوح الأفكار', val: '76%', trend: '+4%', color: 'text-blue-600' },
             { label: 'جاهزية السوق', val: '64%', trend: '-2%', color: 'text-indigo-600' },
             { label: 'الابتكار التقني', val: '81%', trend: '+12%', color: 'text-purple-600' },
             { label: 'متوسط النضج', val: 'B+', trend: 'Steady', color: 'text-emerald-600' }
           ].map((stat, i) => (
             <div key={i} className="bg-white p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-slate-200">
               <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
               <div className="flex items-end justify-between">
                  <p className={`text-xl md:text-2xl font-black ${stat.color}`}>{stat.val}</p>
                  <span className={`text-[8px] md:text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-slate-400'}`}>{stat.trend}</span>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
