import { ScrollView, StyleSheet } from 'react-native'
import "../../../global.css"
import { useNavigation } from 'expo-router';
import AddNewPostComponent from '../../../components/AddNewPostComponent';
import { useRoute } from '@react-navigation/native';
import { COLORS } from '../../util/COLORS';

export default function AddPostScreen () {
  const {params}=useRoute()
  const navigation =  useNavigation();


    return (
      <ScrollView showsHorizontalScrollIndicator={false} style={styles.container} >

        <AddNewPostComponent params={params} navigation={navigation} /> 
    
      </ScrollView>
    )

}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: COLORS.background,
    
  }
})

