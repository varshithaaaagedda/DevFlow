import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Header } from '../components/Header';
import { GlassCard } from '../components/GlassCard';
import { Badge } from '../components/Badge';
import { useApp } from '../context/AppContext';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DailyBriefScreen() {
  const { dailyBrief } = useApp();
  const router = useRouter();

  if (!dailyBrief) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header title="AI Daily Brief" subtitle={dailyBrief.date} showBack={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Hero */}
        <LinearGradient
          colors={['#172239', '#0F172A', '#131B2E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroRow}>
            <View style={styles.heroIconBox}>
              <Ionicons name="sparkles" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>{dailyBrief.greeting}</Text>
              <Text style={styles.heroSub}>Here is your automated GitHub & Hackathon briefing.</Text>
            </View>
          </View>
        </LinearGradient>

        {/* AI Actionable Recommendation */}
        <GlassCard highlightBorder style={styles.recommendationCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="bulb-outline" size={18} color={COLORS.hackathonGold} />
            <Text style={styles.cardTitleGold}>AI Recommendation</Text>
          </View>
          <Text style={styles.bodyText}>{dailyBrief.aiRecommendation}</Text>
        </GlassCard>

        {/* Section 1: Commits Summary */}
        <GlassCard>
          <View style={styles.cardHeader}>
            <Ionicons name="git-commit-outline" size={18} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Commits Activity ({dailyBrief.commitsYesterday})</Text>
          </View>
          <Text style={styles.bodyText}>{dailyBrief.commitsSummary}</Text>
        </GlassCard>

        {/* Section 2: Pull Request Summary */}
        <GlassCard>
          <View style={styles.cardHeader}>
            <Ionicons name="git-pull-request-outline" size={18} color={COLORS.secondary} />
            <Text style={styles.cardTitle}>Pull Requests ({dailyBrief.prsWaitingReview} pending)</Text>
          </View>
          <Text style={styles.bodyText}>{dailyBrief.pullRequestSummary}</Text>
        </GlassCard>

        {/* Section 3: CI/CD Pipeline Summary */}
        <GlassCard highlightBorder={dailyBrief.failedBuilds > 0}>
          <View style={styles.cardHeader}>
            <Ionicons name="hardware-chip-outline" size={18} color={COLORS.danger} />
            <Text style={styles.cardTitle}>CI/CD Pipeline ({dailyBrief.failedBuilds} failed)</Text>
          </View>
          <Text style={styles.bodyText}>{dailyBrief.cicdSummary}</Text>
        </GlassCard>

        {/* Section 4: Important Issues */}
        <GlassCard>
          <View style={styles.cardHeader}>
            <Ionicons name="alert-circle-outline" size={18} color={COLORS.warning} />
            <Text style={styles.cardTitle}>Important Issues</Text>
          </View>
          <View style={styles.issuesList}>
            {dailyBrief.importantIssues.map(issue => (
              <View key={issue.id} style={styles.issueItem}>
                <View style={styles.issueLeft}>
                  <Text style={styles.issueTitle}>{issue.title}</Text>
                  <Text style={styles.issueRepo}>{issue.repo}</Text>
                </View>
                <Badge
                  label={issue.priority.toUpperCase()}
                  variant={issue.priority === 'high' ? 'critical' : 'important'}
                  size="sm"
                />
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Section 5: Hackathon Deadlines */}
        <GlassCard>
          <View style={styles.cardHeader}>
            <Ionicons name="trophy-outline" size={18} color={COLORS.hackathonGold} />
            <Text style={styles.cardTitle}>Hackathon Deadlines</Text>
          </View>
          <View style={styles.deadlinesList}>
            {dailyBrief.hackathonDeadlines.map((h, idx) => (
              <View key={idx} style={styles.deadlineItem}>
                <Text style={styles.deadlineName}>{h.name}</Text>
                <View style={styles.timerBadge}>
                  <Ionicons name="time-outline" size={12} color={COLORS.hackathonGold} />
                  <Text style={styles.timerText}>{h.timeLeftFormatted}</Text>
                </View>
              </View>
            ))}
          </View>
        </GlassCard>
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
    gap: 14,
  },
  heroCard: {
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
    ...SHADOWS.glowPrimary,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextContainer: {
    flex: 1,
  },
  heroTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
  },
  heroSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  recommendationCard: {
    borderColor: 'rgba(251, 191, 36, 0.4)',
    backgroundColor: '#1C1917',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  cardTitleGold: {
    color: COLORS.hackathonGold,
    fontSize: 15,
    fontWeight: '700',
  },
  bodyText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  issuesList: {
    gap: 10,
    marginTop: 4,
  },
  issueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  issueLeft: {
    flex: 1,
    marginRight: 8,
  },
  issueTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  issueRepo: {
    color: COLORS.primary,
    fontSize: 11,
    marginTop: 2,
  },
  deadlinesList: {
    gap: 8,
    marginTop: 4,
  },
  deadlineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  deadlineName: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.hackathonGold,
  },
  timerText: {
    color: COLORS.hackathonGold,
    fontSize: 11,
    fontWeight: '800',
  },
});
