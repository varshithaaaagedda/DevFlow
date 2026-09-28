import Purchases, { 
  PurchasesOffering, 
  PurchasesOfferings, 
  CustomerInfo, 
  PurchasesPackage, 
  LOG_LEVEL 
} from 'react-native-purchases';
import { Platform } from 'react-native';
import { StorageService } from './StorageService';
import { SubscriptionInfo } from '../types';

export const PRO_ENTITLEMENT_ID = 'devflow_pro';
export const DEFAULT_OFFERING_ID = 'default';
export const MONTHLY_PACKAGE_ID = '$rc_monthly';
export const DEVFLOW_PRO_PRODUCT_ID = 'devflow_pro_monthly';

class RevenueCatServiceClass {
  private static instance: RevenueCatServiceClass;
  private isInitialized = false;

  public static getInstance(): RevenueCatServiceClass {
    if (!RevenueCatServiceClass.instance) {
      RevenueCatServiceClass.instance = new RevenueCatServiceClass();
    }
    return RevenueCatServiceClass.instance;
  }

  /**
   * Get Platform-specific RevenueCat Public SDK API Key from Environment Variables
   */
  private getApiKey(): string | null {
    if (Platform.OS === 'android') {
      return process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || null;
    } else if (Platform.OS === 'ios') {
      return process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || null;
    }
    return process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || null;
  }

  /**
   * Initialize RevenueCat SDK with App User ID & API Key
   */
  async initializeRevenueCat(customUserId?: string): Promise<boolean> {
    if (this.isInitialized) return true;

    const apiKey = this.getApiKey();
    if (!apiKey) {
      console.log('[RevenueCatService] No public API key found in EXPO_PUBLIC_REVENUECAT_API_KEY. SDK will run in Demo/Unconfigured Mode.');
      return false;
    }

    try {
      if (__DEV__) {
        await Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      let userId = customUserId || (await StorageService.getSecureItem('devflow_rc_user_id')) || undefined;
      if (!userId) {
        userId = `devflow_anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        await StorageService.setSecureItem('devflow_rc_user_id', userId);
      }

      await Purchases.configure({
        apiKey,
        appUserID: userId,
      });

      this.isInitialized = true;
      console.log(`[RevenueCatService] Configured successfully with appUserID: ${userId}`);
      return true;
    } catch (e) {
      console.warn('[RevenueCatService] Error initializing RevenueCat SDK:', e);
      return false;
    }
  }

  /**
   * Fetch Active Offerings from RevenueCat Store Configuration
   */
  async getOfferings(): Promise<PurchasesOffering | null> {
    try {
      const isConfigured = await this.initializeRevenueCat();
      if (!isConfigured) return null;

      const offerings: PurchasesOfferings = await Purchases.getOfferings();
      if (offerings.current !== null) {
        return offerings.current;
      }
      if (offerings.all && offerings.all[DEFAULT_OFFERING_ID]) {
        return offerings.all[DEFAULT_OFFERING_ID];
      }
      return null;
    } catch (e) {
      console.warn('[RevenueCatService] Error fetching offerings:', e);
      return null;
    }
  }

  /**
   * Fetch Real Customer Info & Active Entitlements
   */
  async getCustomerInfo(): Promise<CustomerInfo | null> {
    try {
      const isConfigured = await this.initializeRevenueCat();
      if (!isConfigured) return null;

      return await Purchases.getCustomerInfo();
    } catch (e) {
      console.warn('[RevenueCatService] Error fetching customer info:', e);
      return null;
    }
  }

  /**
   * Check if User has Active 'pro' Entitlement via RevenueCat
   */
  async isProUser(): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      if (!customerInfo) return false;

      const proEntitlement = customerInfo.entitlements.active[PRO_ENTITLEMENT_ID];
      return proEntitlement !== undefined && proEntitlement.isActive !== false;
    } catch (e) {
      return false;
    }
  }

  /**
   * Execute Real Package Purchase via RevenueCat StoreKit / Google Play Billing
   */
  async purchasePackage(packageToPurchase: PurchasesPackage): Promise<{
    success: boolean;
    isPro: boolean;
    userCancelled: boolean;
    customerInfo?: CustomerInfo;
    error?: string;
  }> {
    try {
      const isConfigured = await this.initializeRevenueCat();
      if (!isConfigured) {
        return {
          success: false,
          isPro: false,
          userCancelled: false,
          error: 'RevenueCat SDK is not configured with an API key. Set EXPO_PUBLIC_REVENUECAT_API_KEY in environment variables.',
        };
      }

      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      const isPro = customerInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== undefined;

      return {
        success: isPro,
        isPro,
        userCancelled: false,
        customerInfo,
      };
    } catch (e: any) {
      if (e.userCancelled) {
        return { success: false, isPro: false, userCancelled: true };
      }
      return {
        success: false,
        isPro: false,
        userCancelled: false,
        error: e.message || 'Error processing purchase via RevenueCat.',
      };
    }
  }

  /**
   * Restore Existing Store Purchases via RevenueCat
   */
  async restorePurchases(): Promise<{
    success: boolean;
    isPro: boolean;
    customerInfo?: CustomerInfo;
    error?: string;
  }> {
    try {
      const isConfigured = await this.initializeRevenueCat();
      if (!isConfigured) {
        return {
          success: false,
          isPro: false,
          error: 'RevenueCat SDK is not configured.',
        };
      }

      const customerInfo = await Purchases.restorePurchases();
      const isPro = customerInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== undefined;

      return {
        success: true,
        isPro,
        customerInfo,
      };
    } catch (e: any) {
      return {
        success: false,
        isPro: false,
        error: e.message || 'Failed to restore purchases.',
      };
    }
  }

  /**
   * Helper to map CustomerInfo to SubscriptionInfo
   */
  mapToSubscriptionInfo(customerInfo: CustomerInfo | null): SubscriptionInfo {
    const isPro = customerInfo
      ? customerInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== undefined
      : false;

    return {
      isPro,
      plan: isPro ? 'pro' : 'free',
      status: isPro ? 'active' : 'inactive',
      revenueCatAppUserId: customerInfo?.originalAppUserId || '$RCAnonymousID:pending',
      entitlements: {
        unlimitedRepos: isPro,
        aiBriefs: isPro,
        aiPRSummaries: isPro,
        smartAlerts: isPro,
        multiHackathons: isPro,
      },
    };
  }
}

export const revenueCatService = RevenueCatServiceClass.getInstance();

export const initializeRevenueCat = (customUserId?: string) => revenueCatService.initializeRevenueCat(customUserId);
export const getOfferings = () => revenueCatService.getOfferings();
export const getCustomerInfo = () => revenueCatService.getCustomerInfo();
export const purchasePackage = (packageToPurchase: PurchasesPackage) => revenueCatService.purchasePackage(packageToPurchase);
export const restorePurchases = () => revenueCatService.restorePurchases();
export const isProUser = () => revenueCatService.isProUser();

