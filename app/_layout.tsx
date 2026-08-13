import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../constants/theme';

const ioniconsFont = require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf');

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Ionicons: ioniconsFont,
  });

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleId = 'expo-vector-icons-ionicons';
      if (!document.getElementById(styleId)) {
        const fontUrl = typeof ioniconsFont === 'string' ? ioniconsFont : ioniconsFont.default || ioniconsFont;
        const style = document.createElement('style');
        style.id = styleId;
        style.type = 'text/css';
        style.appendChild(
          document.createTextNode(`
            @font-face {
              font-family: 'Ionicons';
              src: url('${fontUrl}') format('truetype');
              font-display: swap;
            }
          `)
        );
        document.head.appendChild(style);
      }
    }
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="tutor-chat"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="quiz/[id]"
          options={{
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="guide/[id]"
          options={{
            presentation: 'card',
          }}
        />
      </Stack>
    </>
  );
}

