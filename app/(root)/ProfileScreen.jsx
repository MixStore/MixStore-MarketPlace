import { Text, View, StyleSheet } from 'react-native'
import { COLORS } from '../util/COLORS';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link, Redirect } from 'expo-router'
import { SignOutButton } from '../../components/SignOutButton/SignOutButton';


export default function ProfileScreen () {
  const { user } = useUser()

  return (
      <View style={styles.container}>
        <Text> ProfileScreen </Text>
     
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <SignOutButton />
      </SignedIn>

      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  }
});
