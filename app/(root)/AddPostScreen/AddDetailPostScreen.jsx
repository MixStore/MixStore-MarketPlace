import { ScrollView, StyleSheet } from 'react-native'
import ".././../../global.css"
import { useNavigation } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { COLORS } from '../../util/COLORS';
import AddDetailPostCOmponent from '../../../components/AddDetailPostComponent';

export default function AddDetailPostScreen () {
  const {params}=useRoute()
  const navigation =  useNavigation();


    return (
      <ScrollView showsHorizontalScrollIndicator={false} style={styles.container} >

          <AddDetailPostCOmponent params={params} navigation={navigation} /> 
    
      </ScrollView>
    )

}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: COLORS.background,
    
  }
})

