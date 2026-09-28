import { useState, useEffect, useCallback } from 'react';
import { revenueCatService, PRO_ENTITLEMENT_ID } from '../services/revenueCatService';
import { PurchasesOffering, PurchasesPackage, CustomerInfo } from 'react-native-purchases';
import { SubscriptionInfo } from '../types';
import { useRouter } from 'expo-router';

export type ProFeature =
  | 'unlimited_repos'
  | 'ai_daily_brief'
  | 'ai_pr_summaries'
  | 'ai_commit_messages'
  | 'advanced_smart_alerts'
  | 'multiple_hackathons';

interface UseSubscriptionReturn {
  subscription: SubscriptionInfo;
  offering: PurchasesOffering | null;
  isLoading: boolean;
  isConfigured: boolean;
  error: string | null;
  refreshSubscription: () => Promise<void>;
  purchaseProPackage: (pkg?: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<{ success: boolean; isPro: boolean; message: string }>;
  checkFeatureAccess: (feature: ProFeature) => boolean;
  requireProFeature: (feature: ProFeature, onAccessDenied?: () => void) => boolean;
}

export const useSubscription = (): UseSubscriptionReturn => {
  const [subscription, setSubscription] = useState<SubscriptionInfo>({
    isPro: false,
    plan: 'free',
    status: 'inactive',
    entitlements: {
      unlimitedRepos: false,
      aiBriefs: false,
      aiPRSummaries: false,
      smartAlerts: false,
      multiHackathons: false,
    },
  });

  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const loadSubscriptionData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const configured = await revenueCatService.initializeRevenueCat();
      setIsConfigured(configured);

      if (configured) {
        const [customerInfo, currentOffering] = await Promise.all([
          revenueCatService.getCustomerInfo(),
          revenueCatService.getOfferings(),
        ]);

        const mappedSub = revenueCatService.mapToSubscriptionInfo(customerInfo);
        setSubscription(mappedSub);
        setOffering(currentOffering);
      }
    } catch (e: any) {
      console.warn('RevenueCat hook load error:', e);
      setError(e.message || 'Error communicating with RevenueCat API.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubscriptionData();
  }, [loadSubscriptionData]);

  const purchaseProPackage = async (pkg?: PurchasesPackage): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const targetPackage = pkg || offering?.monthly || offering?.availablePackages[0];
      if (!targetPackage) {
        setError('No active RevenueCat offering package available for purchase.');
        setIsLoading(false);
        return false;
      }

      const res = await revenueCatService.purchasePackage(targetPackage);
      if (res.userCancelled) {
        setIsLoading(false);
        return false;
      }

      if (res.success) {
        const mapped = revenueCatService.mapToSubscriptionInfo(res.customerInfo || null);
        setSubscription(mapped);
        setIsLoading(false);
        return true;
      }

      setError(res.error || 'Purchase failed to grant pro entitlement.');
      setIsLoading(false);
      return false;
    } catch (e: any) {
      setError(e.message || 'Error processing purchase.');
      setIsLoading(false);
      return false;
    }
  };

  const restorePurchases = async () => {
    setIsLoading(true);
    const res = await revenueCatService.restorePurchases();
    if (res.success) {
      const mapped = revenueCatService.mapToSubscriptionInfo(res.customerInfo || null);
      setSubscription(mapped);
      setIsLoading(false);
      return {
        success: true,
        isPro: res.isPro,
        message: res.isPro
          ? 'Purchases restored successfully! Pro Plan entitlement active.'
          : 'Purchases restored. No active Pro entitlement found for this store account.',
      };
    }

    setIsLoading(false);
    return {
      success: false,
      isPro: false,
      message: res.error || 'Unable to restore purchases.',
    };
  };

  /**
   * Check if current user has access to a specific Pro feature
   */
  const checkFeatureAccess = (feature: ProFeature): boolean => {
    if (subscription.isPro) return true;
    return false;
  };

  /**
   * Enforce Pro feature access; if free user, navigate to paywall screen
   */
  const requireProFeature = (feature: ProFeature, onAccessDenied?: () => void): boolean => {
    if (checkFeatureAccess(feature)) return true;

    if (onAccessDenied) {
      onAccessDenied();
    } else {
      router.push('/subscription');
    }
    return false;
  };

  return {
    subscription,
    offering,
    isLoading,
    isConfigured,
    error,
    refreshSubscription: loadSubscriptionData,
    purchaseProPackage,
    restorePurchases,
    checkFeatureAccess,
    requireProFeature,
  };
};
