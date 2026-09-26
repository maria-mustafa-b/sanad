"use client";
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';

import { LandingPage } from './screens/LandingPage';
import { AuthPage } from './screens/AuthPage';
import { OnboardingPage } from './screens/OnboardingPage';
import { DashboardPage } from './screens/DashboardPage';
import { ChatPage } from './screens/ChatPage';
import { VoicePage } from './screens/VoicePage';
import { DocumentsPage } from './screens/DocumentsPage';
import { SituationPage } from './screens/SituationPage';
import { ConsentPage } from './screens/ConsentPage';
import { ServicesPage, ServiceDetailPage } from './screens/ServicesPage';
import {
  CredentialCreatePage,
  CredentialWalletPage,
  CredentialDetailPage,
} from './screens/CredentialsPages';
import { ApplicationSubmitPage, ApplicationTrackingPage } from './screens/ApplicationsPages';
import { NotificationsPage } from './screens/NotificationsPage';
import { VerifyPage } from './screens/VerifyPage';
import { AccessibilityPage } from './screens/AccessibilityPage';
import { AdminDashboardPage } from './screens/AdminDashboardPage';

const AppContent: React.FC = () => {
  const { currentRoute, direction } = useApp();

  const render = () => {
    switch (currentRoute) {
      case '/':
        return <LandingPage />;
      case '/auth/signin':
      case '/auth/welcome':
        return <AuthPage mode="signin" />;
      case '/auth/signup':
      case '/auth/register':
        return <AuthPage mode="signup" />;
      case '/onboarding':
        return <OnboardingPage />;
      case '/dashboard':
      case '/journey':
      case '/home':
        return <DashboardPage />;
      case '/chat':
      case '/tell-sanad':
        return <ChatPage />;
      case '/voice':
        return <VoicePage />;
      case '/documents':
      case '/document-reader':
        return <DocumentsPage />;
      case '/situation':
      case '/confirm-situation':
        return <SituationPage />;
      case '/consent':
        return <ConsentPage />;
      case '/services':
      case '/worker-dignity':
        return <ServicesPage />;
      case '/services/detail':
        return <ServiceDetailPage />;
      case '/credentials/create':
      case '/processing':
        return <CredentialCreatePage />;
      case '/credentials':
      case '/my-proof':
        return <CredentialWalletPage />;
      case '/credentials/detail':
        return <CredentialDetailPage />;
      case '/applications/submit':
      case '/evidence-application':
        return <ApplicationSubmitPage />;
      case '/applications':
        return <ApplicationTrackingPage />;
      case '/notifications':
        return <NotificationsPage />;
      case '/verify':
      case '/public-verification':
        return <VerifyPage />;
      case '/settings':
      case '/settings/accessibility':
        return <AccessibilityPage />;
      case '/admin':
      case '/admin/users':
      case '/admin/applications':
      case '/admin/credentials':
      case '/admin/escalations':
        return <AdminDashboardPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className={direction === 'rtl' ? 'font-arabic' : 'font-sans'}>
      {render()}
    </div>
  );
};

export const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;
