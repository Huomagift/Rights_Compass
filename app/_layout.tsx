import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ErrorState, ErrorBoundaryWrapper } from '../components/ErrorState';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { MarketplaceProvider } from '../context/MarketplaceContext';

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

  // Inject web global style to eliminate browser focus rings, white borders,
  // and the unwanted text I-beam cursor on static React Native Web text elements.
  if (typeof document !== 'undefined') {
    const styleEl = document.createElement('style');
    styleEl.id = 'rights-compass-web-focus-reset';
    styleEl.textContent = `
      /* Focus outline reset */
      *, *::before, *::after, input, textarea, select, button, [contenteditable="true"] {
        outline: none !important;
        outline-style: none !important;
        outline-width: 0 !important;
        outline-color: transparent !important;
        -webkit-tap-highlight-color: transparent !important;
        box-shadow: none !important;
      }
      input:focus, input:focus-visible, input:focus-within,
      textarea:focus, textarea:focus-visible, textarea:focus-within,
      select:focus, select:focus-visible, select:focus-within,
      button:focus, button:focus-visible,
      [contenteditable="true"]:focus, [contenteditable="true"]:focus-visible,
      *:focus, *:focus-visible {
        outline: none !important;
        outline-style: none !important;
        outline-width: 0 !important;
        outline-color: transparent !important;
        box-shadow: none !important;
      }
      /* Caret fix: RN Web renders Text as div; browsers default cursor:text on div */
      html, body, div, span, p, h1, h2, h3, h4, h5, h6, li, ul, ol {
        cursor: default !important;
        user-select: none !important;
        -webkit-user-select: none !important;
      }
      /* Restore cursor and selection for actual inputs */
      input, textarea, [contenteditable="true"] {
        cursor: text !important;
        user-select: text !important;
        -webkit-user-select: text !important;
      }
      /* Pointer for interactive elements */
      button, a, [role="button"] {
        cursor: pointer !important;
      }
    `;
    document.head.appendChild(styleEl);
  }
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
        <Stack.Screen
          name="marketplace"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="lawyer-application"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundaryWrapper>
      <ThemeProvider>
        <MarketplaceProvider>
          <AppStack />
        </MarketplaceProvider>
      </ThemeProvider>
    </ErrorBoundaryWrapper>
  );
}


