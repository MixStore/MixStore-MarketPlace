import { Slot } from 'expo-router';
import { AuthProvider } from '../providers/authProvider';
import SafeScreen from '../components/SafeScreen/SafeScreen';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </AuthProvider>
  );
}
