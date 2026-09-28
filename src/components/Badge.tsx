import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export type BadgeVariant = 'critical' | 'important' | 'informational' | 'success' | 'failed' | 'running' | 'pro' | 'demo';

interface BadgeProps {
  label: string;
  variant: BadgeVariant;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant, size = 'sm' }) => {
  const getColors = () => {
    switch (variant) {
      case 'critical':
      case 'failed':
        return { bg: COLORS.dangerMuted, border: COLORS.danger, text: COLORS.danger };
      case 'important':
        return { bg: COLORS.warningMuted, border: COLORS.warning, text: COLORS.warning };
      case 'informational':
      case 'running':
        return { bg: COLORS.infoMuted, border: COLORS.info, text: COLORS.primary };
      case 'success':
        return { bg: COLORS.successMuted, border: COLORS.success, text: COLORS.success };
      case 'pro':
        return { bg: 'rgba(139, 92, 246, 0.2)', border: COLORS.secondary, text: '#C084FC' };
      case 'demo':
        return { bg: 'rgba(56, 189, 248, 0.2)', border: COLORS.accent, text: COLORS.accent };
      default:
        return { bg: 'rgba(148, 163, 184, 0.2)', border: COLORS.textMuted, text: COLORS.textSecondary };
    }
  };

  const colors = getColors();

  return (
    <View
      style={[
        styles.container,
        size === 'md' ? styles.sizeMd : styles.sizeSm,
        { backgroundColor: colors.bg, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.text, size === 'md' ? styles.textMd : styles.textSm, { color: colors.text }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  sizeSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  sizeMd: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  text: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textSm: {
    fontSize: 10,
  },
  textMd: {
    fontSize: 12,
  },
});
