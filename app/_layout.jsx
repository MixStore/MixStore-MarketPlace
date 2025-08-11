import { Slot } from 'expo-router';
import { AuthProvider } from '../providers/authProvider';
import SafeScreen from '../components/SafeScreen/SafeScreen';
import { GoogleOAuthProvider } from '@react-oauth/google';


export default function RootLayout() {
  return (
    <GoogleOAuthProvider clientId="557231134276-0hqhotgpndav0cqv5jiltnd9g1pgs6qj.apps.googleusercontent.com">
    <AuthProvider>
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </AuthProvider>
    </GoogleOAuthProvider>
  );
}
