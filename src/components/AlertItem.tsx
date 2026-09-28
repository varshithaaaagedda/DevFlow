import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { Badge } from './Badge';
import { SmartAlert } from '../types';
import { COLORS, RADIUS } from '../constants/theme';

interface AlertItemProps {
  alert: SmartAlert;
  onPress: (alert: SmartAlert) => void;
}

export const AlertItem: React.FC<AlertItemProps> = ({ alert, onPress }) => {
  const getIcon = () => {
    switch (alert.type) {
      case 'build_failed':
      case 'deployment_failed':
        return { name: 'warning-outline' as const, color: COLORS.danger };
      case 'pr_review_required':
        return { name: 'git-pull-request-outline' as const, color: COLORS.warning };
      case 'hackathon_deadline':
        return { name: 'timer-outline' as const, color: COLORS.hackathonGold };
      case 'pr_merged':
        return { name: 'git-merge-outline' as const, color: COLORS.success };
      default:
        return { name: 'notifications-outline' as const, color: COLORS.primary };
    }
  };

  const iconInfo = getIcon();

  return (
    <GlassCard onPress={() => onPress(alert)} style={!alert.read && styles.unreadCard}>
      <View style={styles.topRow}>
        <View style={styles.leftInfo}>
          <View style={[styles.iconBox, { backgroundColor: `${iconInfo.color}15`, borderColor: `${iconInfo.color}40` }]}>
            <Ionicons name={iconInfo.name} size={18} color={iconInfo.color} />
          </View>

          <View style={styles.headerTitles}>
            <View style={styles.titleWithDot}>
              {!alert.read && <View style={styles.unreadDot} />}
              <Text style={styles.titleText}>{alert.title}</Text>
            </View>
            <View style={styles.repoRow}>
              <Text style={styles.repoText}>{alert.repository}</Text>
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.timestampText}>{alert.timestamp}</Text>
            </View>
          </View>
        </View>

        <Badge
          label={alert.severity.toUpperCase()}
          variant={alert.severity}
          size="sm"
        />
      </View>

      <Text style={styles.descriptionText}>{alert.description}</Text>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  unreadCard: {
    borderColor: COLORS.primaryMuted,
    backgroundColor: '#172239',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  headerTitles: {
    flex: 1,
  },
  titleWithDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  titleText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  repoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  repoText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  dotSeparator: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  timestampText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  descriptionText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
    paddingLeft: 44,
  },
});
