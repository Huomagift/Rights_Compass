import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { BorderRadius, Spacing } from '../constants/theme';

const MASCOT_SIZE = 60;
const BUBBLE_TIMEOUT_MS = 10000; // 10 seconds

export function FloatingAIBot() {
  const router = useRouter();
  const { colors } = useTheme();

  // Initial speech bubble shows on load, then times out after 10s
  const [initialBubbleVisible, setInitialBubbleVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Animated opacity for smooth bubble fade
  const bubbleOpacity = useRef(new Animated.Value(1)).current;

  // 10-second timeout on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialBubbleVisible(false);
    }, BUBBLE_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, []);

  // Compute overall visibility: initial 10s period OR currently hovered
  const shouldShowBubble = initialBubbleVisible || isHovered;

  useEffect(() => {
    Animated.timing(bubbleOpacity, {
      toValue: shouldShowBubble ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [shouldShowBubble, bubbleOpacity]);

  const handlePress = () => {
    router.push('/tutor-chat' as any);
  };

  // Web hover events
  const webHoverHandlers =
    Platform.OS === 'web'
      ? {
          onMouseEnter: () => setIsHovered(true),
          onMouseLeave: () => setIsHovered(false),
        }
      : {};

  return (
    <View
      style={styles.container}
      {...(webHoverHandlers as any)}
    >
      {/* Speech Bubble with fade animation */}
      <Animated.View
        style={[
          styles.speechBubble,
          {
            opacity: bubbleOpacity,
            backgroundColor: colors.cardWhite,
            borderColor: colors.border,
            shadowColor: colors.shadowColor,
          },
        ]}
        pointerEvents={shouldShowBubble ? 'auto' : 'none'}
      >
        <Text style={[styles.speechText, { color: colors.text }]}>
          {"Hi, I'm Aegis! Have a legal question? I'm here to help! 👋"}
        </Text>
        {/* Bubble Tail pointing to mascot */}
        <View
          style={[
            styles.bubbleTail,
            { borderTopColor: colors.cardWhite },
          ]}
        />
      </Animated.View>

      {/* Mascot Circle Button */}
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={handlePress}
        style={[
          styles.mascotBtn,
          {
            backgroundColor: colors.primary,
          },
        ]}
      >
        <Image
          source={require('../assets/images/mascot.png')}
          style={styles.mascotImg}
          contentFit="cover"
        />

        {/* Sparkle Badge */}
        <View
          style={[
            styles.sparkleBadge,
            {
              backgroundColor: colors.accent,
              borderColor: colors.cardWhite,
            },
          ]}
        >
          <Sparkles size={11} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: (Platform.OS === 'web' ? 'fixed' : 'absolute') as any,
    right: 20,
    bottom: 95,
    zIndex: 9999,
    alignItems: 'flex-end',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  speechBubble: {
    maxWidth: 220,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    marginBottom: 8,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 6,
    position: 'relative',
    alignSelf: 'flex-end',
  },
  speechText: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -8,
    right: 22,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  mascotBtn: {
    width: MASCOT_SIZE,
    height: MASCOT_SIZE,
    borderRadius: MASCOT_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(110, 60, 20, 0.28)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  mascotImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  sparkleBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
});
