import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AIMessage } from '../types';
import { COLORS, RADIUS } from '../constants/theme';

interface ChatMessageProps {
  message: AIMessage;
  onSelectAction?: (action: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSelectAction }) => {
  const isAssistant = message.sender === 'assistant';

  return (
    <View style={[styles.container, isAssistant ? styles.assistantAlign : styles.userAlign]}>
      {isAssistant && (
        <View style={styles.avatarBox}>
          <Ionicons name="sparkles" size={16} color={COLORS.primary} />
        </View>
      )}

      <View style={[styles.bubble, isAssistant ? styles.assistantBubble : styles.userBubble]}>
        <Text style={[styles.messageText, isAssistant ? styles.assistantText : styles.userText]}>
          {message.content}
        </Text>

        {message.codeSnippet && (
          <View style={styles.codeBlock}>
            <View style={styles.codeHeader}>
              <Text style={styles.codeLang}>{message.codeSnippet.language.toUpperCase()}</Text>
              <Ionicons name="copy-outline" size={14} color={COLORS.textMuted} />
            </View>
            <Text style={styles.codeText}>{message.codeSnippet.code}</Text>
          </View>
        )}

        {message.suggestedActions && message.suggestedActions.length > 0 && (
          <View style={styles.actionsRow}>
            {message.suggestedActions.map((action, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.actionChip}
                onPress={() => onSelectAction && onSelectAction(action.action)}
                activeOpacity={0.7}
              >
                <Ionicons name="flash-outline" size={12} color={COLORS.primary} />
                <Text style={styles.actionChipText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.timestampText}>{message.timestamp}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  assistantAlign: {
    alignSelf: 'flex-start',
    maxWidth: '90%',
  },
  userAlign: {
    alignSelf: 'flex-end',
    maxWidth: '82%',
  },
  avatarBox: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bubble: {
    borderRadius: RADIUS.lg,
    padding: 14,
  },
  assistantBubble: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopLeftRadius: RADIUS.sm,
  },
  userBubble: {
    backgroundColor: COLORS.secondary,
    borderTopRightRadius: RADIUS.sm,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 22,
  },
  assistantText: {
    color: COLORS.text,
  },
  userText: {
    color: '#FFF',
  },
  codeBlock: {
    backgroundColor: '#090D16',
    borderRadius: RADIUS.sm,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  codeLang: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  codeText: {
    color: '#38BDF8',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
  },
  actionChipText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  timestampText: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 6,
    alignSelf: 'flex-end',
  },
});
