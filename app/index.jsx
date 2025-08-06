import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';

import { View, Text } from 'react-native';

export default function Page() {
  
  

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View>
        <Text></Text>
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(root)/HomeScreen" />;
  }

  return <Redirect href="/(auth)/sign-in" />;
}
