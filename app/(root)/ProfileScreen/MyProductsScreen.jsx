import { StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { COLORS } from '../../util/COLORS';
import { useFocusEffect, useNavigation } from 'expo-router'
import "../../../global.css"
import { collection, getDocs, getFirestore, Query, query, where } from 'firebase/firestore';
import { app } from '../../../firebaseConfig';
import { useCallback, useEffect, useState } from 'react';
import LatestItemList from '../../../components/HomeScreen/LatestItemList';
import { getAuth } from 'firebase/auth';


export default function MyProductsScreen () {
  const user  = getAuth().currentUser
  const bd = getFirestore(app)
  const [productList, setProductList] = useState([])
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false)




useEffect(()=>{
  user&&getUserPosts()
},[user])


      useFocusEffect(
      useCallback(() => {
        setProductList([])
        getUserPosts()
      }, [])
    );
  
const getUserPosts = async () => {
  setProductList([])
  try {
    setLoading(true)
    const q = query(
      collection(bd, 'UserPost'),
      where('useremail', '==', user?.email)
    )
    const snapshot = await getDocs(q)

    const products = snapshot.docs.map(doc => doc.data())
    setProductList(products)
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
  } finally {
    setLoading(false)
  }
}

 

  return (
      <ScrollView style={styles.container} className='p-5 flex-1' showsVerticalScrollIndicator={false} >     
          
          {loading ? <ActivityIndicator className='mt-24' size={'large'} color={COLORS.primary} /> : <LatestItemList latestItemList={productList} heading={"Meus Produtos"}   />}

          


      </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  }
});
