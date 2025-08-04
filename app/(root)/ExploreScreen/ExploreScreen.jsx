import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native'
import { COLORS } from '../../util/COLORS';
import "../../../global.css"
import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
import { app } from '../../../firebaseConfig';
import { useEffect, useState } from 'react';
import LatestItemList from '../../../components/HomeScreen/LatestItemList';



export default function ExploreScreen () {
  const db=getFirestore(app)  
  const [productList, setProductlist] = useState([])
  const [loading, setLoading] = useState(false)


  useEffect(()=>{
    getAllProducts()
  },[])

  const getAllProducts=async ()=>{
        setLoading(true)
        
        const q=query(collection(db, 'UserPost'), orderBy('createdAt', 'desc'))
        const snapshot=await getDocs(q)
        setLoading(false)
       
        snapshot.forEach((doc) => {
          setProductlist(productList=>[...productList, doc.data()])
          setLoading(false)
        });
    }

    return (
      <ScrollView showsHorizontalScrollIndicator={false} className="p-5 py-8" style={styles.container}>
        <Text className='text-[24px] font-bold'> Explorar mais  </Text>
        {loading ? <ActivityIndicator className='mt-24' size={'large'} color="black"/> : <LatestItemList latestItemList={productList} />}
      </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
});

