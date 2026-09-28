import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { Badge } from './Badge';
import { PullRequest } from '../types';
import { COLORS, RADIUS } from '../constants/theme';

interface PRCardProps {
  pr: PullRequest;
  onAIExplain: (pr: PullRequest) => void;
}

export const PRCard: React.FC<PRCardProps> = ({ pr, onAIExplain }) => {
  const getReviewBadge = () => {
    switch (pr.reviewStatus) {
      case 'approved':
        return <Badge label="APPROVED" variant="success" size="sm" />;
      case 'changes_requested':
        return <Badge label="CHANGES REQ" variant="critical" size="sm" />;
      case 'review_required':
        return <Badge label="REVIEW REQ" variant="important" size="sm" />;
      default:
        return <Badge label="PENDING" variant="informational" size="sm" />;
    }
  };

  return (
    <GlassCard>
      <View style={styles.headerRow}>
        <View style={styles.repoTag}>
          <Ionicons name="folder-outline" size={12} color={COLORS.primary} />
          <Text style={styles.repoTagText}>{pr.repository}</Text>
        </View>
        {getReviewBadge()}
      </View>

      <Text style={styles.titleText}>{pr.title}</Text>

      <View style={styles.metaRow}>
        <View style={styles.authorBox}>
          <Image source={{ uri: pr.author.avatar }} style={styles.avatar} />
          <Text style={styles.authorName}>{pr.author.name}</Text>
        </View>

        <View style={styles.diffBox}>
          <Text style={styles.filesText}>{pr.changedFiles} files</Text>
          <Text style={styles.additionsText}>+{pr.additions}</Text>
          <Text style={styles.deletionsText}>-{pr.deletions}</Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <View style={styles.branchBox}>
          <Ionicons name="git-branch-outline" size={12} color={COLORS.textMuted} />
          <Text style={styles.branchText}>{pr.branch}</Text>
        </View>

        <TouchableOpacity
          style={styles.aiButton}
          onPress={() => onAIExplain(pr)}
          activeOpacity={0.8}
        >
          <Ionicons name="sparkles" size={14} color={COLORS.primary} />
          <Text style={styles.aiButtonText}>AI Explain</Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  repoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.2)',
  },
  repoTagText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  titleText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(10, 14, 26, 0.4)',
    padding: 8,
    borderRadius: RADIUS.sm,
  },
  authorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.full,
  },
  authorName: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  diffBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filesText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  additionsText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: '700',
  },
  deletionsText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  branchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  branchText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontFamily: 'monospace',
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 240, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  aiButtonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
  },
});
