import React from 'react';
import { Stack } from 'expo-router';
import { ErrorState } from '../components/ErrorState';

export default function ErrorScreen({
  error,
  retry,
}: {
  error?: Error;
  retry?: () => void;
}) {
  return (
    <>
      <Stack.Screen options={{ title: 'Error', headerShown: false }} />
      <ErrorState
        fullScreen
        title="Application Error"
        message="Rights Compass encountered an unexpected error. Please try reloading."
        errorDetails={error}
        onRetry={retry}
      />
    </>
  );
}

export function ErrorBoundary({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) {
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
