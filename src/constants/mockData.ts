import { 
  UserProfile, 
  Repository, 
  PullRequest, 
  SmartAlert, 
  Hackathon, 
  AIDailyBrief, 
  AIMessage,
  SubscriptionInfo 
} from '../types';

export const MOCK_USER: UserProfile = {
  id: 'user_devflow_99',
  username: 'alexdevflow',
  displayName: 'Alex Rivers',
  email: 'alex.rivers@devflow.app',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
  isDemoUser: true,
  githubConnected: true,
  isPro: true,
  joinedAt: '2026-01-15',
};

export const MOCK_SUBSCRIPTION: SubscriptionInfo = {
  isPro: true,
  plan: 'pro',
  status: 'active',
  renewalDate: '2026-10-28',
  revenueCatAppUserId: '$RCAnonymousID:a9284bc7102941',
  entitlements: {
    unlimitedRepos: true,
    aiBriefs: true,
    aiPRSummaries: true,
    smartAlerts: true,
    multiHackathons: true,
  },
};

export const MOCK_REPOSITORIES: Repository[] = [
  {
    id: 'repo-1',
    name: 'DevFlow-Mobile',
    owner: 'alexdevflow',
    stars: 142,
    openPRs: 2,
    buildStatus: 'failed',
    lastActivity: '12 mins ago',
    language: 'TypeScript',
    isPrivate: true,
    description: 'AI-powered GitHub and Hackathon Companion React Native mobile app',
    forksCount: 28,
    defaultBranch: 'main',
    actionsStatus: {
      lastRunAt: '15 mins ago',
      workflowName: 'Android Release CI',
      status: 'failure',
    },
  },
  {
    id: 'repo-2',
    name: 'ai-code-reviewer-service',
    owner: 'devflow-labs',
    stars: 589,
    openPRs: 1,
    buildStatus: 'success',
    lastActivity: '1 hour ago',
    language: 'Python',
    isPrivate: false,
    description: 'LLM backend pipeline for generating smart PR reviews and code diff insights',
    forksCount: 94,
    defaultBranch: 'main',
    actionsStatus: {
      lastRunAt: '1 hour ago',
      workflowName: 'Deploy Engine to AWS',
      status: 'success',
    },
  },
  {
    id: 'repo-3',
    name: 'hackathon-starter-kit',
    owner: 'alexdevflow',
    stars: 84,
    openPRs: 0,
    buildStatus: 'success',
    lastActivity: '3 hours ago',
    language: 'TypeScript',
    isPrivate: false,
    description: 'Ultra-fast Next.js + Tailwind + Supabase boilerplate for 48h hackathons',
    forksCount: 19,
    defaultBranch: 'main',
    actionsStatus: {
      lastRunAt: '3 hours ago',
      workflowName: 'Vercel Deployment Check',
      status: 'success',
    },
  },
  {
    id: 'repo-4',
    name: 'rust-wasm-parser',
    owner: 'alexdevflow',
    stars: 215,
    openPRs: 3,
    buildStatus: 'running',
    lastActivity: 'Yesterday',
    language: 'Rust',
    isPrivate: true,
    description: 'High-performance WebAssembly AST parser for fast client-side syntax indexing',
    forksCount: 31,
    defaultBranch: 'master',
    actionsStatus: {
      lastRunAt: 'Running now...',
      workflowName: 'Cargo Build & Test Matrix',
      status: 'in_progress',
    },
  },
];

export const MOCK_PULL_REQUESTS: PullRequest[] = [
  {
    id: 'pr-101',
    title: 'feat: integrate RevenueCat SDK abstraction & subscription state manager',
    repository: 'DevFlow-Mobile',
    owner: 'alexdevflow',
    author: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=256&auto=format&fit=crop',
      username: 'elena_r',
    },
    status: 'open',
    changedFiles: 8,
    additions: 342,
    deletions: 48,
    reviewStatus: 'review_required',
    branch: 'feat/revenuecat-service',
    targetBranch: 'main',
    createdAt: '2 hours ago',
    updatedAt: '30 mins ago',
    aiSummary: 'This PR adds a clean RevenueCat service wrapper with fallback mock purchase handlers. It implements user entitlement checks, offering metadata caching, and prepares native bridge hooks for RevenueCat SDK integration.',
    diffSnippet: `+ export class RevenueCatService implements IRevenueCatService {
+   async getOfferings(): Promise<PurchasesOffering | null> {
+     // Native RevenueCat SDK invocation point
+     return mockOfferings;
+   }
+ }`,
  },
  {
    id: 'pr-102',
    title: 'fix(android): resolve Hermes memory leak in reanimated worklet loop',
    repository: 'DevFlow-Mobile',
    owner: 'alexdevflow',
    author: {
      name: 'Alex Rivers',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
      username: 'alexdevflow',
    },
    status: 'open',
    changedFiles: 3,
    additions: 29,
    deletions: 114,
    reviewStatus: 'approved',
    branch: 'fix/android-worklet-leak',
    targetBranch: 'main',
    createdAt: '5 hours ago',
    updatedAt: '1 hour ago',
    aiSummary: 'Fixes a memory retention issue on Android devices by replacing anonymous closure allocations inside `useAnimatedStyle` with `useSharedValue` references.',
    diffSnippet: `- const style = useAnimatedStyle(() => ({ opacity: withTiming(val.value * Math.random()) }));
+ const style = useAnimatedStyle(() => ({ opacity: withTiming(val.value) }));`,
  },
  {
    id: 'pr-103',
    title: 'refactor: streaming Gemini 1.5 Pro response parser for AI Assistant tab',
    repository: 'ai-code-reviewer-service',
    owner: 'devflow-labs',
    author: {
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop',
      username: 'mvance_tech',
    },
    status: 'merged',
    changedFiles: 14,
    additions: 512,
    deletions: 203,
    reviewStatus: 'approved',
    branch: 'feature/gemini-stream-parser',
    targetBranch: 'main',
    createdAt: 'Yesterday',
    updatedAt: 'Yesterday',
    aiSummary: 'Switches LLM streaming parser from standard HTTP chunk parsing to SSE event-stream chunk decoder, improving message render latency by 450ms on low bandwidth.',
    diffSnippet: `+ async function* streamGeminiChunks(responseStream) {
+   const reader = responseStream.getReader();
+   // decode UTF-8 tokens...
+ }`,
  },
];

export const MOCK_ALERTS: SmartAlert[] = [
  {
    id: 'alert-1',
    title: 'Android Release Build Failed',
    description: 'Gradle compilation failed on step :app:assembleRelease due to missing keystore environment variable in GitHub Secrets.',
    repository: 'DevFlow-Mobile',
    timestamp: '15 mins ago',
    severity: 'critical',
    type: 'build_failed',
    read: false,
    metadata: {
      buildId: '#1084',
      branch: 'main',
      author: 'alexdevflow',
    },
  },
  {
    id: 'alert-2',
    title: 'Hackathon Submission Deadline Approaching',
    description: 'RevenueCat Hackathon ends in 4 days and 12 hours! Final submission video and repo URL required.',
    repository: 'DevFlow-Mobile',
    timestamp: '1 hour ago',
    severity: 'important',
    type: 'hackathon_deadline',
    read: false,
  },
  {
    id: 'alert-3',
    title: 'PR Review Required by Elena',
    description: 'Pull Request #42 ("integrate RevenueCat SDK abstraction") requires your review before merging.',
    repository: 'DevFlow-Mobile',
    timestamp: '2 hours ago',
    severity: 'important',
    type: 'pr_review_required',
    read: false,
    metadata: {
      prNumber: 42,
      author: 'elena_r',
    },
  },
  {
    id: 'alert-4',
    title: 'Pull Request Merged to Main',
    description: 'Marcus Vance merged PR #38 "streaming Gemini 1.5 Pro response parser" into devflow-labs/main.',
    repository: 'ai-code-reviewer-service',
    timestamp: 'Yesterday',
    severity: 'informational',
    type: 'pr_merged',
    read: true,
  },
  {
    id: 'alert-5',
    title: 'Staging Vercel Deployment Failed',
    description: 'Deployment preview timed out after 300 seconds during static page generation.',
    repository: 'hackathon-starter-kit',
    timestamp: 'Yesterday',
    severity: 'critical',
    type: 'deployment_failed',
    read: true,
  },
];

export const MOCK_HACKATHONS: Hackathon[] = [
  {
    id: 'hack-1',
    name: 'RevenueCat Mobile Hackathon 2026',
    organizer: 'RevenueCat & Expo',
    submissionDeadline: new Date(Date.now() + (4 * 24 * 60 * 60 + 12 * 60 * 60) * 1000).toISOString(),
    progressPercentage: 72,
    submissionStatus: 'in_progress',
    projectRepo: 'DevFlow-Mobile',
    tagline: 'AI-Powered Mobile Hackathon & GitHub Companion',
    prizePool: '$50,000 in Prizes',
    technologies: ['React Native', 'Expo', 'TypeScript', 'RevenueCat SDK', 'Gemini AI'],
    tasks: [
      { id: 't1', title: 'Initialize Expo Router mobile application structure', completed: true, category: 'frontend' },
      { id: 't2', title: 'Implement Smart Alerts & AI Briefing system', completed: true, category: 'ai' },
      { id: 't3', title: 'Architect RevenueCat Subscription Service abstraction', completed: true, category: 'backend' },
      { id: 't4', title: 'Prepare GitHub API & AI Chat assistant interface', completed: true, category: 'ai' },
      { id: 't5', title: 'Record 2-minute mobile demo video & complete submission', completed: false, category: 'demo' },
    ],
  },
  {
    id: 'hack-2',
    name: 'Global Developer AI Challenge',
    organizer: 'Google DeepMind',
    submissionDeadline: new Date(Date.now() + (12 * 24 * 60 * 60 + 6 * 60 * 60) * 1000).toISOString(),
    progressPercentage: 45,
    submissionStatus: 'in_progress',
    projectRepo: 'ai-code-reviewer-service',
    tagline: 'Autonomous AI PR review assistant with real-time diff analysis',
    prizePool: '$100,000 GCP Credits',
    technologies: ['Python', 'Gemini 1.5 Pro', 'FastAPI', 'Docker'],
    tasks: [
      { id: 't21', title: 'Design prompt chain for diff parsing', completed: true, category: 'ai' },
      { id: 't22', title: 'Setup async SSE webhook endpoint', completed: true, category: 'backend' },
      { id: 't23', title: 'Benchmark model accuracy on 500 open source PRs', completed: false, category: 'ai' },
    ],
  },
];

export const MOCK_DAILY_BRIEF: AIDailyBrief = {
  date: 'Today, Sep 28',
  greeting: 'Good morning 👋',
  commitsYesterday: 12,
  prsWaitingReview: 2,
  failedBuilds: 1,
  commitsSummary: 'Yesterday, 12 commits were pushed across 3 active repositories. Main work focused on mobile React Native performance optimization, Hermes engine worklets, and RevenueCat subscription interface architecture.',
  pullRequestSummary: '2 Pull Requests need your review: PR #42 (RevenueCat service integration by Elena) and PR #43 (Hermes memory leak patch). PR #38 (Gemini streaming parser) was successfully merged into main.',
  cicdSummary: '1 GitHub Actions build failed on `DevFlow-Mobile` (Android Release CI step :app:assembleRelease). 2 other builds passed cleanly.',
  importantIssues: [
    { id: 'iss-1', title: 'Fix Android keystore secret in CI/CD pipeline', repo: 'DevFlow-Mobile', priority: 'high' },
    { id: 'iss-2', title: 'Complete RevenueCat entitlement check callback', repo: 'DevFlow-Mobile', priority: 'high' },
    { id: 'iss-3', title: 'Add dark mode contrast polish for low-light demo', repo: 'DevFlow-Mobile', priority: 'medium' },
  ],
  hackathonDeadlines: [
    { name: 'RevenueCat Mobile Hackathon', timeLeftFormatted: '4d 12h', hoursLeft: 108 },
    { name: 'Global Developer AI Challenge', timeLeftFormatted: '12d 06h', hoursLeft: 294 },
  ],
  aiRecommendation: '🚀 Focus today on resolving the Android Release CI keystore error, reviewing Elena\'s RevenueCat PR #42, and testing the 2-minute demo recording for the RevenueCat Hackathon deadline.',
};

export const INITIAL_AI_MESSAGES: AIMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    content: `Hello Alex! ⚡ I am your DevFlow AI Companion.\n\nI am monitoring **4 repositories**, tracking **2 pending PRs**, and keeping an eye on your **RevenueCat Hackathon** deadline (4 days remaining).\n\nHow can I help you accelerate your development today?`,
    timestamp: 'Just now',
    suggestedActions: [
      { label: 'Summarize today\'s activity', action: 'summarize_today' },
      { label: 'Explain PR #42', action: 'explain_pr_42' },
      { label: 'Generate commit message', action: 'gen_commit' },
      { label: 'What should I work on next?', action: 'next_priority' },
    ],
  },
];
