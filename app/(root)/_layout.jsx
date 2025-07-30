import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Text, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../util/COLORS";

// import * as admin from 'firebase-admin';
// import { verifyToken } from '@clerk/backend';

// const clerkToken = req.headers.authorization?.split('Bearer ')[1];
// const clerkUser = await verifyToken(clerkToken);

// const firebaseToken = await admin.auth().createCustomToken(clerkUser.sub);

// import { getAuth, signInWithCustomToken } from 'firebase/auth';

// const auth = getAuth(app);
// await signInWithCustomToken(auth, firebaseToken);




export default function Layout() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) return <Redirect href="/sign-in" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: "home",
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                styles.textNavBar,
                { color: focused ? COLORS.expense : COLORS.primary },
              ]}
            >
              Home
            </Text>
          ),
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              size={size}
              name="home"
              color={focused ? COLORS.expense : COLORS.primary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ExploreScreen"
        options={{
          title: "explore",
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                styles.textNavBar,
                { color: focused ? COLORS.expense : COLORS.primary },
              ]}
            >
              Explorar
            </Text>
          ),
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              size={size}
              name="search"
              color={focused ? COLORS.expense : COLORS.primary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="AddPostScreen"
        options={{
          title: "addpost",
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                styles.textNavBar,
                { color: focused ? COLORS.expense : COLORS.primary },
              ]}
            >
              Novo Post
            </Text>
          ),
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              size={size}
              name="add"
              color={focused ? COLORS.expense : COLORS.primary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ProfileScreen"
        options={{
          title: "profile",
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                styles.textNavBar,
                { color: focused ? COLORS.expense : COLORS.primary },
              ]}
            >
              Perfil
            </Text>
          ),
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              size={size}
              name="person"
              color={focused ? COLORS.expense : COLORS.primary}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  textNavBar: {
    fontSize: 12,
    marginBottom: 3,
  },
});
