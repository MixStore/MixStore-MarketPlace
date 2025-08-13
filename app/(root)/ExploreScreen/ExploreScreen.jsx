import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native'
import { COLORS } from '../../util/COLORS';
import "../../../global.css"
import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
import { app } from '../../../firebaseConfig';
import { useCallback, useEffect, useState } from 'react';
import LatestItemList from '../../../components/HomeScreen/LatestItemList';
import { useFocusEffect } from 'expo-router';
import SearchComponent from '../../../components/SearchComponent';



export default function ExploreScreen () {
  const db=getFirestore(app)  
  const [productList, setProductlist] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('');
  const filteredProducts = productList.filter((product) =>
    product.title?.toLowerCase().includes(searchText.toLowerCase()) 
    // || product.desc?.toLowerCase().includes(searchText.toLowerCase())
  );
  


  // useEffect(()=>{
  //   setProductlist([])
  //   getAllProducts()
  // },[])

  useFocusEffect(
  useCallback(() => {
    getAllProducts();
  }, [])
);

const getAllProducts = async () => {
  try {
    setLoading(true);

    const q = query(collection(db, 'UserPost'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const products = snapshot.docs.map((doc) => doc.data());
    setProductlist(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  } finally {
    setLoading(false);
  }
};


    return (
      <ScrollView showsHorizontalScrollIndicator={false} className="p-5 py-8" style={styles.container}>
        <Text className='text-[24px] font-bold'> Explorar mais  </Text>
        <SearchComponent
        
          value={searchText}
          onChangeText={(text) => setSearchText(text)}

        />
        {loading ? <ActivityIndicator className='mt-24' size={'large'} color={COLORS.primary} /> : <LatestItemList latestItemList={filteredProducts} />
      }
      </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
});

