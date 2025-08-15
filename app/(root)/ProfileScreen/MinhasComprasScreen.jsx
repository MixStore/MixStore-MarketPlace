import { Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { COLORS } from '../../util/COLORS';
import "../../../global.css";
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../../../firebaseConfig';
import { useCallback, useEffect, useState } from 'react';
import LatestItemList from '../../../components/HomeScreen/LatestItemList';
import { useFocusEffect } from 'expo-router';

export default function MinhasComprasScreen() {
  const db = getFirestore(app);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);



  useFocusEffect(
    useCallback(() => {
      if (currentUser) {
        getPurchaseHistory(currentUser.uid);
      }
    }, [currentUser])
  );

  const getPurchaseHistory = async (userId) => {
    try {
      setLoading(true);
      const historicoRef = collection(db, 'historicoCompras', userId, 'produtos');
      const q = query(historicoRef, orderBy('compradoEm'));
      const snapshot = await getDocs(q);

      const products = snapshot.docs.map((doc) => doc.data());
      setProductList(products);
console.log("Buscando histórico em:", `historicoCompras/${userId}/produtos`);

    } catch (error) {
      console.error("Erro ao buscar histórico de compras:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView showsHorizontalScrollIndicator={false} className="p-5 py-8" style={styles.container}>
      <Text className='text-[24px] font-bold'>Seu histórico de compras</Text>
      {loading ? (
        <ActivityIndicator className='mt-24' size={'large'} color={COLORS.primary} />
      ) : (

        <LatestItemList latestItemList={productList} isComprado={true}  />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
});
