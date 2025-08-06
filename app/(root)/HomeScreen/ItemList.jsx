import { Text, View, StyleSheet, ActivityIndicator } from 'react-native'
import { COLORS } from '../../../app/util/COLORS';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../../../firebaseConfig';
import { useRoute } from '@react-navigation/native';
import LatestItemList from '../../../components/HomeScreen/LatestItemList';
import "../../../global.css"

export default function ItemList () {
    const {params}=useRoute()
    const db=getFirestore(app)
    const [itemList, setItemList] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        console.log(params.category)
        params&&getItemListByCategory()
    }, [params])

    const getItemListByCategory=async()=>{
        setItemList([])
        setLoading(true)
        const q=query(collection(db,"UserPost"),where('category', '==', params.category))
        const snapshot = await getDocs(q);
        setLoading(false)

        snapshot.docs.forEach(doc => {
          console.log(doc.data());
          setItemList(itemList=>[...itemList, doc.data()])
        setLoading(false)
        });
        
        
    }
  return (
      <View className='p-2' style={styles.container}>
      {loading ? <ActivityIndicator className='mt-24' size={'large'} color={COLORS.primary} /> : itemList.length>0 ? <LatestItemList latestItemList={itemList} heading={"Últimos Posts"} /> : <Text className='p-5 mt-24 text[20px] text-gray-400 justify-center text-center' > Sem Postagens nesta categoria </Text>} 
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  }
});
