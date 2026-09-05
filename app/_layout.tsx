import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ErrorState, ErrorBoundaryWrapper } from '../components/ErrorState';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

if (typeof window !== 'undefined') {
  const isExtensionError = (value: any): boolean => {
    const str = typeof value === 'string' ? value : '';
    const msg =
      value?.message ||
      value?.reason?.message ||
      value?.error?.message ||
      str;
    const stack =
      value?.stack ||
      value?.reason?.stack ||
      value?.error?.stack ||
      '';
    const filename = value?.filename || '';

    return (
      msg.includes('MetaMask') ||
      msg.includes('ethereum') ||
      msg.includes('chrome-extension') ||
      stack.includes('chrome-extension') ||
      filename.includes('chrome-extension') ||
      msg.includes('inpage') ||
      stack.includes('inpage')
    );
  };

  // Intercept unhandled promise rejections (MetaMask async errors)
  window.addEventListener('unhandledrejection', (event) => {
    if (isExtensionError(event.reason) || isExtensionError(event)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  // Intercept synchronous errors (MetaMask Object.connect)
  window.addEventListener('error', (event) => {
    if (
      isExtensionError(event.error) ||
      isExtensionError(event) ||
      isExtensionError({ filename: event.filename, message: event.message })
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return true;
    }
  }, true);

  // Patch window.onerror so Expo's dev overlay never sees it
  const _origOnError = window.onerror;
  window.onerror = function (msg, src, line, col, err) {
    if (
      isExtensionError({ message: msg, filename: src, stack: err?.stack || '' }) ||
      isExtensionError(err)
    ) {
      return true; // suppressed
    }
    return _origOnError ? _origOnError.call(window, msg, src, line, col, err) : false;
  };

  // Patch console.error to suppress MetaMask noise
  const _origConsoleError = console.error.bind(console);
  console.error = (...args: any[]) => {
    const combined = args.join(' ');
    if (
      combined.includes('MetaMask') ||
      combined.includes('chrome-extension') ||
      combined.includes('ethereum') ||
      combined.includes('inpage')
    ) {
      return;
    }
    _origConsoleError(...args);
  };
}


export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <ErrorState
      fullScreen
      title="Application Error"
      message="Rights Compass encountered an unexpected error. Please try reloading."
      errorDetails={error}
      onRetry={retry}
    />
  );
}

function AppStack() {
  const { colors, isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
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
        <Stack.Screen name="ui-states" />
        <Stack.Screen name="error" />
        <Stack.Screen name="not-found" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundaryWrapper>
      <ThemeProvider>
        <AppStack />
      </ThemeProvider>
    </ErrorBoundaryWrapper>
  );
}


