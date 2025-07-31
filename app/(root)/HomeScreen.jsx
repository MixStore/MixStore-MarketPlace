import { Text, View, StyleSheet } from 'react-native'
import { COLORS } from '../util/COLORS';
import Header from '../../components/HomeScreen/HeaderComponent';
import "../../global.css"
import { app } from '../../firebaseConfig';
import Slider from '../../components/HomeScreen/Slider';
import Categories from '../../components/HomeScreen/Categories';
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";



export default function HomeScreen() {
 const [sliderList, setSliderList] = useState([])
  const db = getFirestore(app);
  const [categoryList, setCategoryList] = useState([]);

  
  useEffect(() => {
    getSliders();
    getCategoryList()
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

  useEffect(() => {
    sliderList.forEach((item, index) => {
      console.log(`Imagem ${index}:`, item.image?.substring(0, 100) + '...');
    });
  }, [sliderList]);

    return (
      <View style={styles.container} className='py-8 px-6 flex-1' >
        <Header/>
        <Slider sliderList={sliderList} />
        <Categories categoryList={categoryList} />
      </View>
    )
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
});
