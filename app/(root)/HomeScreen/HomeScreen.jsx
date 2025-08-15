import { StyleSheet, ScrollView, View, ActivityIndicator } from 'react-native'
import { COLORS } from '../../util/COLORS';
import Header from '../../../components/HomeScreen/HeaderComponent';
import { app } from '../../../firebaseConfig';
import Slider from '../../../components/HomeScreen/Slider';
import Categories from '../../../components/HomeScreen/Categories';
import LatestItemList from '../../../components/HomeScreen/LatestItemList';
import { useEffect, useState } from "react";
import "../../../global.css"
import { useNavigation } from 'expo-router';
import TopBarNavigationComponent from '../../../components/TopBarNavigatiomComponent';
import { getAuth } from 'firebase/auth';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  orderBy,
  doc,
  where
} from 'firebase/firestore';




export default function HomeScreen() {
 const [sliderList, setSliderList] = useState([])
  const db = getFirestore(app);
  const navigation = useNavigation();
  const [categoryList, setCategoryList] = useState([]);
  const [latestItemList, setLatestItemList] = useState([]);
  const [loading, setLoading] = useState(false)


  
  useEffect(() => {
    getSliders();
    getCategoryList()
    getLatestItemList()
  }, [])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getLatestItemList();
    });
  
    return unsubscribe; // Limpa o listener ao desmontar
  }, [navigation]);

  const getCategoryList=async ()=>{
      setLoading(true)
    setCategoryList([])

 try{
    const querySnapshot = await getDocs(collection(db, "Category"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots

      console.log(doc.id, " => ", doc.data());
      setCategoryList(categoryList => [...categoryList, doc.data()])
      });
  }catch (e){

  } finally{
    setLoading(false)
  }


  }

  const getSliders =async() => {
      setLoading(true)
    setSliderList([])

 try{
 const querySnapshot = await getDocs(collection(db, "Sliders"))
    querySnapshot.forEach((doc) => {
        console.log("Slider", "=>", doc.data())
        setSliderList(sliderList=> [...sliderList, doc.data()])      
    });
  }catch (e){

  } finally{
    setLoading(false)
  }
  }
  
  const getLatestItemList = async () => {
    setLoading(true);
    setLatestItemList([]);

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const db = getFirestore(app);

      const historicoRef = collection(db, 'historico', currentUser.uid, 'produtos');
      const historicoQuery = query(historicoRef, orderBy('visualizadoEm', 'desc'));
      const historicoSnapshot = await getDocs(historicoQuery);

      const produtoIds = historicoSnapshot.docs.map(doc => doc.id);

      const userPostRef = collection(db, 'UserPost');
      const userPostSnapshot = await getDocs(userPostRef);

      const produtosFiltrados = userPostSnapshot.docs
        .filter(doc => produtoIds.includes(doc.id))
        .map(doc => ({ id: doc.id, ...doc.data() }));

      const produtosOrdenados = produtoIds
        .map(id => produtosFiltrados.find(p => p.id === id))
        .filter(Boolean); 

      setLatestItemList(produtosOrdenados);
    } catch (e) {
      console.error('Erro ao buscar histórico de produtos:', e);
    } finally {
      setLoading(false);
    }
  };


  

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container} className='py-8 px-6 flex-1' >

      { 
        loading?
          <View style={styles.loadingContainer} >  <ActivityIndicator className='mt-24' size={'large'} color={COLORS.primary} /> </View> 
        :
        <>
          <Header/>
        {/* <TopBarNavigationComponent /> */}
          <Slider sliderList={sliderList} />
          <Categories categoryList={categoryList} />
          <LatestItemList latestItemList={latestItemList} heading={"Histórico de visualizações"} />
        </>
      }
        </ScrollView>

    )
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
    loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background
  },
});
