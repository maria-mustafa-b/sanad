import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LanguageCode,
  TextScale,
  UserProfile,
  DossierClaim,
  VerifiableCredential,
  ApplicationCase,
  DocumentEvidence,
  NotificationItem,
} from '../types';
import {
  emptyUser,
  emptyDossier,
  emptyCredentials,
  emptyApplications,
  emptyDocuments,
  emptyNotifications,
} from '../data/emptyState';
import { translations, languageMeta } from '../locales';
import { getAuthMe, logoutApi } from '../services/sanadApi';

interface AppContextType {
  language: LanguageCode;
  direction: 'ltr' | 'rtl';
  textScale: TextScale;
  t: typeof translations['en'];
  currentUser: UserProfile;
  isAuthenticated: boolean;
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
  setCredentials: (creds: VerifiableCredential[]) => void;
  addCredential: (credential: VerifiableCredential) => void;
  addApplication: (application: ApplicationCase) => void;
  setApplications: (apps: ApplicationCase[]) => void;
  addDocument: (doc: DocumentEvidence) => void;
  setDocuments: (docs: DocumentEvidence[]) => void;
  setNotifications: (items: NotificationItem[]) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleSosModal: (open?: boolean) => void;
  setActiveStep: (step: number) => void;
  loginUser: (user: UserProfile) => void;
  logoutUser: () => void;
  refreshSession: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('sanad_lang') as LanguageCode;
    return saved && translations[saved] ? saved : 'en';
  });

  const [textScale, setTextScaleState] = useState<TextScale>(() => {
    const saved = localStorage.getItem('sanad_text_scale') as TextScale;
    return saved && ['normal', 'large', 'xlarge'].includes(saved) ? saved : 'normal';
  });

  const [currentRoute, setCurrentRoute] = useState<string>(() =>
    window.location.pathname.length > 1 ? window.location.pathname : '/'
  );

  const [currentUser, setCurrentUser] = useState<UserProfile>(emptyUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeDossier, setActiveDossier] = useState<DossierClaim>(emptyDossier);
  const [credentials, setCredentials] = useState<VerifiableCredential[]>(emptyCredentials);
  const [applications, setApplications] = useState<ApplicationCase[]>(emptyApplications);
  const [documents, setDocuments] = useState<DocumentEvidence[]>(emptyDocuments);
  const [notifications, setNotifications] = useState<NotificationItem[]>(emptyNotifications);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const direction = languageMeta[language]?.dir || 'ltr';
  const t = translations[language] || translations.en;

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    localStorage.setItem('sanad_lang', language);
  }, [language, direction]);

  useEffect(() => {
    localStorage.setItem('sanad_text_scale', textScale);
    const root = document.documentElement;
    if (textScale === 'normal') root.style.fontSize = '16px';
    else if (textScale === 'large') root.style.fontSize = '18px';
    else if (textScale === 'xlarge') root.style.fontSize = '20px';
  }, [textScale]);

  const refreshSession = async () => {
    try {
      const me = await getAuthMe();
      setIsAuthenticated(true);
      setCurrentUser({
        id: me.id,
        name: me.email?.split('@')[0] || 'Worker',
        phone: '',
        preferredLanguage: language,
        isGuest: false,
      });
      return true;
    } catch {
      setIsAuthenticated(false);
      return false;
    }
  };

  useEffect(() => {
    void refreshSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLanguage = (lang: LanguageCode) => setLanguageState(lang);
  const setTextScale = (scale: TextScale) => setTextScaleState(scale);

  const canonicalizeRoute = (path: string): string => {
    const aliases: Record<string, string> = {
      '/home': '/dashboard',
      '/journey': '/dashboard',
      '/tell-sanad': '/chat',
      '/confirm-situation': '/situation',
      '/my-proof': '/credentials',
      '/document-reader': '/documents',
      '/evidence-application': '/applications/submit',
      '/public-verification': '/verify',
      '/worker-dignity': '/services',
      '/narrative-processing': '/credentials/create',
      '/processing': '/credentials/create',
      '/auth/welcome': '/auth/signin',
      '/auth/register': '/auth/signup',
      '/settings': '/settings/accessibility',
      '/clarify': '/clarify',
    };
    return aliases[path] || path;
  };

  const navigate = (route: string) => {
    const canonical = canonicalizeRoute(route);
    setCurrentRoute(canonical);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState({}, '', canonical);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname.length > 1 ? window.location.pathname : '/';
      const canonical = canonicalizeRoute(path);
      setCurrentRoute(canonical);
      if (canonical !== path) {
        try {
          window.history.replaceState({}, '', canonical);
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener('popstate', onPopState);
    onPopState();
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const updateDossier = (updates: Partial<DossierClaim>) => {
    setActiveDossier((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };

  const addCredential = (credential: VerifiableCredential) => {
    setCredentials((prev) => [credential, ...prev.filter((c) => c.id !== credential.id)]);
  };

  const addApplication = (app: ApplicationCase) => {
    setApplications((prev) => [app, ...prev.filter((a) => a.id !== app.id)]);
  };

  const addDocument = (doc: DocumentEvidence) => {
    setDocuments((prev) => [doc, ...prev.filter((d) => d.id !== doc.id)]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleSosModal = (open?: boolean) => {
    setIsSosModalOpen((prev) => (open !== undefined ? open : !prev));
  };

  const loginUser = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(!user.isGuest && Boolean(user.id));
  };

  const logoutUser = () => {
    void logoutApi();
    setCurrentUser(emptyUser);
    setIsAuthenticated(false);
    setActiveDossier(emptyDossier);
    setCredentials(emptyCredentials);
    setApplications(emptyApplications);
    setDocuments(emptyDocuments);
    setNotifications(emptyNotifications);
    navigate('/');
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        language,
        direction,
        textScale,
        t,
        currentUser,
        isAuthenticated,
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
        setCredentials,
        addCredential,
        addApplication,
        setApplications,
        addDocument,
        setDocuments,
        setNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        toggleSosModal,
        setActiveStep,
        loginUser,
        logoutUser,
        refreshSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
