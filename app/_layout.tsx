import React from 'react';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { session, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        {!session ? (
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        ) : (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(chat)/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
          </Stack>
        )}
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <ChatProvider>
        <RootLayoutNav />
      </ChatProvider>
    </AuthProvider>
  );
}