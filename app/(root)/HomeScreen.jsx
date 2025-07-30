import { Text, View, StyleSheet } from 'react-native'
import { COLORS } from '../util/COLORS';

export default function HomeScreen() {
    return (
      <View style={styles.container}>
        <Text> HomeScreen </Text>
      </View>
    )
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
});
