import { Slot } from 'expo-router';
import SafeScreen from '../components/SafeScreen/SafeScreen';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
  <ClerkProvider publishableKey={'pk_test_bWFnbmV0aWMtYm9iY2F0LTc0LmNsZXJrLmFjY291bnRzLmRldiQ'} tokenCache={tokenCache}>
    <SafeScreen>
      <Slot />
    </SafeScreen>
      <StatusBar style="dark" />
  </ClerkProvider>
  )
}
