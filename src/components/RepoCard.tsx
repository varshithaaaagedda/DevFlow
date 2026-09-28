import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { Badge } from './Badge';
import { Repository } from '../types';
import { COLORS, RADIUS } from '../constants/theme';

interface RepoCardProps {
  repo: Repository;
  onPress?: () => void;
}

export const RepoCard: React.FC<RepoCardProps> = ({ repo, onPress }) => {
  const getBuildBadgeVariant = () => {
    switch (repo.buildStatus) {
      case 'success':
        return 'success';
      case 'failed':
        return 'failed';
      case 'running':
        return 'running';
      default:
        return 'informational';
    }
  };

  return (
    <GlassCard onPress={onPress} highlightBorder={repo.buildStatus === 'failed'}>
      <View style={styles.topRow}>
        <View style={styles.nameContainer}>
          <View style={styles.titleRow}>
            <Ionicons
              name={repo.isPrivate ? 'lock-closed' : 'git-branch'}
              size={16}
              color={COLORS.primary}
            />
            <Text style={styles.repoName}>{repo.name}</Text>
          </View>
          <Text style={styles.ownerText}>by @{repo.owner}</Text>
        </View>

        <Badge
          label={repo.buildStatus.toUpperCase()}
          variant={getBuildBadgeVariant()}
          size="sm"
        />
      </View>

      <Text style={styles.descriptionText} numberOfLines={2}>
        {repo.description}
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="star-outline" size={14} color={COLORS.hackathonGold} />
          <Text style={styles.statText}>{repo.stars} stars</Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="git-pull-request-outline" size={14} color={COLORS.secondary} />
          <Text style={styles.statText}>{repo.openPRs} open PRs</Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="code-slash-outline" size={14} color={COLORS.accent} />
          <Text style={styles.statText}>{repo.language}</Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.statText}>{repo.lastActivity}</Text>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  nameContainer: {
    flex: 1,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  repoName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  ownerText: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  descriptionText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
});
