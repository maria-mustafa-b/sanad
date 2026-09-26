 
"use client";
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { SOSModal } from './components/SOSModal';

// Views
import { LandingHubView } from './views/LandingHubView';
import { JourneyHomeView } from './views/JourneyHomeView';
import { VoiceIntakeView } from './views/VoiceIntakeView';
import { ConfirmProofView } from './views/ConfirmProofView';
import { EvidenceApplicationView } from './views/EvidenceApplicationView';
import { ApplicationsTrackingView } from './views/ApplicationsTrackingView';
import { MyProofVaultView } from './views/MyProofVaultView';
import { PublicVerificationView } from './views/PublicVerificationView';
import { DocumentReaderView } from './views/DocumentReaderView';
import { WorkerRightsView } from './views/WorkerRightsView';
import { HelpSupportView } from './views/HelpSupportView';
import { SettingsView } from './views/SettingsView';
import { NotificationsView } from './views/NotificationsView';
import { AuthView } from './views/AuthView';
import { NarrativeProcessingView } from './views/NarrativeProcessingView';
import { WorkerDignityView } from './views/WorkerDignityView';

const AppContent: React.FC = () => {
  const { currentRoute, direction } = useApp();

  const renderCurrentView = () => {
    switch (currentRoute) {
      case '/':
        return <LandingHubView />;
      case '/journey':
      case '/home':
        return <JourneyHomeView />;
      case '/tell-sanad':
        return <VoiceIntakeView />;
      case '/confirm-situation':
        return <ConfirmProofView />;
      case '/evidence-application':
        return <EvidenceApplicationView />;
      case '/applications':
        return <ApplicationsTrackingView />;
      case '/my-proof':
        return <MyProofVaultView />;
      case '/verify':
      case '/public-verification':
        return <PublicVerificationView />;
      case '/document-reader':
        return <DocumentReaderView />;
      case '/worker-rights':
        return <WorkerRightsView />;
      case '/help':
        return <HelpSupportView />;
      case '/settings':
        return <SettingsView />;
      case '/notifications':
        return <NotificationsView />;
      case '/auth/register':
        return <AuthView initialMode="register" />;
      case '/auth/otp':
        return <AuthView initialMode="otp" />;
      case '/auth/signin':
        return <AuthView initialMode="signin" />;
      case '/auth/welcome':
        return <AuthView initialMode="welcome" />;
      case '/processing':
      case '/narrative-processing':
        return <NarrativeProcessingView />;
      case '/services':
      case '/worker-dignity':
        return <WorkerDignityView />;
      default:
        return <LandingHubView />;
    }
  };

  return (
    <div className={`min-h-screen bg-surface font-body text-on-surface antialiased flex flex-col ${direction === 'rtl' ? 'font-arabic' : ''}`}>
      <Header />
      <main className="flex-1 w-full pt-28 pb-16">
        {renderCurrentView()}
      </main>
      <Footer />
      <BottomNav />
      <SOSModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;


