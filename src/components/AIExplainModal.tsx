import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PullRequest } from '../types';
import { COLORS, RADIUS } from '../constants/theme';

interface AIExplainModalProps {
  visible: boolean;
  pr: PullRequest | null;
  explanationText: string | null;
  isLoading: boolean;
  onClose: () => void;
}

export const AIExplainModal: React.FC<AIExplainModalProps> = ({
  visible,
  pr,
  explanationText,
  isLoading,
  onClose,
}) => {
  if (!pr) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="sparkles" size={20} color={COLORS.primary} />
              <Text style={styles.headerTitle}>DevFlow AI PR Insight</Text>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.prSubTitle}>PR #{pr.id}: {pr.title}</Text>

          <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
            {isLoading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Analyzing pull request code diff...</Text>
              </View>
            ) : (
              <View style={styles.explanationBox}>
                <Text style={styles.explanationText}>{explanationText}</Text>
                
                {pr.diffSnippet && (
                  <View style={styles.diffContainer}>
                    <Text style={styles.diffLabel}>Target Code Snippet:</Text>
                    <View style={styles.diffBox}>
                      <Text style={styles.diffText}>{pr.diffSnippet}</Text>
                    </View>
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          <TouchableOpacity style={styles.doneButton} onPress={onClose}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 13, 22, 0.85)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxHeight: '80%',
    padding: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
  },
  closeButton: {
    padding: 4,
  },
  prSubTitle: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 16,
  },
  contentScroll: {
    marginBottom: 16,
  },
  loadingBox: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  explanationBox: {
    gap: 14,
  },
  explanationText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 22,
  },
  diffContainer: {
    marginTop: 8,
  },
  diffLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  diffBox: {
    backgroundColor: '#090D16',
    padding: 12,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  diffText: {
    color: '#38BDF8',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  doneButton: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  doneButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
});
