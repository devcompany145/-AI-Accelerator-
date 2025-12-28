
export enum FiltrationStage {
  LANDING = 'LANDING',
  PATH_FINDER = 'PATH_FINDER',
  WELCOME = 'WELCOME',
  PERSONALITY_TEST = 'PERSONALITY_TEST',
  ANALYTICAL_TEST = 'ANALYTICAL_TEST',
  PROJECT_EVALUATION = 'PROJECT_EVALUATION',
  ASSESSMENT_RESULT = 'ASSESSMENT_RESULT',
  APPLICATION_STATUS = 'APPLICATION_STATUS',
  FINAL_REPORT = 'FINAL_REPORT',
  DEVELOPMENT_PLAN = 'DEVELOPMENT_PLAN',
  DASHBOARD = 'DASHBOARD',
  LEVEL_VIEW = 'LEVEL_VIEW',
  CERTIFICATE = 'CERTIFICATE',
  PROJECT_BUILDER = 'PROJECT_BUILDER'
}

export type AgentCategory = 'Vision' | 'Market' | 'User' | 'Opportunity' | 'Risk' | 'Decision';

export interface AIAgent {
  id: string;
  name: string;
  category: AgentCategory;
  description: string;
  recommendedModel: string;
  role: string;
}

export type ProjectStageType = 'Idea' | 'Prototype' | 'Product';
export type TechLevelType = 'Low' | 'Medium' | 'High';

export interface ApplicantProfile {
  codeName: string;
  projectStage: ProjectStageType;
  sector: string;
  goal: string;
  techLevel: TechLevelType;
}

export interface UserProfile {
  name: string;
  startupName: string;
  startupDescription: string;
  industry: string;
}

export interface LevelData {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isLocked: boolean;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface RadarMetrics {
  readiness: number;
  analysis: number;
  tech: number;
  personality: number;
  strategy: number;
  ethics: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface ProjectEvaluationResult {
  clarity: number;
  value: number;
  innovation: number;
  market: number;
  readiness: number;
  totalScore: number;
  aiOpinion: string;
  classification: 'Green' | 'Yellow' | 'Red';
}

export interface FinalResult {
  score: number;
  leadershipStyle: string;
  metrics: RadarMetrics;
  projectEval?: ProjectEvaluationResult;
  isQualified: boolean;
  badges: Badge[];
  recommendation: string;
}

export const SECTORS = [
  { value: 'Tech', label: 'تقنية وتكنولوجيا' },
  { value: 'E-commerce', label: 'تجارة إلكترونية' },
  { value: 'Health', label: 'صحة وطب' },
  { value: 'Food', label: 'أغذية ومشروبات' },
  { value: 'Manufacturing', label: 'صناعة وإنتاج' },
  { value: 'Other', label: 'أخرى' }
];

export interface PersonalityQuestion {
  id: number;
  situation: string;
  options: { text: string; style: string }[];
}

export interface AnalyticalQuestion {
  text: string;
  options: string[];
  correctIndex: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface ProjectBuildData {
  projectName: string;
  description: string;
  quality: 'Quick' | 'Balanced' | 'Enhanced' | 'Professional' | 'Max';
  selectedAgents: string[];
  results?: {
    vision?: string;
    marketAnalysis?: string;
    userPersonas?: string;
    hypotheses?: string[];
    pitchDeck?: { title: string; content: string }[];
  };
}

// Added to support SmartFeatures component
export interface FailureSimulation {
  brutalTruth: string;
  probability: number;
  financialLoss: string;
  operationalImpact: string;
  missingQuestions: string[];
  recoveryPlan: string[];
}

// Added to support GovDashboard component
export interface GovStats {
  riskyMarkets: { name: string; failRate: number }[];
  readySectors: { name: string; score: number }[];
  commonFailReasons: { reason: string; percentage: number }[];
  regulatoryGaps: string[];
}

export const LEVELS_CONFIG: LevelData[] = [
  { id: 1, title: 'التحقق من الفكرة', description: 'تأكد من أن فكرتك تحل مشكلة حقيقية وتستحق الاستثمار والجهد.', isCompleted: false, isLocked: false },
  { id: 2, title: 'نموذج العمل التجاري', description: 'ابنِ خطة عمل واضحة تحدد مصادر الدخل، العملاء، وقنوات التوزيع.', isCompleted: false, isLocked: true },
  { id: 3, title: 'تحليل السوق والمنافسين', description: 'افهم حجم السوق ومن هم منافسوك وكيف ستتفوق عليهم بميزتك التنافسية.', isCompleted: false, isLocked: true },
  { id: 4, title: 'المنتج الأولي (MVP)', description: 'حدد الميزات الأساسية لمنتجك لإطلاقه بأقل التكاليف والحصول على تعليقات العملاء.', isCompleted: false, isLocked: true },
  { id: 5, title: 'الخطة المالية والتمويل', description: 'توقع التكاليف، الإيرادات، التدفقات النقدية، واحتياجات التمويل المستقبلي.', isCompleted: false, isLocked: true },
  { id: 6, title: 'عرض الاستثمار النهائي', description: 'جهز عرضاً تقديمياً احترافياً (Pitch Deck) لجذب المستثمرين.', isCompleted: false, isLocked: true },
];

export const AVAILABLE_AGENTS: AIAgent[] = [
  { id: 'vis-1', name: 'وكيل الرؤية الاستراتيجية', category: 'Vision', description: 'يقيّم الملاءمة الاستراتيجية للفكرة مع السوق.', recommendedModel: 'gemini-3-pro-preview', role: 'Strategic Advisor' },
  { id: 'mkt-1', name: 'وكيل أبحاث السوق', category: 'Market', description: 'يحلل الطلب، المنافسة، والفرص المتاحة.', recommendedModel: 'gemini-3-pro-preview', role: 'Market Analyst' },
  { id: 'rsk-1', name: 'وكيل تقييم المخاطر', category: 'Risk', description: 'يحدد المخاطر ويقترح خطط تخفيف.', recommendedModel: 'gemini-3-pro-preview', role: 'Risk Auditor' },
  { id: 'dec-1', name: 'وكيل القرار والنمو', category: 'Decision', description: 'يصدر التوصيات النهائية للنمو والتوسع.', recommendedModel: 'gemini-3-pro-preview', role: 'Decision Maker' }
];
