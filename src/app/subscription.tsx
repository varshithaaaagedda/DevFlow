import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Header } from '../components/Header';
import { useSubscription } from '../hooks/useSubscription';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SubscriptionScreen() {
  const { 
    subscription, 
    offering, 
    isLoading, 
    isConfigured, 
    error, 
    purchaseProPackage, 
    restorePurchases 
  } = useSubscription();

  const router = useRouter();

  const monthlyPackage = offering?.monthly || offering?.availablePackages[0];
  const priceString = monthlyPackage?.product.priceString || '$4.99 / month';

  const handlePurchase = async () => {
    const success = await purchaseProPackage(monthlyPackage);
    if (success) {
      Alert.alert(
        'Pro Subscription Activated 🎉',
        'Your RevenueCat "devflow_pro" entitlement is active! Thank you for supporting DevFlow.',
        [{ text: 'Awesome', onPress: () => router.back() }]
      );
    } else if (error) {
      Alert.alert('Subscription Notice', error);
    }
  };

  const handleRestore = async () => {
    const res = await restorePurchases();
    Alert.alert('Restore Purchases', res.message);
  };

  const isPro = subscription.isPro;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header title="DevFlow Pro" subtitle="RevenueCat Mobile Billing" showBack={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Hero Banner */}
        <LinearGradient
          colors={['#3B0764', '#1E1B4B', '#0F172A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBox}
        >
          <View style={styles.crownIconBox}>
            <Ionicons name="sparkles" size={28} color="#F59E0B" />
          </View>
          <Text style={styles.heroTitle}>Unlock Full AI & GitHub Power</Text>
          <Text style={styles.heroPrice}>{priceString}</Text>
          <Text style={styles.heroSub}>Official Store Billing • Cancel Anytime</Text>
        </LinearGradient>

        {/* Pro Active Status Badge */}
        {isPro && (
          <View style={styles.activeProBadge}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
            <Text style={styles.activeProText}>RevenueCat Entitlement "devflow_pro" Active!</Text>
          </View>
        )}

        {/* Demo Mode / SDK Notice */}
        {!isConfigured && (
          <View style={styles.demoNoticeBox}>
            <Ionicons name="information-circle-outline" size={18} color={COLORS.hackathonGold} />
            <Text style={styles.demoNoticeText}>
              RevenueCat SDK Unconfigured: Running in Demo Mode. Set EXPO_PUBLIC_REVENUECAT_API_KEY for store purchasing.
            </Text>
          </View>
        )}

        {/* Feature Comparison Matrix */}
        <View style={styles.matrixContainer}>
          <Text style={styles.matrixTitle}>DEVFLOW PRO INCLUDED FEATURES</Text>

          {/* Feature 1 */}
          <View style={styles.matrixRow}>
            <View style={styles.featureLabelRow}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
              <Text style={styles.featureName}>Unlimited repositories</Text>
            </View>
            <Text style={styles.proCol}>Unlimited</Text>
          </View>

          {/* Feature 2 */}
          <View style={styles.matrixRow}>
            <View style={styles.featureLabelRow}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
              <Text style={styles.featureName}>AI Daily Brief</Text>
            </View>
            <Text style={styles.proCol}>Included</Text>
          </View>

          {/* Feature 3 */}
          <View style={styles.matrixRow}>
            <View style={styles.featureLabelRow}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
              <Text style={styles.featureName}>AI PR summaries</Text>
            </View>
            <Text style={styles.proCol}>Included</Text>
          </View>

          {/* Feature 4 */}
          <View style={styles.matrixRow}>
            <View style={styles.featureLabelRow}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
              <Text style={styles.featureName}>AI commit message generation</Text>
            </View>
            <Text style={styles.proCol}>Included</Text>
          </View>

          {/* Feature 5 */}
          <View style={styles.matrixRow}>
            <View style={styles.featureLabelRow}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
              <Text style={styles.featureName}>Advanced Smart Alerts</Text>
            </View>
            <Text style={styles.proCol}>Included</Text>
          </View>
        </View>

        {/* RevenueCat Integration Architecture Note Box */}
        <View style={styles.rcNoteBox}>
          <View style={styles.rcHeader}>
            <Ionicons name="code-working" size={16} color={COLORS.primary} />
            <Text style={styles.rcTitle}>RevenueCat Integration Architecture</Text>
          </View>
          <Text style={styles.rcDesc}>
            Connected to <Text style={{ fontFamily: 'monospace', color: COLORS.primary }}>react-native-purchases</Text> SDK. Entitlements are validated server-side by checking RevenueCat <Text style={{ fontFamily: 'monospace' }}>customerInfo.entitlements.active['devflow_pro']</Text>.
          </Text>
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={[styles.buyButton, isPro && styles.buyButtonDisabled]}
          onPress={handlePurchase}
          disabled={isLoading || isPro}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <LinearGradient
              colors={COLORS.proGradient as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buyGradient}
            >
              <Ionicons name="sparkles" size={18} color="#FFF" />
              <Text style={styles.buyText}>
                {isPro ? 'Pro Entitlement Active' : `Subscribe to Pro (${priceString})`}
              </Text>
            </LinearGradient>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={isLoading}
        >
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    gap: 16,
  },
  heroBox: {
    borderRadius: RADIUS.lg,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.5)',
    ...SHADOWS.glowSecondary,
  },
  crownIconBox: {
    width: 54,
    height: 54,
    borderRadius: 20,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  heroPrice: {
    color: COLORS.primary,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 8,
  },
  heroSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  activeProBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.successMuted,
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  activeProText: {
    color: COLORS.success,
    fontSize: 13,
    fontWeight: '700',
  },
  demoNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  demoNoticeText: {
    color: COLORS.hackathonGold,
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
  },
  matrixContainer: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  matrixTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 8,
  },
  matrixRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  featureLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  featureName: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  compareCols: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    minWidth: 110,
    justifyContent: 'flex-end',
  },
  freeCol: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  proCol: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  rcNoteBox: {
    backgroundColor: '#090D16',
    padding: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.25)',
  },
  rcHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  rcTitle: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  rcDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  buyButton: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  buyButtonDisabled: {
    opacity: 0.6,
  },
  buyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  buyText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  restoreText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
});
