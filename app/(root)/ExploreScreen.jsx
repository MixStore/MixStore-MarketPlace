import { Text, View, StyleSheet } from 'react-native'
import { COLORS } from '../util/COLORS';


export default function ExploreScreen () {
    return (
      <View style={styles.container}>
        <Text> ExploreScreen </Text>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
});

