
import React, { useState } from 'react';
import { FiltrationStage, ApplicantProfile, FinalResult, Badge, UserProfile, LevelData, LEVELS_CONFIG, ProjectEvaluationResult } from './types';
import { WelcomeStep } from './components/Filtration/WelcomeStep';
import { PersonalityTest } from './components/Filtration/PersonalityTest';
import { AnalyticalTest } from './components/Filtration/AnalyticalTest';
import { ProjectEvaluation } from './components/Filtration/ProjectEvaluation';
import { AssessmentResult } from './components/Filtration/AssessmentResult';
import { FinalReport } from './components/Filtration/FinalReport';
import { DevelopmentPlan } from './components/Filtration/DevelopmentPlan';
import { ApplicationStatus } from './components/Filtration/ApplicationStatus';
import { LandingPage } from './components/LandingPage';
import { PathFinder } from './components/PathFinder';
import { Dashboard } from './components/Dashboard';
import { LevelView } from './components/LevelView';
import { Certificate } from './components/Certificate';
import { ProjectBuilderMain } from './components/ProjectBuilder/ProjectBuilderMain';

function App() {
  const [stage, setStage] = useState<FiltrationStage>(FiltrationStage.LANDING);
  const [applicantProfile, setApplicantProfile] = useState<ApplicantProfile | null>(null);
  const [leadershipStyle, setLeadershipStyle] = useState<string>('');
  const [analyticalScore, setAnalyticalScore] = useState<number>(0);
  const [finalResult, setFinalResult] = useState<FinalResult | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [levels, setLevels] = useState<LevelData[]>(LEVELS_CONFIG);
  const [activeLevelId, setActiveLevelId] = useState<number | null>(null);

  const handleStartFiltration = () => setStage(FiltrationStage.WELCOME);
  const handleStartPathFinder = () => setStage(FiltrationStage.PATH_FINDER);

  const handleWelcomeNext = (data: ApplicantProfile) => {
    setApplicantProfile(data);
    setStage(FiltrationStage.PERSONALITY_TEST);
  };

  const handlePersonalityComplete = (style: string) => {
    setLeadershipStyle(style);
    setStage(FiltrationStage.ANALYTICAL_TEST);
  };

  const handleAnalyticalComplete = (score: number) => {
    setAnalyticalScore(score);
    setStage(FiltrationStage.PROJECT_EVALUATION);
  };

  const handleProjectEvaluationComplete = (projectEval: ProjectEvaluationResult) => {
    if (!applicantProfile) return;
    const metrics = { 
      readiness: (projectEval.readiness * 5), 
      analysis: analyticalScore, 
      tech: applicantProfile.techLevel === 'High' ? 90 : 50, 
      personality: 80, 
      strategy: (projectEval.clarity * 5), 
      ethics: 95 
    };
    const total = Math.round((metrics.readiness + metrics.analysis + metrics.strategy) / 3);
    const isQualified = total >= 65 && projectEval.classification !== 'Red';

    setFinalResult({ 
      score: total, 
      leadershipStyle, 
      metrics, 
      projectEval, 
      isQualified, 
      badges: [{id: '1', name: 'رائد طموح', icon: '🚀', color: 'blue'}], 
      recommendation: isQualified ? "مؤهل للاحتضان" : "يحتاج تطوير" 
    });
    setStage(FiltrationStage.ASSESSMENT_RESULT);
  };

  const handleAssessmentContinue = () => {
    setStage(FiltrationStage.APPLICATION_STATUS);
  };

  const handleStatusContinue = () => {
    if (finalResult?.isQualified) {
      setStage(FiltrationStage.FINAL_REPORT);
    } else {
      setStage(FiltrationStage.DEVELOPMENT_PLAN);
    }
  };

  const handleStartIncubatorJourney = () => {
    if (!applicantProfile) return;
    setUserProfile({
      name: applicantProfile.codeName,
      startupName: 'مشروعي الناشئ',
      startupDescription: applicantProfile.goal,
      industry: applicantProfile.sector
    });
    setStage(FiltrationStage.DASHBOARD);
  };

  const handleLevelComplete = (id: number) => {
    setLevels(prev => prev.map(l => l.id === id ? { ...l, isCompleted: true } : l.id === id + 1 ? { ...l, isLocked: false } : l));
    setStage(FiltrationStage.DASHBOARD);
  };

  return (
    <div className="font-sans antialiased text-slate-900">
      {stage === FiltrationStage.LANDING && (
        <LandingPage 
          onStart={handleStartFiltration} 
          onPathFinder={handleStartPathFinder} 
          onSmartFeatures={() => {}}
          onGovDashboard={() => {}}
        />
      )}
      
      {stage === FiltrationStage.PATH_FINDER && <PathFinder onApproved={handleStartFiltration} onBack={() => setStage(FiltrationStage.LANDING)} />}
      {stage === FiltrationStage.WELCOME && <WelcomeStep onNext={handleWelcomeNext} onAdminLogin={() => {}} />}
      {stage === FiltrationStage.PERSONALITY_TEST && <PersonalityTest onComplete={handlePersonalityComplete} />}
      {stage === FiltrationStage.ANALYTICAL_TEST && applicantProfile && <AnalyticalTest profile={applicantProfile} onComplete={handleAnalyticalComplete} />}
      {stage === FiltrationStage.PROJECT_EVALUATION && applicantProfile && <ProjectEvaluation profile={applicantProfile} onComplete={handleProjectEvaluationComplete} />}
      
      {stage === FiltrationStage.ASSESSMENT_RESULT && finalResult && (
        <AssessmentResult result={finalResult} onContinue={handleAssessmentContinue} />
      )}
      
      {stage === FiltrationStage.APPLICATION_STATUS && applicantProfile && finalResult && (
        <ApplicationStatus profile={applicantProfile} result={finalResult} onNext={handleStatusContinue} />
      )}

      {stage === FiltrationStage.FINAL_REPORT && applicantProfile && finalResult && <FinalReport profile={applicantProfile} result={finalResult} onStartJourney={handleStartIncubatorJourney} />}
      {stage === FiltrationStage.DEVELOPMENT_PLAN && applicantProfile && finalResult && <DevelopmentPlan profile={applicantProfile} result={finalResult} onRestart={() => setStage(FiltrationStage.WELCOME)} />}
      
      {stage === FiltrationStage.DASHBOARD && userProfile && (
        <Dashboard user={userProfile} levels={levels} onSelectLevel={(id) => { setActiveLevelId(id); setStage(FiltrationStage.LEVEL_VIEW); }} onShowCertificate={() => setStage(FiltrationStage.CERTIFICATE)} onLogout={() => setStage(FiltrationStage.LANDING)} />
      )}

      {stage === FiltrationStage.LEVEL_VIEW && userProfile && activeLevelId && (
        <LevelView level={levels.find(l => l.id === activeLevelId)!} user={userProfile} onComplete={() => handleLevelComplete(activeLevelId)} onBack={() => setStage(FiltrationStage.DASHBOARD)} />
      )}

      {stage === FiltrationStage.CERTIFICATE && userProfile && <Certificate user={userProfile} onClose={() => setStage(FiltrationStage.DASHBOARD)} />}
    </div>
  );
}

export default App;
