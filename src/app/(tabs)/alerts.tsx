import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { AlertItem } from '../../components/AlertItem';
import { useApp } from '../../context/AppContext';
import { COLORS, RADIUS } from '../../constants/theme';
import { SmartAlert } from '../../types';
import { NotificationEventType } from '../../services/notificationService';

export default function AlertsScreen() {
  const { alerts, isRefreshing, refreshData, markAlertAsRead, markAllAlertsAsRead, triggerTestNotification } = useApp();
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'important' | 'informational'>('all');
  const [showTestMenu, setShowTestMenu] = useState(false);

  const filteredAlerts = alerts.filter(alert => {
    if (filterSeverity === 'all') return true;
    return alert.severity === filterSeverity;
  });

  const unreadCount = alerts.filter(a => !a.read).length;

  const handleTestNotification = async (type: NotificationEventType) => {
    setShowTestMenu(false);
    await triggerTestNotification({
      type,
      repository: 'DevFlow-Mobile',
      prTitle: 'feat: integrate OneSignal push notification system',
      hackathonName: 'RevenueCat Mobile Hackathon',
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Smart Alerts" subtitle={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`} />

      {/* Action & Filter Header */}
      <View style={styles.filterSection}>
        <View style={styles.topActionsRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll}>
            <TouchableOpacity
              style={[styles.pill, filterSeverity === 'all' && styles.activePill]}
              onPress={() => setFilterSeverity('all')}
            >
              <Text style={[styles.pillText, filterSeverity === 'all' && styles.activePillText]}>All ({alerts.length})</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pill, filterSeverity === 'critical' && styles.activeCriticalPill]}
              onPress={() => setFilterSeverity('critical')}
            >
              <Text style={[styles.pillText, filterSeverity === 'critical' && styles.activeCriticalText]}>🔴 Critical</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pill, filterSeverity === 'important' && styles.activeImportantPill]}
              onPress={() => setFilterSeverity('important')}
            >
              <Text style={[styles.pillText, filterSeverity === 'important' && styles.activeImportantText]}>🟡 Important</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pill, filterSeverity === 'informational' && styles.activeInfoPill]}
              onPress={() => setFilterSeverity('informational')}
            >
              <Text style={[styles.pillText, filterSeverity === 'informational' && styles.activeInfoText]}>🔵 Info</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.secondaryHeaderRow}>
          <TouchableOpacity style={styles.testNotificationBtn} onPress={() => setShowTestMenu(!showTestMenu)}>
            <Ionicons name="paper-plane-outline" size={14} color={COLORS.primary} />
            <Text style={styles.testNotificationText}>Test Notification</Text>
          </TouchableOpacity>

          {unreadCount > 0 && (
            <TouchableOpacity style={styles.markAllButton} onPress={markAllAlertsAsRead}>
              <Ionicons name="checkmark-done-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Test Notification Event Launcher Options */}
        {showTestMenu && (
          <View style={styles.testMenuBox}>
            <Text style={styles.testMenuHeader}>Simulate Push Notification Event:</Text>
            <View style={styles.testMenuGrid}>
              <TouchableOpacity style={styles.testItem} onPress={() => handleTestNotification('build_failed')}>
                <Text style={styles.testItemText}>🚨 Build Failed</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.testItem} onPress={() => handleTestNotification('pr_merged')}>
                <Text style={styles.testItemText}>✅ PR Merged</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.testItem} onPress={() => handleTestNotification('pr_review_required')}>
                <Text style={styles.testItemText}>🟡 Review Required</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.testItem} onPress={() => handleTestNotification('hackathon_deadline')}>
                <Text style={styles.testItemText}>⏰ Hackathon Deadline</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshData}
            tintColor={COLORS.primary}
          />
        }
      >
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onPress={(a: SmartAlert) => markAlertAsRead(a.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={42} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No Alerts Found</Text>
            <Text style={styles.emptySub}>All clear! Tap "Test Notification" to simulate a push event.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillsScroll: {
    gap: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  activePill: {
    backgroundColor: COLORS.primaryMuted,
    borderColor: COLORS.primary,
  },
  activePillText: {
    color: COLORS.primary,
  },
  activeCriticalPill: {
    backgroundColor: COLORS.dangerMuted,
    borderColor: COLORS.danger,
  },
  activeCriticalText: {
    color: COLORS.danger,
  },
  activeImportantPill: {
    backgroundColor: COLORS.warningMuted,
    borderColor: COLORS.warning,
  },
  activeImportantText: {
    color: COLORS.warning,
  },
  activeInfoPill: {
    backgroundColor: COLORS.infoMuted,
    borderColor: COLORS.info,
  },
  activeInfoText: {
    color: COLORS.primary,
  },
  secondaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  testNotificationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  testNotificationText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  markAllText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  testMenuBox: {
    backgroundColor: '#090D16',
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: 6,
  },
  testMenuHeader: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 8,
  },
  testMenuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  testItem: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  testItemText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 30,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 10,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  emptySub: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
});
