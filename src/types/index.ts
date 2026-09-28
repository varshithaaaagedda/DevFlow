export type AlertSeverity = 'critical' | 'important' | 'informational';

export type AlertType = 
  | 'build_failed'
  | 'pr_merged'
  | 'pr_review_required'
  | 'deployment_failed'
  | 'hackathon_deadline';

export interface SmartAlert {
  id: string;
  title: string;
  description: string;
  repository: string;
  timestamp: string;
  severity: AlertSeverity;
  type: AlertType;
  read: boolean;
  actionUrl?: string;
  metadata?: {
    prNumber?: number;
    buildId?: string;
    branch?: string;
    author?: string;
  };
}

export interface Repository {
  id: string;
  name: string;
  owner: string;
  stars: number;
  openPRs: number;
  buildStatus: 'success' | 'failed' | 'running' | 'queued';
  lastActivity: string;
  language: string;
  isPrivate: boolean;
  description: string;
  forksCount: number;
  defaultBranch: string;
  actionsStatus?: {
    lastRunAt: string;
    workflowName: string;
    status: 'success' | 'failure' | 'in_progress';
  };
}

export interface PullRequest {
  id: string;
  title: string;
  repository: string;
  owner: string;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  status: 'open' | 'merged' | 'closed' | 'draft';
  changedFiles: number;
  additions: number;
  deletions: number;
  reviewStatus: 'approved' | 'changes_requested' | 'review_required' | 'pending';
  branch: string;
  targetBranch: string;
  createdAt: string;
  updatedAt: string;
  aiSummary?: string;
  diffSnippet?: string;
}

export interface CommitSummary {
  id: string;
  message: string;
  repository: string;
  author: string;
  hash: string;
  timestamp: string;
  additions: number;
  deletions: number;
}

export interface HackathonTask {
  id: string;
  title: string;
  completed: boolean;
  category: 'frontend' | 'backend' | 'ai' | 'demo' | 'submission';
}

export interface Hackathon {
  id: string;
  name: string;
  organizer: string;
  submissionDeadline: string; // ISO date string
  progressPercentage: number; // 0 - 100
  submissionStatus: 'in_progress' | 'ready_for_review' | 'submitted' | 'completed';
  projectRepo: string;
  tagline: string;
  prizePool: string;
  tasks: HackathonTask[];
  technologies: string[];
}

export interface AIDailyBrief {
  date: string;
  greeting: string;
  commitsYesterday: number;
  prsWaitingReview: number;
  failedBuilds: number;
  commitsSummary: string;
  pullRequestSummary: string;
  cicdSummary: string;
  importantIssues: Array<{
    id: string;
    title: string;
    repo: string;
    priority: 'high' | 'medium';
  }>;
  hackathonDeadlines: Array<{
    name: string;
    timeLeftFormatted: string;
    hoursLeft: number;
  }>;
  aiRecommendation: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: Array<{
    label: string;
    action: string;
  }>;
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  isDemoUser: boolean;
  githubConnected: boolean;
  isPro: boolean;
  joinedAt: string;
}

export interface SubscriptionInfo {
  isPro: boolean;
  plan: 'free' | 'pro';
  status: 'active' | 'inactive' | 'trial';
  renewalDate?: string;
  revenueCatAppUserId?: string;
  entitlements: {
    unlimitedRepos: boolean;
    aiBriefs: boolean;
    aiPRSummaries: boolean;
    smartAlerts: boolean;
    multiHackathons: boolean;
  };
}

export interface AppSettings {
  notificationsEnabled: boolean;
  pushAlertsCriticalOnly: boolean;
  demoMode: boolean;
  githubOAuthEnabled: boolean;
  aiModelPreference: 'gpt-4o' | 'gemini-1.5-pro' | 'claude-3-5-sonnet';
  autoRefreshInterval: number; // seconds
}
