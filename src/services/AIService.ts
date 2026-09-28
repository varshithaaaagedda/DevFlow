import { AIDailyBrief, AIMessage, PullRequest } from '../types';
import { MOCK_DAILY_BRIEF } from '../constants/mockData';

export interface IAIService {
  getDailyBrief(): Promise<AIDailyBrief>;
  explainPullRequest(pr: PullRequest): Promise<string>;
  generateCommitMessage(description: string): Promise<string>;
  sendChatMessage(message: string, history: AIMessage[]): Promise<AIMessage>;
}

export class AIService implements IAIService {
  private static instance: AIService;

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async getDailyBrief(): Promise<AIDailyBrief> {
    await new Promise(res => setTimeout(res, 350));
    return MOCK_DAILY_BRIEF;
  }

  /**
   * AI PR Explanation Service
   * Integration point for LLM code diff analyzer
   */
  async explainPullRequest(pr: PullRequest): Promise<string> {
    await new Promise(res => setTimeout(res, 700));
    
    return `🤖 **DevFlow AI Diff Insight for PR #${pr.id}**\n\n` +
      `**Summary:** ${pr.aiSummary}\n\n` +
      `**Key Modifications:**\n` +
      `• Modified ${pr.changedFiles} files with **+${pr.additions}** additions and **-${pr.deletions}** deletions.\n` +
      `• Primary branch target: \`${pr.branch}\` -> \`${pr.targetBranch}\`.\n\n` +
      `**Risk Analysis:** Low risk. Clean unit test coverage and modular service architecture detected. Approved for merge.`;
  }

  /**
   * AI Commit Message Generator
   */
  async generateCommitMessage(description: string): Promise<string> {
    await new Promise(res => setTimeout(res, 500));
    
    const formatted = description.trim().toLowerCase();
    if (formatted.includes('auth') || formatted.includes('login')) {
      return `feat(auth): implement secure OAuth session persistence and demo user credentials`;
    }
    if (formatted.includes('alert') || formatted.includes('notification')) {
      return `feat(alerts): add smart push alert severity filters and real-time badge count`;
    }
    if (formatted.includes('hackathon')) {
      return `feat(hackathon): add live countdown timer and milestone checklist progress tracker`;
    }
    return `feat(core): update ${description || 'application architecture and service handlers'}`;
  }

  /**
   * AI Chat Assistant Service
   */
  async sendChatMessage(userQuery: string, history: AIMessage[]): Promise<AIMessage> {
    await new Promise(res => setTimeout(res, 800));

    const lower = userQuery.toLowerCase();
    let replyContent = '';
    let suggestedActions: AIMessage['suggestedActions'] = undefined;
    let codeSnippet: AIMessage['codeSnippet'] = undefined;

    if (lower.includes('summarize') || lower.includes('activity') || lower.includes('today')) {
      replyContent = `📊 **Today's GitHub Activity Summary:**\n\n` +
        `• **12 Commits** pushed across 3 repos.\n` +
        `• **2 PRs Pending Review**: PR #42 (RevenueCat service) & PR #43 (Android fix).\n` +
        `• **1 Failed Build**: Android Release CI build #1084 on \`DevFlow-Mobile\`.\n` +
        `• **Hackathon Countdown**: 4 days 12 hours remaining for RevenueCat Hackathon!`;
      suggestedActions = [
        { label: 'View Failed Build', action: 'view_alerts' },
        { label: 'Review PR #42', action: 'view_prs' },
      ];
    } else if (lower.includes('explain') || lower.includes('pull request') || lower.includes('pr')) {
      replyContent = `🔍 **PR #42 Breakdown:**\n\n` +
        `Author: **Elena Rostova**\n` +
        `Branch: \`feat/revenuecat-service\`\n` +
        `Changes: +342 / -48 lines across 8 files.\n\n` +
        `This PR implements the \`RevenueCatService\` contract, introducing mock entitlement checks and fallback handlers for free vs pro tier validation.`;
      codeSnippet = {
        language: 'typescript',
        code: `const purchaseResult = await revenueCatService.purchasePackage(proPackage);\nif (purchaseResult.isPro) {\n  await updateUserEntitlements({ isPro: true });\n}`,
      };
      suggestedActions = [
        { label: 'Approve PR', action: 'approve_pr' },
      ];
    } else if (lower.includes('commit') || lower.includes('message')) {
      replyContent = `✨ Here is a recommended commit message for your recent changes:\n\n` +
        `\`\`\`text\n` +
        `feat(subscription): add RevenueCat SDK integration abstractions & Pro upgrade modal\n\n` +
        `- Add RevenueCatService singleton pattern with entitlement checks\n` +
        `- Build Pro Subscription modal UI with feature matrix\n` +
        `- Wire up local storage fallback for offline demo entitlement testing\n` +
        `\`\`\``;
    } else if (lower.includes('work on') || lower.includes('next') || lower.includes('priority')) {
      replyContent = `🎯 **Recommended Next Steps (Prioritized):**\n\n` +
        `1. 🔴 **Critical**: Fix Android Keystore environment variable in GitHub Actions for \`DevFlow-Mobile\`.\n` +
        `2. 🟡 **Important**: Review and merge PR #42 from Elena (\`feat/revenuecat-service\`).\n` +
        `3. 🟢 **Hackathon Priority**: Record 2-minute demo video for RevenueCat Hackathon submission.`;
      suggestedActions = [
        { label: 'Open Alerts', action: 'view_alerts' },
        { label: 'Open Hackathon Tasks', action: 'view_hackathons' },
      ];
    } else {
      replyContent = `I evaluated your query against your connected repositories (\`DevFlow-Mobile\`, \`ai-code-reviewer-service\`).\n\n` +
        `Everything is synced. Your current build status is 1 failed, 2 passed. Would you like me to analyze the build failure stack trace or generate a hackathon project summary?`;
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      content: replyContent,
      timestamp: 'Just now',
      suggestedActions,
      codeSnippet,
    };
  }
}

export const aiService = AIService.getInstance();
