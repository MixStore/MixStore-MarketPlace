import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { COLORS } from '../../util/COLORS';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Redirect, useNavigation } from 'expo-router'
import { SignOutButton } from '../../../components/SignOutButton/SignOutButton';
import "../../../global.css"
import { collection, getDocs, getFirestore, Query, query, where } from 'firebase/firestore';
import { app } from '../../../firebaseConfig';
import { use, useEffect, useState } from 'react';
import LatestItemList from '../../../components/HomeScreen/LatestItemList';


export default function MyProductsScreen () {
  const { user } = useUser()
  const bd = getFirestore(app)
  const [productList, setProductList] = useState([])
  const navigation = useNavigation();

useEffect(() => {
    getUserPosts()
  }, [])
  
  const getUserPosts = async () => {
    const q = query(collection(bd, 'UserPost'), where('userEmail', '==', user?.primaryEmailAddress?.emailAddress))
    const snapshot = await getDocs(q)
    snapshot.forEach((doc) => {
      console.log(doc.data())
      setProductList(productList => [...productList, doc.data()])
    });   
  }
 

  return (
      <ScrollView style={styles.container} className='p-5 flex-1' showsVerticalScrollIndicator={false} >     
          <LatestItemList latestItemList={productList} heading={"Meus Produtos"}   />


      </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  }
});
