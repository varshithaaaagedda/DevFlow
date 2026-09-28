import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Header } from '../../components/Header';
import { ChatMessage } from '../../components/ChatMessage';
import { useApp } from '../../context/AppContext';
import { COLORS, RADIUS } from '../../constants/theme';

export default function AIScreen() {
  const { chatMessages, sendAIChatMessage } = useApp();
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isSending) return;

    if (!textToSend) setInputText('');
    setIsSending(true);

    try {
      await sendAIChatMessage(query);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (e) {
      console.error('Error sending AI chat message:', e);
    } finally {
      setIsSending(false);
    }
  };

  const handleActionClick = (action: string) => {
    switch (action) {
      case 'view_alerts':
        router.push('/(tabs)/alerts');
        break;
      case 'view_prs':
        router.push('/(tabs)/repositories');
        break;
      case 'view_hackathons':
        router.push('/(tabs)/hackathons');
        break;
      default:
        handleSend(action);
        break;
    }
  };

  const QUICK_PROMPTS = [
    "Summarize today's GitHub activity",
    "Explain this pull request",
    "Generate a commit message",
    "What should I work on next?",
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header title="DevFlow AI Assistant" subtitle="LLM Code & Companion Intelligence" />

      {/* Suggested Quick Prompt Chips Bar */}
      <View style={styles.quickPromptsBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptsScroll}>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.promptChip}
              onPress={() => handleSend(prompt)}
              activeOpacity={0.7}
            >
              <Ionicons name="sparkles-outline" size={12} color={COLORS.primary} />
              <Text style={styles.promptText}>{prompt}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Messages Feed */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {chatMessages.map(msg => (
          <ChatMessage key={msg.id} message={msg} onSelectAction={handleActionClick} />
        ))}

        {isSending && (
          <View style={styles.typingBox}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.typingText}>DevFlow AI is analyzing repo context...</Text>
          </View>
        )}
      </ScrollView>

      {/* Chat Input Bar */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Ask AI about repos, PRs, or commits..."
            placeholderTextColor={COLORS.textMuted}
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.disabledSend]}
            onPress={() => handleSend()}
            disabled={!inputText.trim() || isSending}
          >
            <Ionicons name="arrow-up" size={18} color={inputText.trim() ? COLORS.textInverse : COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  quickPromptsBar: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  promptsScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.25)',
  },
  promptText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  typingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: RADIUS.md,
    alignSelf: 'flex-start',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typingText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surfaceCard,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.full,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    paddingVertical: 8,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledSend: {
    backgroundColor: COLORS.surface,
  },
});
