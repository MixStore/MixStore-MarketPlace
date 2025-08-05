import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Text, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../util/COLORS";
import Toast from 'react-native-toast-message';

import FlashMessage, { showMessage } from 'react-native-flash-message';


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
      <FlashMessage position="bottom" />

      <Toast />
    </Tabs>
    
  );
}

const styles = StyleSheet.create({
  textNavBar: {
    fontSize: 12,
    marginBottom: 3,
  },
});
