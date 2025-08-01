import { StyleSheet, ScrollView } from 'react-native'
import { COLORS } from '../../util/COLORS';
import Header from '../../../components/HomeScreen/HeaderComponent';
import { app } from '../../../firebaseConfig';
import Slider from '../../../components/HomeScreen/Slider';
import Categories from '../../../components/HomeScreen/Categories';
import LatestItemList from '../../../components/HomeScreen/LatestItemList';
import { collection, getDocs, getFirestore, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import "../../../global.css"



export default function HomeScreen() {
 const [sliderList, setSliderList] = useState([])
  const db = getFirestore(app);
  const [categoryList, setCategoryList] = useState([]);
  const [latestItemList, setLatestItemList] = useState([]);

  
  useEffect(() => {
    getSliders();
    getCategoryList()
    getLatestItemList()
  }, [])

  const getCategoryList=async ()=>{
    setCategoryList([])
    const querySnapshot = await getDocs(collection(db, "Category"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots

      console.log(doc.id, " => ", doc.data());
      setCategoryList(categoryList => [...categoryList, doc.data()])
      

    });
  }

  const getSliders =async() => {
    setSliderList([])
    const querySnapshot = await getDocs(collection(db, "Sliders"))
    querySnapshot.forEach((doc) => {
        console.log("Slider", "=>", doc.data())
        setSliderList(sliderList=> [...sliderList, doc.data()])      
    });
  }

  const getLatestItemList=async()=>{
    const querySnapshot=await getDocs(collection(db, 'UserPost'), orderBy('createdAt', 'desc' ))
    querySnapshot.forEach((doc)=>{
      console.log("Docs", doc.data())
      setLatestItemList(latestItemList => [...latestItemList, doc.data()])
      
    })
  }

    return (
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container} className='py-8 px-6 flex-1' >
        <Header/>
        <Slider sliderList={sliderList} />
        <Categories categoryList={categoryList} />
        <LatestItemList latestItemList={latestItemList} heading={"Últimos itens"} />
      </ScrollView>
    )
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
});
