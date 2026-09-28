import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Repository, 
  PullRequest, 
  SmartAlert, 
  Hackathon, 
  AIDailyBrief, 
  SubscriptionInfo, 
  AIMessage 
} from '../types';
import { githubService, GitHubApiError } from '../services/githubService';
import { aiService } from '../services/AIService';
import { notificationService, EventPayload } from '../services/notificationService';
import { hackathonService } from '../services/HackathonService';
import { revenueCatService } from '../services/revenueCatService';
import { StorageService } from '../services/StorageService';
import { INITIAL_AI_MESSAGES, MOCK_REPOSITORIES, MOCK_PULL_REQUESTS } from '../constants/mockData';

interface AppContextType {
  repositories: Repository[];
  pullRequests: PullRequest[];
  alerts: SmartAlert[];
  hackathons: Hackathon[];
  dailyBrief: AIDailyBrief | null;
  subscription: SubscriptionInfo | null;
  chatMessages: AIMessage[];
  isRefreshing: boolean;
  activeAlertCount: number;
  gitHubError: string | null;
  isGitHubConnected: boolean;
  refreshData: () => Promise<void>;
  markAlertAsRead: (id: string) => Promise<void>;
  markAllAlertsAsRead: () => Promise<void>;
  toggleHackathonTask: (hackathonId: string, taskId: string) => Promise<void>;
  sendAIChatMessage: (text: string) => Promise<void>;
  explainPRWithAI: (pr: PullRequest) => Promise<string>;
  triggerTestNotification: (payload: EventPayload) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [dailyBrief, setDailyBrief] = useState<AIDailyBrief | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [chatMessages, setChatMessages] = useState<AIMessage[]>(INITIAL_AI_MESSAGES);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [gitHubError, setGitHubError] = useState<string | null>(null);
  const [isGitHubConnected, setIsGitHubConnected] = useState<boolean>(false);

  const loadAllData = useCallback(async () => {
    setIsRefreshing(true);
    setGitHubError(null);

    try {
      const token = await StorageService.getAuthToken();
      const isDemo = !token || token.startsWith('demo_user_token');

      let reposData: Repository[];
      let prsData: PullRequest[];

      if (isDemo) {
        setIsGitHubConnected(false);
        reposData = MOCK_REPOSITORIES;
        prsData = MOCK_PULL_REQUESTS;
      } else {
        setIsGitHubConnected(true);
        try {
          reposData = await githubService.getRepositories(token);
          if (reposData.length > 0) {
            prsData = await githubService.getPullRequests(reposData[0].name, reposData[0].owner, token);
          } else {
            prsData = [];
          }
        } catch (ghErr: any) {
          const apiErr = ghErr as GitHubApiError;
          setGitHubError(apiErr.message || 'Error fetching GitHub repositories.');
          reposData = MOCK_REPOSITORIES;
          prsData = MOCK_PULL_REQUESTS;
        }
      }

      const hackathonsData = await hackathonService.getHackathons();
      const briefData = await aiService.getDailyBrief();
      
      const customerInfo = await revenueCatService.getCustomerInfo();
      const subData = revenueCatService.mapToSubscriptionInfo(customerInfo);

      setRepositories(reposData);
      setPullRequests(prsData);
      setHackathons(hackathonsData);
      setDailyBrief(briefData);
      setSubscription(subData);
    } catch (e) {
      console.error('Error loading AppContext data:', e);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const refreshData = async () => {
    await loadAllData();
  };

  const markAlertAsRead = async (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const markAllAlertsAsRead = async () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const triggerTestNotification = async (payload: EventPayload) => {
    const newAlert = await notificationService.sendTestNotification(payload);
    if (newAlert) {
      setAlerts(prev => [newAlert, ...prev]);
    }
  };

  const toggleHackathonTask = async (hackathonId: string, taskId: string) => {
    const updated = await hackathonService.toggleTask(hackathonId, taskId);
    setHackathons(prev => prev.map(h => h.id === hackathonId ? updated : h));
  };

  const sendAIChatMessage = async (text: string) => {
    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: 'Just now',
    };
    setChatMessages(prev => [...prev, userMsg]);

    const responseMsg = await aiService.sendChatMessage(text, chatMessages);
    setChatMessages(prev => [...prev, responseMsg]);
  };

  const explainPRWithAI = async (pr: PullRequest): Promise<string> => {
    return await aiService.explainPullRequest(pr);
  };

  const activeAlertCount = alerts.filter(a => !a.read).length;

  return (
    <AppContext.Provider
      value={{
        repositories,
        pullRequests,
        alerts,
        hackathons,
        dailyBrief,
        subscription,
        chatMessages,
        isRefreshing,
        activeAlertCount,
        gitHubError,
        isGitHubConnected,
        refreshData,
        markAlertAsRead,
        markAllAlertsAsRead,
        toggleHackathonTask,
        sendAIChatMessage,
        explainPRWithAI,
        triggerTestNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
