 
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  LanguageCode, 
  TextScale, 
  UserProfile, 
  DossierClaim, 
  VerifiableCredential, 
  ApplicationCase, 
  DocumentEvidence, 
  NotificationItem 
} from '../types';
import { 
  mockUser, 
  preloadedDossier, 
  preloadedCredential, 
  preloadedApplication, 
  preloadedDocuments, 
  preloadedNotifications 
} from '../data/mockData';
import { translations, languageMeta } from '../locales';

interface AppContextType {
  language: LanguageCode;
  direction: 'ltr' | 'rtl';
  textScale: TextScale;
  t: typeof translations['en'];
  currentUser: UserProfile;
  isDemoMode: boolean;
  currentRoute: string;
  activeDossier: DossierClaim;
  credentials: VerifiableCredential[];
  applications: ApplicationCase[];
  documents: DocumentEvidence[];
  notifications: NotificationItem[];
  isSosModalOpen: boolean;
  activeStep: number;
  unreadNotificationsCount: number;

  setLanguage: (lang: LanguageCode) => void;
  setTextScale: (scale: TextScale) => void;
  navigate: (route: string) => void;
  updateDossier: (updates: Partial<DossierClaim>) => void;
  addCredential: (credential: VerifiableCredential) => void;
  addApplication: (application: ApplicationCase) => void;
  addDocument: (doc: DocumentEvidence) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleSosModal: (open?: boolean) => void;
  setActiveStep: (step: number) => void;
  resetToDemo: () => void;
  loginUser: (user: UserProfile) => void;
  logoutUser: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved language or default to English
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('sanad_lang') as LanguageCode;
    return (saved && translations[saved]) ? saved : 'en';
  });

  const [textScale, setTextScaleState] = useState<TextScale>(() => {
    const saved = localStorage.getItem('sanad_text_scale') as TextScale;
    return (saved && ['normal', 'large', 'xlarge'].includes(saved)) ? saved : 'normal';
  });

  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname.length > 1 ? window.location.pathname : '/';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(mockUser);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [activeDossier, setActiveDossier] = useState<DossierClaim>(preloadedDossier);
  const [credentials, setCredentials] = useState<VerifiableCredential[]>([preloadedCredential]);
  const [applications, setApplications] = useState<ApplicationCase[]>([preloadedApplication]);
  const [documents, setDocuments] = useState<DocumentEvidence[]>(preloadedDocuments);
  const [notifications, setNotifications] = useState<NotificationItem[]>(preloadedNotifications);
  const [isSosModalOpen, setIsSosModalOpen] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(2);

  const direction = languageMeta[language]?.dir || 'ltr';
  const t = translations[language] || translations.en;

  // Sync direction and font-scaling to document root
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    localStorage.setItem('sanad_lang', language);
  }, [language, direction]);

  useEffect(() => {
    localStorage.setItem('sanad_text_scale', textScale);
    const root = document.documentElement;
    if (textScale === 'normal') {
      root.style.fontSize = '16px';
    } else if (textScale === 'large') {
      root.style.fontSize = '18px';
    } else if (textScale === 'xlarge') {
      root.style.fontSize = '20px';
    }
  }, [textScale]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  const setTextScale = (scale: TextScale) => {
    setTextScaleState(scale);
  };

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState({}, '', route);
    } catch {
      // browser environment fallback
    }
  };

  const updateDossier = (updates: Partial<DossierClaim>) => {
    setActiveDossier(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString()
    }));
  };

  const addCredential = (credential: VerifiableCredential) => {
    setCredentials(prev => [credential, ...prev.filter(c => c.id !== credential.id)]);
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        title: `Verifiable Proof ${credential.id} Sealed`,
        message: 'Your tamper-evident proof is ready to present to legal aid or embassies.',
        category: 'security',
        timestamp: 'Just now',
        read: false,
        relatedRoute: '/my-proof'
      },
      ...prev
    ]);
  };

  const addApplication = (app: ApplicationCase) => {
    setApplications(prev => [app, ...prev]);
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        title: `Application Submitted to ${app.orgName}`,
        message: `Your grievance has been safely transferred under proof ${app.credentialId}.`,
        category: 'case_update',
        timestamp: 'Just now',
        read: false,
        relatedRoute: '/applications'
      },
      ...prev
    ]);
  };

  const addDocument = (doc: DocumentEvidence) => {
    setDocuments(prev => [doc, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleSosModal = (open?: boolean) => {
    setIsSosModalOpen(prev => open !== undefined ? open : !prev);
  };

  const resetToDemo = () => {
    setActiveDossier(preloadedDossier);
    setCredentials([preloadedCredential]);
    setApplications([preloadedApplication]);
    setDocuments(preloadedDocuments);
    setCurrentUser(mockUser);
    setIsDemoMode(true);
    setActiveStep(2);
    navigate('/journey');
  };

  const loginUser = (user: UserProfile) => {
    setCurrentUser(user);
    setIsDemoMode(false);
  };

  const logoutUser = () => {
    setCurrentUser({
      ...mockUser,
      isGuest: true,
      name: 'Guest Worker'
    });
    setIsDemoMode(true);
    navigate('/');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        language,
        direction,
        textScale,
        t,
        currentUser,
        isDemoMode,
        currentRoute,
        activeDossier,
        credentials,
        applications,
        documents,
        notifications,
        isSosModalOpen,
        activeStep,
        unreadNotificationsCount,

        setLanguage,
        setTextScale,
        navigate,
        updateDossier,
        addCredential,
        addApplication,
        addDocument,
        markNotificationRead,
        markAllNotificationsRead,
        toggleSosModal,
        setActiveStep,
        resetToDemo,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};


