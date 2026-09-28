import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';

export const RevenueCatBanner: React.FC = () => {
  const { subscription } = useApp();
  const router = useRouter();

  if (subscription?.isPro) return null;

  return (
    <LinearGradient
      colors={['#2E1065', '#1E1B4B', '#0F172A']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.banner}
    >
      <View style={styles.leftContent}>
        <View style={styles.crownBox}>
          <Ionicons name="sparkles" size={18} color="#F59E0B" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Upgrade to DevFlow Pro</Text>
          <Text style={styles.subtitle}>Unlock AI Daily Briefs, Unlimited Repos & Smart Alert Sync</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.upgradeButton}
        onPress={() => router.push('/subscription')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>$4.99/mo</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    marginBottom: 16,
    ...SHADOWS.glowSecondary,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 10,
  },
  crownBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
  },
  subtitle: {
    color: '#C084FC',
    fontSize: 11,
    marginTop: 2,
  },
  upgradeButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
