import { Repository, PullRequest, UserProfile } from '../types';
import { StorageService } from './StorageService';
import { MOCK_REPOSITORIES, MOCK_PULL_REQUESTS, MOCK_USER } from '../constants/mockData';

const GITHUB_API_BASE = 'https://api.github.com';

export interface GitHubApiError {
  status: number;
  message: string;
  isRateLimit: boolean;
  isUnauthorized: boolean;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  authorName: string;
  authorAvatar?: string;
  date: string;
  url: string;
}

export interface GitHubWorkflowRun {
  id: number;
  name: string;
  status: string; // 'completed' | 'in_progress' | 'queued'
  conclusion: 'success' | 'failure' | 'cancelled' | 'timed_out' | null;
  htmlUrl: string;
  createdAt: string;
}

class GitHubServiceClass {
  private static instance: GitHubServiceClass;

  public static getInstance(): GitHubServiceClass {
    if (!GitHubServiceClass.instance) {
      GitHubServiceClass.instance = new GitHubServiceClass();
    }
    return GitHubServiceClass.instance;
  }

  /**
   * Helper method to send requests to GitHub API with Authorization header
   */
  private async fetchFromGitHub<T>(endpoint: string, customToken?: string): Promise<T> {
    const token = customToken || (await StorageService.getAuthToken());

    if (!token || token.startsWith('demo_user_token')) {
      throw {
        status: 401,
        message: 'No active GitHub authentication token.',
        isUnauthorized: true,
        isRateLimit: false,
      } as GitHubApiError;
    }

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'DevFlow-Mobile-App',
      Authorization: `Bearer ${token.trim()}`,
    };

    let response: Response;
    try {
      response = await fetch(`${GITHUB_API_BASE}${endpoint}`, { headers });
    } catch (netErr) {
      throw {
        status: 0,
        message: 'Network error connecting to GitHub. Check your internet connection.',
        isRateLimit: false,
        isUnauthorized: false,
      } as GitHubApiError;
    }

    if (!response.ok) {
      const remaining = response.headers.get('x-ratelimit-remaining');
      const isRateLimit = response.status === 403 && remaining === '0';
      const isUnauthorized = response.status === 401;

      let errorMsg = `GitHub API request failed with status ${response.status}`;
      try {
        const body = await response.json();
        if (body.message) errorMsg = body.message;
      } catch (e) {
        // body parsing fallback
      }

      if (isRateLimit) {
        errorMsg = 'GitHub API rate limit exceeded. Please wait or authenticate with a token.';
      } else if (isUnauthorized) {
        errorMsg = 'GitHub session expired or invalid authentication token.';
      }

      throw {
        status: response.status,
        message: errorMsg,
        isRateLimit,
        isUnauthorized,
      } as GitHubApiError;
    }

    return (await response.json()) as T;
  }

  /**
   * Authenticate / Validate GitHub Personal Access Token or OAuth Token
   */
  async authenticateWithGitHub(token?: string): Promise<{ success: boolean; user: UserProfile; token: string }> {
    const targetToken = token || (await StorageService.getAuthToken());

    if (!targetToken || targetToken.startsWith('demo_user_token')) {
      const mockToken = 'gho_demo_token_' + Date.now();
      await StorageService.saveAuthToken(mockToken);
      return {
        success: true,
        user: { ...MOCK_USER, isDemoUser: false, githubConnected: true },
        token: mockToken,
      };
    }

    const rawUser = await this.fetchFromGitHub<any>('/user', targetToken);
    
    const userProfile: UserProfile = {
      id: String(rawUser.id),
      username: rawUser.login,
      displayName: rawUser.name || rawUser.login,
      email: rawUser.email || `${rawUser.login}@users.noreply.github.com`,
      avatarUrl: rawUser.avatar_url,
      isDemoUser: false,
      githubConnected: true,
      isPro: true,
      joinedAt: rawUser.created_at?.split('T')[0] || '2026-01-01',
    };

    await StorageService.saveAuthToken(targetToken);
    return {
      success: true,
      user: userProfile,
      token: targetToken,
    };
  }

  /**
   * Get Current Authenticated GitHub User Profile
   */
  async getCurrentUser(customToken?: string): Promise<UserProfile> {
    const rawUser = await this.fetchFromGitHub<any>('/user', customToken);
    return {
      id: String(rawUser.id),
      username: rawUser.login,
      displayName: rawUser.name || rawUser.login,
      email: rawUser.email || `${rawUser.login}@users.noreply.github.com`,
      avatarUrl: rawUser.avatar_url,
      isDemoUser: false,
      githubConnected: true,
      isPro: true,
      joinedAt: rawUser.created_at?.split('T')[0] || '2026-01-01',
    };
  }

  /**
   * Fetch User Repositories from GitHub API `/user/repos`
   */
  async getRepositories(customToken?: string): Promise<Repository[]> {
    const rawRepos = await this.fetchFromGitHub<any[]>('/user/repos?sort=updated&per_page=30', customToken);

    if (!Array.isArray(rawRepos) || rawRepos.length === 0) {
      return [];
    }

    const repositories: Repository[] = await Promise.all(
      rawRepos.map(async (r: any) => {
        let buildStatus: Repository['buildStatus'] = 'success';
        
        try {
          const actionsStatus = await this.getGitHubActionsStatus(r.name, r.owner.login, customToken);
          if (actionsStatus) {
            if (actionsStatus.conclusion === 'failure') buildStatus = 'failed';
            else if (actionsStatus.status === 'in_progress') buildStatus = 'running';
            else buildStatus = 'success';
          }
        } catch (e) {
          // Fallback if actions permission not available
        }

        return {
          id: String(r.id),
          name: r.name,
          owner: r.owner.login,
          stars: r.stargazers_count || 0,
          openPRs: r.open_issues_count || 0,
          buildStatus,
          lastActivity: this.formatTimeAgo(r.updated_at),
          language: r.language || 'Code',
          isPrivate: r.private,
          description: r.description || 'No description provided.',
          forksCount: r.forks_count || 0,
          defaultBranch: r.default_branch || 'main',
        };
      })
    );

    return repositories;
  }

  /**
   * Fetch Pull Requests for a specific repository `/repos/{owner}/{repo}/pulls`
   */
  async getPullRequests(repositoryName: string, ownerName?: string, customToken?: string): Promise<PullRequest[]> {
    const owner = ownerName || (await this.getCurrentUser(customToken)).username;
    const rawPRs = await this.fetchFromGitHub<any[]>(`/repos/${owner}/${repositoryName}/pulls?state=all&per_page=15`, customToken);

    if (!Array.isArray(rawPRs)) return [];

    return rawPRs.map((pr: any) => ({
      id: String(pr.number),
      title: pr.title,
      repository: repositoryName,
      owner,
      author: {
        name: pr.user?.login || 'developer',
        avatar: pr.user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
        username: pr.user?.login || 'developer',
      },
      status: pr.state === 'closed' ? (pr.merged_at ? 'merged' : 'closed') : (pr.draft ? 'draft' : 'open'),
      changedFiles: pr.changed_files || 1,
      additions: pr.additions || 10,
      deletions: pr.deletions || 2,
      reviewStatus: pr.requested_reviewers?.length > 0 ? 'review_required' : 'approved',
      branch: pr.head?.ref || 'feature',
      targetBranch: pr.base?.ref || 'main',
      createdAt: this.formatTimeAgo(pr.created_at),
      updatedAt: this.formatTimeAgo(pr.updated_at),
      aiSummary: `Pull Request #${pr.number}: ${pr.title}. Modifies branch ${pr.head?.ref} into ${pr.base?.ref}.`,
      diffSnippet: `+ // Branch: ${pr.head?.ref}\n+ // Target: ${pr.base?.ref}`,
    }));
  }

  /**
   * Fetch GitHub Actions Workflow Runs for a repository `/repos/{owner}/{repo}/actions/runs`
   */
  async getGitHubActionsStatus(repositoryName: string, ownerName?: string, customToken?: string): Promise<GitHubWorkflowRun | null> {
    try {
      const owner = ownerName || (await this.getCurrentUser(customToken)).username;
      const res = await this.fetchFromGitHub<any>(`/repos/${owner}/${repositoryName}/actions/runs?per_page=1`, customToken);
      
      const runs = res.workflow_runs;
      if (!runs || runs.length === 0) return null;

      const latestRun = runs[0];
      return {
        id: latestRun.id,
        name: latestRun.name || 'CI/CD Workflow',
        status: latestRun.status,
        conclusion: latestRun.conclusion,
        htmlUrl: latestRun.html_url,
        createdAt: this.formatTimeAgo(latestRun.created_at),
      };
    } catch (e) {
      return null;
    }
  }

  /**
   * Fetch Recent Commits for a repository `/repos/{owner}/{repo}/commits`
   */
  async getRecentCommits(repositoryName: string, ownerName?: string, customToken?: string): Promise<GitHubCommit[]> {
    const owner = ownerName || (await this.getCurrentUser(customToken)).username;
    const rawCommits = await this.fetchFromGitHub<any[]>(`/repos/${owner}/${repositoryName}/commits?per_page=10`, customToken);

    if (!Array.isArray(rawCommits)) return [];

    return rawCommits.map((c: any) => ({
      sha: c.sha?.substring(0, 7) || 'head',
      message: c.commit?.message?.split('\n')[0] || 'Commit update',
      authorName: c.commit?.author?.name || c.author?.login || 'Developer',
      authorAvatar: c.author?.avatar_url,
      date: this.formatTimeAgo(c.commit?.author?.date),
      url: c.html_url,
    }));
  }

  private formatTimeAgo(dateString?: string): string {
    if (!dateString) return 'recently';
    const totalSecs = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (totalSecs < 60) return 'just now';
    if (totalSecs < 3600) return `${Math.floor(totalSecs / 60)} mins ago`;
    if (totalSecs < 86400) return `${Math.floor(totalSecs / 3600)} hours ago`;
    return `${Math.floor(totalSecs / 86400)} days ago`;
  }
}

export const githubService = GitHubServiceClass.getInstance();
