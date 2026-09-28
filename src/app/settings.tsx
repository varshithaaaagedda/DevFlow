import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Header } from '../components/Header';
import { GlassCard } from '../components/GlassCard';
import { Badge } from '../components/Badge';
import { GitHubAuthModal } from '../components/GitHubAuthModal';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useSubscription } from '../hooks/useSubscription';
import { COLORS, RADIUS } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { user, logout, loginWithGitHubToken } = useAuth();
  const { subscription, refreshData, gitHubError, isGitHubConnected } = useApp();
  const { isConfigured, offering } = useSubscription();
  const router = useRouter();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [demoMode, setDemoMode] = useState(user?.isDemoUser ?? true);
  const [aiModel, setAiModel] = useState<'gemini-1.5-pro' | 'gpt-4o' | 'claude-3-5-sonnet'>('gemini-1.5-pro');

  const [modalType, setModalType] = useState<'privacy' | 'license' | null>(null);

  const handleTokenSubmit = async (token: string): Promise<boolean> => {
    const success = await loginWithGitHubToken(token);
    if (success) {
      await refreshData();
      return true;
    }
    return false;
  };

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to end your session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header title="Settings & Config" subtitle="Account & App Preferences" showBack={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <Text style={styles.sectionHeader}>GitHub & Account</Text>
        <GlassCard>
          <View style={styles.accountRow}>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>{user?.displayName || 'Developer'}</Text>
              <Text style={styles.accountHandle}>@{user?.username || 'alexdevflow'}</Text>
            </View>
            {isGitHubConnected ? (
              <TouchableOpacity style={styles.connectGhBtn} onPress={() => setShowAuthModal(true)}>
                <Badge label="CONNECTED" variant="success" size="sm" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.connectGhBtn} onPress={() => setShowAuthModal(true)}>
                <Ionicons name="logo-github" size={14} color="#FFF" />
                <Text style={styles.connectGhText}>Connect Token</Text>
              </TouchableOpacity>
            )}
          </View>

          {gitHubError && (
            <View style={styles.errorNotice}>
              <Ionicons name="warning-outline" size={14} color={COLORS.warning} />
              <Text style={styles.errorNoticeText}>{gitHubError}</Text>
            </View>
          )}
        </GlassCard>

        {/* Subscription Section */}
        <Text style={styles.sectionHeader}>Subscription Plan</Text>
        <GlassCard onPress={() => router.push('/subscription')}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="sparkles" size={20} color={COLORS.secondary} />
              <View>
                <Text style={styles.settingTitle}>
                  {subscription?.isPro ? 'DevFlow Pro (Active)' : 'Free Tier'}
                </Text>
                <Text style={styles.settingSub}>
                  {subscription?.isPro ? 'Unlimited repos & AI briefs active' : 'Upgrade to $4.99/mo for full features'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </View>
        </GlassCard>

        {/* RevenueCat Debug Information (Development Mode Only) */}
        {__DEV__ && (
          <>
            <Text style={styles.sectionHeader}>RevenueCat Debug Info (DEV ONLY)</Text>
            <GlassCard highlightBorder={!isConfigured}>
              <View style={styles.debugRow}>
                <Text style={styles.debugLabel}>RevenueCat SDK:</Text>
                <Badge
                  label={isConfigured ? 'CONFIGURED' : 'NOT CONFIGURED'}
                  variant={isConfigured ? 'success' : 'critical'}
                  size="sm"
                />
              </View>

              <View style={styles.debugRow}>
                <Text style={styles.debugLabel}>Customer ID:</Text>
                <Text style={styles.debugValueText} numberOfLines={1} ellipsizeMode="middle">
                  {subscription?.revenueCatAppUserId || 'N/A'}
                </Text>
              </View>

              <View style={styles.debugRow}>
                <Text style={styles.debugLabel}>Pro Entitlement ("devflow_pro"):</Text>
                <Badge
                  label={subscription?.isPro ? 'ACTIVE' : 'INACTIVE'}
                  variant={subscription?.isPro ? 'success' : 'informational'}
                  size="sm"
                />
              </View>

              <View style={styles.debugRow}>
                <Text style={styles.debugLabel}>Current Offering ("default"):</Text>
                <Badge
                  label={offering ? 'AVAILABLE' : 'UNAVAILABLE'}
                  variant={offering ? 'success' : 'important'}
                  size="sm"
                />
              </View>
            </GlassCard>
          </>
        )}

        {/* Push Notifications Section */}
        <Text style={styles.sectionHeader}>Notifications & Alerts</Text>
        <GlassCard>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
              <Text style={styles.settingTitle}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: COLORS.surface, true: COLORS.primaryMuted }}
              thumbColor={notificationsEnabled ? COLORS.primary : COLORS.textMuted}
            />
          </View>

          <View style={[styles.settingRow, styles.subSettingRow]}>
            <View style={styles.settingLeft}>
              <Ionicons name="alert-circle-outline" size={18} color={COLORS.danger} />
              <Text style={styles.settingTitle}>Critical Alerts Only</Text>
            </View>
            <Switch
              value={criticalOnly}
              onValueChange={setCriticalOnly}
              disabled={!notificationsEnabled}
              trackColor={{ false: COLORS.surface, true: COLORS.dangerMuted }}
              thumbColor={criticalOnly ? COLORS.danger : COLORS.textMuted}
            />
          </View>
        </GlassCard>

        {/* AI Model Preferences */}
        <Text style={styles.sectionHeader}>AI Intelligence Settings</Text>
        <GlassCard>
          <Text style={styles.settingTitle}>Primary LLM Engine</Text>
          <View style={styles.modelOptions}>
            <TouchableOpacity
              style={[styles.modelChip, aiModel === 'gemini-1.5-pro' && styles.activeModelChip]}
              onPress={() => setAiModel('gemini-1.5-pro')}
            >
              <Text style={[styles.modelChipText, aiModel === 'gemini-1.5-pro' && styles.activeModelText]}>
                Gemini 1.5 Pro
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modelChip, aiModel === 'gpt-4o' && styles.activeModelChip]}
              onPress={() => setAiModel('gpt-4o')}
            >
              <Text style={[styles.modelChipText, aiModel === 'gpt-4o' && styles.activeModelText]}>
                GPT-4o
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modelChip, aiModel === 'claude-3-5-sonnet' && styles.activeModelChip]}
              onPress={() => setAiModel('claude-3-5-sonnet')}
            >
              <Text style={[styles.modelChipText, aiModel === 'claude-3-5-sonnet' && styles.activeModelText]}>
                Claude 3.5
              </Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Demo Mode Toggle */}
        <Text style={styles.sectionHeader}>Demo & Environment</Text>
        <GlassCard>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="flask-outline" size={20} color={COLORS.hackathonGold} />
              <View>
                <Text style={styles.settingTitle}>Hackathon Demo Mode</Text>
                <Text style={styles.settingSub}>Explore complete UI with mock repository data</Text>
              </View>
            </View>
            <Switch
              value={demoMode}
              onValueChange={setDemoMode}
              trackColor={{ false: COLORS.surface, true: 'rgba(251, 191, 36, 0.3)' }}
              thumbColor={demoMode ? COLORS.hackathonGold : COLORS.textMuted}
            />
          </View>
        </GlassCard>

        {/* About & Legal */}
        <Text style={styles.sectionHeader}>About & Legal</Text>
        <GlassCard>
          <TouchableOpacity style={styles.legalItem} onPress={() => setModalType('privacy')}>
            <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.legalText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.legalItem} onPress={() => setModalType('license')}>
            <Ionicons name="code-slash-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.legalText}>Open Source License (MIT)</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>

          <View style={styles.appInfoRow}>
            <Text style={styles.appVersion}>DevFlow Mobile v1.0.0 (GitHub Phase 1)</Text>
          </View>
        </GlassCard>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={COLORS.danger} />
          <Text style={styles.logoutText}>Log Out Session</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* GitHub Auth Token Modal */}
      <GitHubAuthModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSubmitToken={handleTokenSubmit}
      />

      {/* Privacy Policy / Open Source Modal */}
      <Modal visible={!!modalType} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalType === 'privacy' ? 'Privacy Policy' : 'MIT License'}
              </Text>
              <TouchableOpacity onPress={() => setModalType(null)}>
                <Ionicons name="close" size={22} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalBody}>
                {modalType === 'privacy'
                  ? `DevFlow respects your developer privacy.\n\n1. Authentication Tokens are encrypted on-device using OS SecureStorage / Keychain.\n\n2. Monitored repository data is processed strictly for rendering real-time build alerts and generating AI summaries.\n\n3. No repository source code or private key credentials are stored on external telemetry servers.`
                  : `MIT License\n\nCopyright (c) 2026 DevFlow Team\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files to deal in the Software without restriction...`}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 40,
  },
  sectionHeader: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 16,
    marginBottom: 8,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountInfo: {
    justifyContent: 'center',
  },
  accountName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  accountHandle: {
    color: COLORS.primary,
    fontSize: 12,
    marginTop: 2,
  },
  connectGhBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.githubDark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: '#383D43',
  },
  connectGhText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  errorNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 8,
    borderRadius: RADIUS.sm,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  errorNoticeText: {
    color: COLORS.warning,
    fontSize: 11,
    flex: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  subSettingRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    marginTop: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  settingTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  settingSub: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  modelOptions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  modelChip: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeModelChip: {
    backgroundColor: COLORS.primaryMuted,
    borderColor: COLORS.primary,
  },
  modelChipText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  activeModelText: {
    color: COLORS.primary,
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  legalText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    marginLeft: 10,
  },
  appInfoRow: {
    alignItems: 'center',
    paddingTop: 12,
  },
  appVersion: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.dangerMuted,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.danger,
    marginTop: 24,
  },
  logoutText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 13, 22, 0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
  },
  modalScroll: {
    marginTop: 4,
  },
  modalBody: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  debugRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  debugLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  debugValueText: {
    color: COLORS.primary,
    fontSize: 11,
    fontFamily: 'monospace',
    maxWidth: '50%',
  },
});
