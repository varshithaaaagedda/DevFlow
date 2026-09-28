import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AIDailyBrief } from '../types';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

interface DailyBriefCardProps {
  brief: AIDailyBrief | null;
}

export const DailyBriefCard: React.FC<DailyBriefCardProps> = ({ brief }) => {
  const router = useRouter();

  if (!brief) return null;

  return (
    <LinearGradient
      colors={['#172239', '#0F172A', '#131B2E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          <Ionicons name="sparkles" size={16} color={COLORS.primary} />
          <Text style={styles.badgeText}>AI DAILY BRIEF</Text>
        </View>
        <Text style={styles.dateText}>{brief.date}</Text>
      </View>

      <Text style={styles.greetingText}>{brief.greeting}</Text>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>
          Your projects had <Text style={styles.boldCyan}>{brief.commitsYesterday} commits</Text> yesterday.{'\n'}
          <Text style={styles.boldPurple}>{brief.prsWaitingReview} PRs</Text> are waiting for review.{'\n'}
          <Text style={styles.boldRed}>{brief.failedBuilds} GitHub Actions build</Text> failed.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => router.push('/daily-brief')}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={COLORS.cyanGradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.ctaGradient}
        >
          <Text style={styles.ctaText}>View Full AI Brief</Text>
          <Ionicons name="arrow-forward" size={16} color={COLORS.textInverse} />
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.3)',
    marginBottom: 20,
    ...SHADOWS.glowPrimary,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  dateText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  greetingText: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },
  summaryBox: {
    backgroundColor: 'rgba(10, 14, 26, 0.6)',
    padding: 14,
    borderRadius: RADIUS.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    marginBottom: 16,
  },
  summaryText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  boldCyan: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  boldPurple: {
    color: COLORS.secondary,
    fontWeight: '700',
  },
  boldRed: {
    color: COLORS.danger,
    fontWeight: '700',
  },
  ctaButton: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  ctaText: {
    color: COLORS.textInverse,
    fontSize: 14,
    fontWeight: '800',
  },
});
