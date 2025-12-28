
export enum FiltrationStage {
  LANDING = 'LANDING',
  REGISTRATION = 'REGISTRATION',
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
  CERTIFICATE = 'CERTIFICATE'
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

export const LEVELS_CONFIG: LevelData[] = [
  { id: 1, title: 'التحقق من الفكرة', description: 'تأكد من أن فكرتك تحل مشكلة حقيقية وتستحق الاستثمار والجهد.', isCompleted: false, isLocked: false },
  { id: 2, title: 'نموذج العمل التجاري', description: 'ابنِ خطة عمل واضحة تحدد مصادر الدخل، العملاء، وقنوات التوزيع.', isCompleted: false, isLocked: true },
  { id: 3, title: 'تحليل السوق والمنافسين', description: 'افهم حجم السوق ومن هم منافسوك وكيف ستتفوق عليهم بميزتك التنافسية.', isCompleted: false, isLocked: true },
  { id: 4, title: 'المنتج الأولي (MVP)', description: 'حدد الميزات الأساسية لمنتجك لإطلاقه بأقل التكاليف والحصول على تعليقات العملاء.', isCompleted: false, isLocked: true },
  { id: 5, title: 'الخطة المالية والتمويل', description: 'توقع التكاليف، الإيرادات، التدفقات النقدية، واحتياجات التمويل المستقبلي.', isCompleted: false, isLocked: true },
  { id: 6, title: 'عرض الاستثمار النهائي', description: 'جهز عرضاً تقديمياً احترافياً (Pitch Deck) لجذب المستثمرين.', isCompleted: false, isLocked: true },
];

/**
 * Additional types and constants used across the application to resolve export errors.
 */

export type ProjectStageType = 'Idea' | 'Prototype' | 'Product';
export type TechLevelType = 'Low' | 'Medium' | 'High';

export interface ApplicantProfile {
  codeName: string;
  projectStage: ProjectStageType;
  sector: string;
  goal: string;
  techLevel: TechLevelType;
}

export interface AnalyticalQuestion {
  text: string;
  options: string[];
  correctIndex: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface FailureSimulation {
  brutalTruth: string;
  probability: number;
  financialLoss: string;
  operationalImpact: string;
  missingQuestions: string[];
  recoveryPlan: string[];
}

export interface GovStats {
  riskyMarkets: { name: string; failRate: number }[];
  readySectors: { name: string; score: number }[];
  commonFailReasons: { reason: string; percentage: number }[];
  regulatoryGaps: string[];
}

export interface PersonalityQuestion {
  id: number;
  situation: string;
  options: { text: string; style: string }[];
}

export interface FinalResult {
  score: number;
  isQualified: boolean;
  leadershipStyle: string;
  metrics: {
    readiness: number;
    analysis: number;
    tech: number;
    personality: number;
    strategy: number;
    ethics: number;
  };
  projectEval?: ProjectEvaluationResult;
  badges: { id: string; name: string; icon: string }[];
}

export type AgentCategory = 'Vision' | 'Market' | 'User' | 'Opportunity';

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  category: AgentCategory;
}

export const AVAILABLE_AGENTS: AIAgent[] = [
  { id: 'visionary', name: 'المستشار الاستراتيجي', description: 'يحلل الرؤية بعيدة المدى للمشروع.', category: 'Vision' },
  { id: 'marketer', name: 'خبير التسويق', description: 'يحلل السوق والمنافسين.', category: 'Market' },
  { id: 'user_researcher', name: 'باحث تجربة المستخدم', description: 'يفهم سلوك واحتياجات المستخدمين.', category: 'User' },
  { id: 'growth_hacker', name: 'خبير النمو', description: 'يحدد فرص النمو السريع.', category: 'Opportunity' }
];

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

export const SECTORS = [
  { value: 'Tech', label: 'تقنية' },
  { value: 'Service', label: 'خدمات' },
  { value: 'Industrial', label: 'صناعي' },
  { value: 'Health', label: 'صحة' },
  { value: 'Edu', label: 'تعليم' }
];
