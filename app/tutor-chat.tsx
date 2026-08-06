import React, { useState } from 'react';
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
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { processTutorQuery, TutorResponse } from '../services/tutorAgent';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  citation?: string;
  isUrgent?: boolean;
  emergencyTip?: string;
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
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: "Hello! I'm your Rights Compass AI Tutor. Ask me any question about your legal rights in Nigeria. If you are in an active situation, tell me what is happening right now!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Process with Tutor Agent
    setTimeout(() => {
      const response: TutorResponse = processTutorQuery(query);
      const botMsg: ChatMessage = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        text: response.answer,
        citation: response.citation,
        isUrgent: response.isUrgent,
        emergencyTip: response.emergencyTip,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* MODAL HEADER */}
        <View style={styles.header}>
          <View style={styles.headerMascotRow}>
            <Image
              source={require('../assets/images/mascot.png')}
              style={styles.mascotAvatar}
              contentFit="cover"
            />
            <View style={{ marginLeft: Spacing.sm }}>
              <Text style={styles.headerTitle}>AI Rights Tutor</Text>
              <View style={styles.statusRow}>
                <View style={styles.greenDot} />
                <Text style={styles.statusText}>Grounded in Nigerian Law</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={22} color={Colors.text} />
          </TouchableOpacity>
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
                    isUser ? styles.userBubble : styles.botBubble,
                    msg.isUrgent && styles.urgentBubble,
                  ]}
                >
                  {msg.isUrgent && (
                    <View style={styles.urgentHeader}>
                      <Ionicons name="warning" size={16} color="#DC2626" />
                      <Text style={styles.urgentHeaderText}>
                        CRISIS / IN-PROGRESS ALERT
                      </Text>
                    </View>
                  )}

                  <Text
                    style={[
                      styles.bubbleText,
                      isUser && styles.userBubbleText,
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
                    <View style={styles.citationBox}>
                      <Ionicons name="book" size={12} color={Colors.primary} />
                      <Text style={styles.citationText}>{msg.citation}</Text>
                    </View>
                  )}

                  <Text style={styles.timestampText}>{msg.timestamp}</Text>
                </View>
              </View>
            );
          })}

          {/* SUGGESTED PROMPTS */}
          {messages.length < 3 && (
            <View style={styles.suggestedSection}>
              <Text style={styles.suggestedTitle}>Common Questions:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.promptChip}
                    onPress={() => handleSend(prompt)}
                  >
                    <Text style={styles.promptChipText}>{prompt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>

        {/* INPUT BAR */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.voiceNoteBtn}>
            <Ionicons name="mic-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>

          <TextInput
            style={styles.chatInput}
            placeholder="Ask anything about your rights..."
            placeholderTextColor={Colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
          />

          <TouchableOpacity
            style={styles.sendBtn}
            onPress={() => handleSend()}
            activeOpacity={0.8}
          >
            <Ionicons name="send" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerMascotRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mascotAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
    marginRight: 4,
  },
  statusText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.cardWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatScroll: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  botRow: {
    justifyContent: 'flex-start',
  },
  msgMascot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: Spacing.xs,
    alignSelf: 'flex-end',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: Colors.cardBackground,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
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
    color: Colors.text,
  },
  userBubbleText: {
    color: Colors.white,
  },
  urgentBubbleText: {
    color: '#991B1B',
    fontWeight: '600',
  },
  emergencyTipBox: {
    marginTop: Spacing.xs,
    backgroundColor: Colors.cardWhite,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.warning,
  },
  emergencyTipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  citationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  citationText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    marginLeft: 4,
  },
  timestampText: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  suggestedSection: {
    marginTop: Spacing.md,
  },
  suggestedTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  promptChip: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    marginRight: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  promptChipText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    backgroundColor: Colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  voiceNoteBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.xs,
  },
  chatInput: {
    flex: 1,
    backgroundColor: Colors.cardWhite,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 14,
    color: Colors.text,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
  },
});
