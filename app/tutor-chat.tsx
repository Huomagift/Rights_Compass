import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { X, AlertTriangle, BookOpen, Mic, Send, WifiOff, Sun, Moon } from 'lucide-react-native';
import { Spacing, BorderRadius } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { routeTutorQuery, checkIsOnline, RoutedTutorResponse } from '../services/tutorRouter';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  citation?: string;
  sources?: string[];
  isUrgent?: boolean;
  emergencyTip?: string;
  mode?: 'online' | 'offline';
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  'they are searching my car right now',
  'Can police search my phone without a warrant?',
  'My landlord gave 2 days to pack out',
  'Do I have the right to remain silent?',
];

export default function TutorChatScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const [inputText, setInputText] = useState('');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: "Hello! I'm Aegis, your Rights Compass AI Legal Tutor. Ask me any question about your legal rights in Nigeria. If you are in an active situation, tell me what is happening right now!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  useEffect(() => {
    // Initial Network Connectivity Check
    checkIsOnline().then((online) => setIsOnline(online));
  }, []);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      // Route query through tutorRouter (NetInfo connectivity check -> Online Server RAG vs Offline Local RAG)
      const response: RoutedTutorResponse = await routeTutorQuery(query);

      // Re-verify network status for UI badge accuracy
      setIsOnline(response.mode === 'online');

      const botMsg: ChatMessage = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        text: response.answer,
        citation: response.citation,
        sources: response.sources,
        isUrgent: response.isUrgent,
        emergencyTip: response.emergencyTip,
        mode: response.mode,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (e: any) {
      console.error('Error handling tutor query:', e);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'bot',
        text: 'Sorry, I encountered an error connecting to the legal database. Please check your network connection and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* MODAL HEADER */}
        <View
          style={[
            styles.header,
            { backgroundColor: colors.cardBackground, borderBottomColor: colors.border },
          ]}
        >
          <View style={styles.headerMascotRow}>
            <Image
              source={require('../assets/images/mascot.png')}
              style={styles.mascotAvatar}
              contentFit="cover"
            />
            <View style={{ marginLeft: Spacing.sm }}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                Aegis • AI Legal Tutor
              </Text>
              <View style={styles.statusRow}>
                {isOnline ? (
                  <>
                    <View style={[styles.greenDot, { backgroundColor: colors.success }]} />
                    <Text style={[styles.statusText, { color: colors.textMuted }]}>
                      🟢 Online AI Pipeline
                    </Text>
                  </>
                ) : (
                  <>
                    <WifiOff size={12} color="#D97706" style={{ marginRight: 4 }} />
                    <Text style={[styles.statusText, { color: '#D97706' }]}>
                      ⚡ Offline Mode (1999 Constitution)
                    </Text>
                  </>
                )}
              </View>
            </View>
          </View>

          {/* Action buttons: Theme Toggle + Close */}
          <View style={styles.headerRightActions}>
            <TouchableOpacity
              style={[
                styles.themeToggleBtn,
                { backgroundColor: colors.cardWhite, borderColor: colors.border },
              ]}
              onPress={toggleTheme}
              activeOpacity={0.8}
              accessibilityLabel="Toggle Theme"
            >
              {isDark ? (
                <Sun size={17} color={colors.text} />
              ) : (
                <Moon size={17} color={colors.text} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => router.back()}
              accessibilityLabel="Close Chat"
            >
              <X size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* CHAT MESSAGES */}
        <ScrollView
          contentContainerStyle={styles.chatScroll}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  isUser ? styles.userRow : styles.botRow,
                ]}
              >
                {!isUser && (
                  <Image
                    source={require('../assets/images/mascot.png')}
                    style={styles.msgMascot}
                    contentFit="cover"
                  />
                )}

                <View
                  style={[
                    styles.bubble,
                    isUser
                      ? [styles.userBubble, { backgroundColor: colors.primary }]
                      : [
                          styles.botBubble,
                          { backgroundColor: colors.cardWhite, borderColor: colors.border },
                        ],
                    msg.isUrgent && styles.urgentBubble,
                  ]}
                >
                  {msg.isUrgent && (
                    <View style={styles.urgentHeader}>
                      <AlertTriangle size={16} color="#DC2626" />
                      <Text style={styles.urgentHeaderText}>
                        CRISIS / IN-PROGRESS ALERT
                      </Text>
                    </View>
                  )}

                  <Text
                    style={[
                      styles.bubbleText,
                      { color: isUser ? '#FFFFFF' : colors.text },
                      msg.isUrgent && styles.urgentBubbleText,
                    ]}
                  >
                    {msg.text}
                  </Text>

                  {msg.emergencyTip && (
                    <View style={styles.emergencyTipBox}>
                      <Text style={styles.emergencyTipText}>
                        💡 {msg.emergencyTip}
                      </Text>
                    </View>
                  )}

                  {msg.citation && (
                    <View style={[styles.citationBox, { borderTopColor: colors.border }]}>
                      <BookOpen size={12} color={colors.primary} />
                      <Text style={[styles.citationText, { color: colors.primary }]}>
                        {msg.citation}
                      </Text>
                    </View>
                  )}

                  {!isUser && msg.mode && (
                    <View style={styles.modeBadgeRow}>
                      <Text style={[styles.modeBadgeText, { color: colors.textMuted }]}>
                        {msg.mode === 'online'
                          ? '✨ Verified via Supabase Server Retrieval'
                          : '⚡ Instant Offline Fallback (Cached 1999 Constitution)'}
                      </Text>
                    </View>
                  )}

                  <Text style={[styles.timestampText, { color: isUser ? 'rgba(255,255,255,0.7)' : colors.textMuted }]}>
                    {msg.timestamp}
                  </Text>
                </View>
              </View>
            );
          })}

          {isTyping && (
            <View style={[styles.messageRow, styles.botRow]}>
              <Image
                source={require('../assets/images/mascot.png')}
                style={styles.msgMascot}
                contentFit="cover"
              />
              <View
                style={[
                  styles.bubble,
                  styles.botBubble,
                  {
                    backgroundColor: colors.cardWhite,
                    borderColor: colors.border,
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                ]}
              >
                <ActivityIndicator size="small" color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={[styles.bubbleText, { color: colors.text }]}>Analyzing legal sources...</Text>
              </View>
            </View>
          )}

          {/* SUGGESTED PROMPTS */}
          {messages.length < 3 && (
            <View style={styles.suggestedSection}>
              <Text style={[styles.suggestedTitle, { color: colors.textMuted }]}>
                Common Questions:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.promptChip,
                      { backgroundColor: colors.cardWhite, borderColor: colors.border },
                    ]}
                    onPress={() => handleSend(prompt)}
                  >
                    <Text style={[styles.promptChipText, { color: colors.text }]}>{prompt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>

        {/* INPUT BAR */}
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: colors.cardBackground, borderTopColor: colors.border },
          ]}
        >
          <TouchableOpacity style={styles.voiceNoteBtn}>
            <Mic size={22} color={colors.primary} />
          </TouchableOpacity>

          <TextInput
            style={[
              styles.chatInput,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            placeholder="Ask anything about your rights..."
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
          />

          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: colors.primary }]}
            onPress={() => handleSend()}
            activeOpacity={0.8}
            disabled={isTyping}
          >
            <Send size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
  },
  headerMascotRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
  },
  themeToggleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  mascotAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  chatScroll: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    alignItems: 'flex-end',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  botRow: {
    justifyContent: 'flex-start',
  },
  msgMascot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: Spacing.xs,
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  userBubble: {
    borderBottomRightRadius: 2,
  },
  botBubble: {
    borderBottomLeftRadius: 2,
    borderWidth: 1,
  },
  urgentBubble: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1.5,
  },
  urgentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  urgentHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  urgentBubbleText: {
    color: '#991B1B',
  },
  emergencyTipBox: {
    marginTop: Spacing.xs + 2,
    backgroundColor: '#FFFBEB',
    padding: Spacing.xs + 2,
    borderRadius: BorderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#D97706',
  },
  emergencyTipText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
    lineHeight: 16,
  },
  citationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs + 2,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
  },
  citationText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  modeBadgeRow: {
    marginTop: 4,
  },
  modeBadgeText: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  timestampText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  suggestedSection: {
    marginTop: Spacing.md,
  },
  suggestedTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  promptChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    marginRight: Spacing.xs,
  },
  promptChipText: {
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderTopWidth: 1,
  },
  voiceNoteBtn: {
    padding: Spacing.xs,
    marginRight: Spacing.xs,
  },
  chatInput: {
    flex: 1,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    fontSize: 14,
    borderWidth: 1,
    maxHeight: 100,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.xs,
  },
});
