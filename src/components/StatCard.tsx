import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { COLORS, RADIUS } from '../constants/theme';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  badgeText?: string;
  badgeVariant?: 'success' | 'failed' | 'warning' | 'info';
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  iconName,
  iconColor = COLORS.primary,
  badgeText,
  badgeVariant = 'info',
  onPress,
}) => {
  return (
    <GlassCard onPress={onPress} style={styles.container}>
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: `${iconColor}15`, borderColor: `${iconColor}40` }]}>
          <Ionicons name={iconName} size={20} color={iconColor} />
        </View>
        {badgeText && (
          <View style={[styles.badge, { backgroundColor: badgeVariant === 'failed' ? COLORS.dangerMuted : COLORS.successMuted }]}>
            <Text style={[styles.badgeText, { color: badgeVariant === 'failed' ? COLORS.danger : COLORS.success }]}>
              {badgeText}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.valueText}>{value}</Text>
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.subtitleText}>{subtitle}</Text>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: '46%',
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  valueText: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  titleText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  subtitleText: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
});
