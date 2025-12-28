
import React, { useState } from 'react';
import { FiltrationStage, UserProfile, LevelData, LEVELS_CONFIG } from './types';
import { LandingPage } from './components/LandingPage';
import { Registration } from './components/Registration';
import { Dashboard } from './components/Dashboard';
import { LevelView } from './components/LevelView';
import { Certificate } from './components/Certificate';
import { PathFinder } from './components/PathFinder';

function App() {
  const [stage, setStage] = useState<FiltrationStage>(FiltrationStage.LANDING);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [levels, setLevels] = useState<LevelData[]>(LEVELS_CONFIG);
  const [activeLevelId, setActiveLevelId] = useState<number | null>(null);

  const handleStart = () => setStage(FiltrationStage.REGISTRATION);
  
  const handleRegister = (profile: UserProfile) => {
    setUserProfile(profile);
    setStage(FiltrationStage.DASHBOARD);
  };

  const handleLevelSelect = (id: number) => {
    setActiveLevelId(id);
    setStage(FiltrationStage.LEVEL_VIEW);
  };

  const handleLevelComplete = (id: number) => {
    setLevels(prev => prev.map(l => {
      if (l.id === id) return { ...l, isCompleted: true };
      if (l.id === id + 1) return { ...l, isLocked: false };
      return l;
    }));
    setStage(FiltrationStage.DASHBOARD);
  };

  return (
    <div className="font-sans antialiased text-slate-900">
      {stage === FiltrationStage.LANDING && (
        <LandingPage 
          onStart={handleStart} 
          onPathFinder={() => setStage(FiltrationStage.PATH_FINDER)}
          onSmartFeatures={() => {}}
          onGovDashboard={() => {}}
        />
      )}

      {stage === FiltrationStage.PATH_FINDER && (
        <PathFinder onApproved={handleStart} onBack={() => setStage(FiltrationStage.LANDING)} />
      )}

      {stage === FiltrationStage.REGISTRATION && (
        <Registration onRegister={handleRegister} />
      )}
      
      {stage === FiltrationStage.DASHBOARD && userProfile && (
        <Dashboard 
          user={userProfile} 
          levels={levels} 
          onSelectLevel={handleLevelSelect} 
          onShowCertificate={() => setStage(FiltrationStage.CERTIFICATE)}
          onLogout={() => setStage(FiltrationStage.LANDING)}
        />
      )}

      {stage === FiltrationStage.LEVEL_VIEW && userProfile && activeLevelId && (
        <LevelView 
          level={levels.find(l => l.id === activeLevelId)!} 
          user={userProfile} 
          onComplete={() => handleLevelComplete(activeLevelId)} 
          onBack={() => setStage(FiltrationStage.DASHBOARD)} 
        />
      )}

      {stage === FiltrationStage.CERTIFICATE && userProfile && (
        <Certificate user={userProfile} onClose={() => setStage(FiltrationStage.DASHBOARD)} />
      )}
    </div>
  );
}

export default App;
