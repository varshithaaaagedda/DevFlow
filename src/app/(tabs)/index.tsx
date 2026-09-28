import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Header } from '../../components/Header';
import { DailyBriefCard } from '../../components/DailyBriefCard';
import { StatCard } from '../../components/StatCard';
import { AlertItem } from '../../components/AlertItem';
import { PRCard } from '../../components/PRCard';
import { AIExplainModal } from '../../components/AIExplainModal';
import { RevenueCatBanner } from '../../components/RevenueCatBanner';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../constants/theme';
import { PullRequest, SmartAlert } from '../../types';

export default function DashboardScreen() {
  const {
    repositories,
    pullRequests,
    alerts,
    hackathons,
    dailyBrief,
    isRefreshing,
    refreshData,
    markAlertAsRead,
    explainPRWithAI,
  } = useApp();

  const router = useRouter();

  const [selectedPR, setSelectedPR] = React.useState<PullRequest | null>(null);
  const [explanation, setExplanation] = React.useState<string | null>(null);
  const [isExplaining, setIsExplaining] = React.useState(false);

  const handleAIExplain = async (pr: PullRequest) => {
    setSelectedPR(pr);
    setIsExplaining(true);
    const text = await explainPRWithAI(pr);
    setExplanation(text);
    setIsExplaining(false);
  };

  const activeAlertsCount = alerts.filter(a => !a.read).length;
  const failedBuildsCount = repositories.filter(r => r.buildStatus === 'failed').length;
  const mainHackathon = hackathons[0];

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshData}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Pro Upgrade Banner */}
        <RevenueCatBanner />

        {/* AI Daily Brief Highlight */}
        <DailyBriefCard brief={dailyBrief} />

        {/* Key Metrics Grid */}
        <Text style={styles.sectionTitle}>Overview & Stats</Text>
        <View style={styles.grid}>
          <StatCard
            title="Repositories"
            value={repositories.length}
            subtitle={`${failedBuildsCount} build failing`}
            iconName="git-branch"
            iconColor={COLORS.primary}
            badgeText={failedBuildsCount > 0 ? 'ALERT' : 'OK'}
            badgeVariant={failedBuildsCount > 0 ? 'failed' : 'success'}
            onPress={() => router.push('/(tabs)/repositories')}
          />

          <StatCard
            title="Open PRs"
            value={pullRequests.length}
            subtitle="2 require review"
            iconName="git-pull-request"
            iconColor={COLORS.secondary}
            badgeText="REVIEW"
            badgeVariant="warning"
            onPress={() => router.push('/(tabs)/repositories')}
          />

          <StatCard
            title="Build Status"
            value={failedBuildsCount > 0 ? 'Failing' : 'Passing'}
            subtitle="Android CI build failed"
            iconName="hardware-chip"
            iconColor={failedBuildsCount > 0 ? COLORS.danger : COLORS.success}
            badgeText={failedBuildsCount > 0 ? 'FAILED' : 'PASS'}
            badgeVariant={failedBuildsCount > 0 ? 'failed' : 'success'}
            onPress={() => router.push('/(tabs)/alerts')}
          />

          <StatCard
            title="Smart Alerts"
            value={activeAlertsCount}
            subtitle={`${alerts.length} total notifications`}
            iconName="notifications"
            iconColor={COLORS.accent}
            badgeText={activeAlertsCount > 0 ? `${activeAlertsCount} NEW` : 'READ'}
            badgeVariant={activeAlertsCount > 0 ? 'warning' : 'info'}
            onPress={() => router.push('/(tabs)/alerts')}
          />
        </View>

        {/* Main Hackathon Quick Banner */}
        {mainHackathon && (
          <TouchableOpacity
            style={styles.hackathonBanner}
            onPress={() => router.push('/(tabs)/hackathons')}
            activeOpacity={0.8}
          >
            <View style={styles.hackathonLeft}>
              <View style={styles.trophyIconBox}>
                <Ionicons name="trophy" size={20} color={COLORS.hackathonGold} />
              </View>
              <View>
                <Text style={styles.hackathonName}>{mainHackathon.name}</Text>
                <Text style={styles.hackathonProgress}>{mainHackathon.progressPercentage}% completed • 4d 12h left</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}

        {/* Recent Alerts Feed Preview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Smart Alerts</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/alerts')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {alerts.slice(0, 2).map(alert => (
          <AlertItem
            key={alert.id}
            alert={alert}
            onPress={(a: SmartAlert) => {
              markAlertAsRead(a.id);
            }}
          />
        ))}

        {/* Active Pull Requests Preview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Pull Requests</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/repositories')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {pullRequests.slice(0, 2).map(pr => (
          <PRCard key={pr.id} pr={pr} onAIExplain={handleAIExplain} />
        ))}
      </ScrollView>

      {/* AI Explain Modal */}
      <AIExplainModal
        visible={!!selectedPR}
        pr={selectedPR}
        explanationText={explanation}
        isLoading={isExplaining}
        onClose={() => {
          setSelectedPR(null);
          setExplanation(null);
        }}
      />
    </View>
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
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  viewAllText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  hackathonBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#172239',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
    marginBottom: 20,
  },
  hackathonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trophyIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hackathonName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
  },
  hackathonProgress: {
    color: COLORS.hackathonGold,
    fontSize: 12,
    marginTop: 2,
  },
});
