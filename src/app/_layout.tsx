import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';

import { colors, fonts } from '@/constants/theme';

export default function RootLayout() {
  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.background);
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          animation: 'fade_from_bottom',
          contentStyle: {
            backgroundColor: colors.background,
          },
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: colors.cream,
          headerTitleStyle: {
            fontFamily: fonts.display,
            fontSize: 22,
            fontWeight: '700',
          },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="setup" options={{ headerShown: false }} />
        <Stack.Screen name="scoreboard" options={{ headerShown: false }} />
        <Stack.Screen name="history" options={{ title: 'Historico' }} />
        <Stack.Screen name="settings" options={{ title: 'Mesa' }} />
      </Stack>
    </>
  );
}
