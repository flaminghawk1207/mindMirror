import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useAuth } from '../hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { useEffect } from 'react';

function useProtectedRoute(user: any) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(tabs)';
    
    console.log('Protected route check:', { user: !!user, inAuthGroup, segments });
    
    // Only navigate if we have segments and navigation is ready
    if (segments.length > 0) {
      if (!user && inAuthGroup) {
        // Redirect to the sign-in page if user is not signed in and trying to access protected routes
        console.log('Redirecting to home (not authenticated)');
        setTimeout(() => router.replace('/'), 100);
      } else if (user && !inAuthGroup) {
        // Redirect away from the sign-in page if user is signed in
        console.log('Redirecting to journal (authenticated)');
        setTimeout(() => router.replace('/journal'), 100);
      }
    }
  }, [user, segments]);
}

function NavigationContent() {
  const { theme } = useTheme();
  const { user, loading } = useAuth();

  useProtectedRoute(user);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="index">
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <NavigationContent />
    </ThemeProvider>
  );
}
