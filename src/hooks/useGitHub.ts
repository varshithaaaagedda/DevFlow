import { useState, useCallback, useEffect } from 'react';
import { githubService, GitHubApiError, GitHubWorkflowRun, GitHubCommit } from '../services/githubService';
import { Repository, PullRequest, UserProfile } from '../types';
import { MOCK_REPOSITORIES, MOCK_PULL_REQUESTS } from '../constants/mockData';
import { StorageService } from '../services/StorageService';

interface UseGitHubReturn {
  repositories: Repository[];
  pullRequests: PullRequest[];
  currentUser: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isRateLimited: boolean;
  isConnectedToGitHub: boolean;
  refreshGitHubData: () => Promise<void>;
  connectWithToken: (token: string) => Promise<boolean>;
  getWorkflowStatus: (repoName: string, owner?: string) => Promise<GitHubWorkflowRun | null>;
  getCommits: (repoName: string, owner?: string) => Promise<GitHubCommit[]>;
}

export const useGitHub = (): UseGitHubReturn => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false);
  const [isConnectedToGitHub, setIsConnectedToGitHub] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsRateLimited(false);

    try {
      const token = await StorageService.getAuthToken();
      const isDemo = !token || token.startsWith('demo_user_token');

      if (isDemo) {
        // In Demo Mode: use realistic mock data
        setRepositories(MOCK_REPOSITORIES);
        setPullRequests(MOCK_PULL_REQUESTS);
        setIsConnectedToGitHub(false);
      } else {
        // Authenticated with GitHub: fetch live data
        setIsConnectedToGitHub(true);
        const user = await githubService.getCurrentUser(token);
        setCurrentUser(user);

        const repos = await githubService.getRepositories(token);
        setRepositories(repos);

        // Fetch PRs across user repos
        if (repos.length > 0) {
          const prs = await githubService.getPullRequests(repos[0].name, repos[0].owner, token);
          setPullRequests(prs);
        } else {
          setPullRequests([]);
        }
      }
    } catch (err: any) {
      console.warn('GitHub data fetch error:', err);
      const apiErr = err as GitHubApiError;
      
      if (apiErr.isRateLimit) {
        setIsRateLimited(true);
        setError('GitHub API rate limit exceeded. Falling back to cached data.');
      } else if (apiErr.isUnauthorized) {
        setError('GitHub token invalid or expired. Re-authenticate to access real repos.');
        setIsConnectedToGitHub(false);
      } else {
        setError(apiErr.message || 'Unable to connect to GitHub API.');
      }

      // Safe fallback to mock data on error so UI never crashes
      setRepositories(MOCK_REPOSITORIES);
      setPullRequests(MOCK_PULL_REQUESTS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const connectWithToken = async (token: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await githubService.authenticateWithGitHub(token);
      if (res.success) {
        setCurrentUser(res.user);
        setIsConnectedToGitHub(true);
        await loadData();
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Invalid GitHub token. Please verify permissions.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getWorkflowStatus = async (repoName: string, owner?: string): Promise<GitHubWorkflowRun | null> => {
    try {
      return await githubService.getGitHubActionsStatus(repoName, owner);
    } catch (e) {
      return null;
    }
  };

  const getCommits = async (repoName: string, owner?: string): Promise<GitHubCommit[]> => {
    try {
      return await githubService.getRecentCommits(repoName, owner);
    } catch (e) {
      return [];
    }
  };

  return {
    repositories,
    pullRequests,
    currentUser,
    isLoading,
    error,
    isRateLimited,
    isConnectedToGitHub,
    refreshGitHubData: loadData,
    connectWithToken,
    getWorkflowStatus,
    getCommits,
  };
};
