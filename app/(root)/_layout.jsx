import { Redirect, Tabs } from "expo-router";
import { Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../util/COLORS";
import Toast from 'react-native-toast-message';
import FlashMessage from 'react-native-flash-message';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useLayoutEffect, useState } from "react";
import { app } from "../../firebaseConfig";



export default function Layout() {
  const [user, setUser] = useState(null);  
  const [loading, setLoading] = useState(true);
  const [showAddPost, setShowAddPost] = useState(false)

  console.log("ola" + user?.email)

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false)
    });

    return () => unsubscribe();
  }, []);
  useLayoutEffect(()=>{
    console.log("teste de email: " + user?.email )
    if(user?.email ===  "rebello.jonathan@gmail.com" || user?.email === "frotaana2005@gmail.com" || user?.email === "ofc.mixstore@gmail.com"){
      setShowAddPost(true)
    }
  }, [user])
  

if (loading) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
     <ActivityIndicator className='mt-24' size={'large'} color={COLORS.primary} />
      <Text style={{ marginTop: 10 }}>Verificando autenticação...</Text>
    </View>
  );
}
  
  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

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
              name="compass-sharp"
              color={focused ? COLORS.expense : COLORS.primary}
            />
          ),
        }}
      />

      
      <Tabs.Screen
        name="AddPostScreen"
        options={{
          href: showAddPost? undefined : null,
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
