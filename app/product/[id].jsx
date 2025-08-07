import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { DocumentData, collection, getDocs, getFirestore } from "firebase/firestore";
import ProductDetailComponent from "../../components/ProductDetailComponent";
import { app } from "../../firebaseConfig";

export default function ProductPage() {
  const { id } = useLocalSearchParams();
    const db = getFirestore(app);
    const navigation = useNavigation();
    const [product, setProduct] = useState<DocumentData | null>(null);


  

  useEffect(() => {
    getLatestItemList()
  }, [])


  const getLatestItemList=async()=>{
  setLoading(true)
  setLatestItemList([])
  try{
    const querySnapshot=await getDocs(collection(db, 'UserPost'))
    querySnapshot.forEach((doc)=>{
      const productId = doc.createdAt?.seconds?.toString(); 
      if(productId === id){
        setProduct(doc.data());
      }
    })
  }catch (e){

  } finally{
    setLoading(false)
  }

  }

  return (
    product ? <ProductDetailComponent product={product} navigation={navigation} /> :      <ActivityIndicator className='mt-24' size={'large'} color={COLORS.primary} />
    
  );
}
