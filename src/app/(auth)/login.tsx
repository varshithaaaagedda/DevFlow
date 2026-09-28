import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { GitHubAuthModal } from '../../components/GitHubAuthModal';
import { COLORS, RADIUS, SHADOWS } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { loginAsDemoUser, loginWithGitHubToken, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  const handleDemoLogin = async () => {
    await loginAsDemoUser();
    router.replace('/(tabs)');
  };

  const handleTokenSubmit = async (token: string): Promise<boolean> => {
    const success = await loginWithGitHubToken(token);
    if (success) {
      router.replace('/(tabs)');
      return true;
    }
    return false;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Brand Hero */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['rgba(0, 240, 255, 0.2)', 'rgba(139, 92, 246, 0.1)']}
            style={styles.logoBadge}
          >
            <Ionicons name="git-branch" size={36} color={COLORS.primary} />
          </LinearGradient>

          <Text style={styles.brandTitle}>
            Dev<Text style={{ color: COLORS.primary }}>Flow</Text>
          </Text>
          <Text style={styles.tagline}>AI GitHub & Hackathon Mobile Companion</Text>
        </View>

        {/* Feature Cards Showcase */}
        <View style={styles.featuresGrid}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="sparkles" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>AI Daily Briefing</Text>
              <Text style={styles.featureDesc}>Summarize commits, open PRs & CI build statuses every morning.</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="notifications" size={18} color={COLORS.secondary} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Smart Alert Feed</Text>
              <Text style={styles.featureDesc}>Instant alerts for build failures, review requests & deadlines.</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="timer" size={18} color={COLORS.hackathonGold} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Hackathon Tracker</Text>
              <Text style={styles.featureDesc}>Live countdown timers, submission progress & milestone checklists.</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.githubButton}
            onPress={() => setShowAuthModal(true)}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-github" size={20} color="#FFF" />
            <Text style={styles.githubButtonText}>Continue with GitHub</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.demoButton}
            onPress={handleDemoLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : (
              <LinearGradient
                colors={['rgba(0, 240, 255, 0.15)', 'rgba(56, 189, 248, 0.08)']}
                style={styles.demoGradient}
              >
                <Ionicons name="rocket-outline" size={18} color={COLORS.primary} />
                <Text style={styles.demoButtonText}>Continue as Demo User</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>

          <View style={styles.footerNotice}>
            <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.textMuted} />
            <Text style={styles.footerNoticeText}>
              Demo Mode requires zero API setup • GitHub OAuth & Token ready
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* GitHub Authentication Token Modal */}
      <GitHubAuthModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSubmitToken={handleTokenSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...SHADOWS.glowPrimary,
  },
  brandTitle: {
    color: COLORS.text,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
  },
  tagline: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
  },
  featuresGrid: {
    gap: 16,
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(10, 14, 26, 0.8)',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  featureDesc: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  actionsContainer: {
    gap: 14,
  },
  githubButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.githubDark,
    paddingVertical: 16,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#383D43',
  },
  githubButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  demoButton: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  demoGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  demoButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  footerNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  footerNoticeText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
});
