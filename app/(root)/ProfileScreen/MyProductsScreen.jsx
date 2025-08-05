import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { COLORS } from '../../util/COLORS';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Redirect, useFocusEffect, useNavigation } from 'expo-router'
import { SignOutButton } from '../../../components/SignOutButton/SignOutButton';
import "../../../global.css"
import { collection, getDocs, getFirestore, Query, query, where } from 'firebase/firestore';
import { app } from '../../../firebaseConfig';
import { use, useCallback, useEffect, useState } from 'react';
import LatestItemList from '../../../components/HomeScreen/LatestItemList';


export default function MyProductsScreen () {
  const { user } = useUser()
  const bd = getFirestore(app)
  const [productList, setProductList] = useState([])
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false)

// useEffect(() => {
//     setProductList([])
//     getUserPosts()
//   }, [])

      useFocusEffect(
      useCallback(() => {
        setProductList([])
        getUserPosts()
      }, [])
    );
  
const getUserPosts = async () => {
  try {
    setLoading(true)
    const q = query(
      collection(bd, 'UserPost'),
      where('useremail', '==', user?.primaryEmailAddress?.emailAddress)
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
          
          {loading ? <ActivityIndicator /> : <LatestItemList latestItemList={productList} heading={"Meus Produtos"}   />}

          


      </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  }
});
