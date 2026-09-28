import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../constants/theme';

interface GitHubAuthModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitToken: (token: string) => Promise<boolean>;
}

export const GitHubAuthModal: React.FC<GitHubAuthModalProps> = ({ visible, onClose, onSubmitToken }) => {
  const [tokenInput, setTokenInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!tokenInput.trim()) {
      setErrorMessage('Please enter a valid GitHub token.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const success = await onSubmitToken(tokenInput.trim());
    setIsSubmitting(false);

    if (success) {
      setTokenInput('');
      onClose();
    } else {
      setErrorMessage('Failed to validate GitHub token. Verify token scopes (repo, workflow, read:user).');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="logo-github" size={22} color="#FFF" />
              <Text style={styles.title}>Connect GitHub Account</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            Enter your GitHub Personal Access Token or OAuth Bearer Token to access real repositories, pull requests, and CI/CD build statuses.
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons name="key-outline" size={18} color={COLORS.primary} />
            <TextInput
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              placeholderTextColor={COLORS.textMuted}
              style={styles.textInput}
              value={tokenInput}
              onChangeText={setTokenInput}
              secureTextEntry={true}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {errorMessage && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={14} color={COLORS.danger} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <View style={styles.infoBox}>
            <Ionicons name="shield-checkmark" size={14} color={COLORS.success} />
            <Text style={styles.infoText}>
              Tokens are encrypted locally using OS SecureStore / Keychain. DevFlow never transmits secrets to third-party servers.
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={isSubmitting}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.connectButton} onPress={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.connectText}>Connect Token</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 13, 22, 0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#090D16',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
    fontFamily: 'monospace',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.dangerMuted,
    padding: 10,
    borderRadius: RADIUS.sm,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 10,
    borderRadius: RADIUS.sm,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  infoText: {
    color: COLORS.success,
    fontSize: 11,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  connectButton: {
    flex: 1.5,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.githubDark,
    borderWidth: 1,
    borderColor: '#383D43',
  },
  connectText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
