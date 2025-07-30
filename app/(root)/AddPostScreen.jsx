import { Text, View, StyleSheet, TextInput, Button, Pressable,TouchableOpacity } from 'react-native'
import { COLORS } from '../util/COLORS';
import { app } from '../../firebaseConfig';
import { Formik } from 'formik';
import { getFirestore } from "firebase/firestore"
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect  } from 'react';
import { stl } from "../../assets/styles/home.styles"



export default function AddPostScreen () {
  const db = getFirestore(app);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    getCategoryList();
  }, [])
  

  const getCategoryList=async ()=>{
    const querySnapshot = await getDocs(collection(db, "Category"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots

      console.log(doc.id, " => ", doc.data());
      setCategoryList(categoryList => [...categoryList, doc.data])

    });
  }

    return (
      <View className='p-10' style={styles.container}>
        <Formik
        initialValues={{title: '', desc:'', categort:'', address:'', price:'', image:''}}
        onSubmit={value => console.log(value)}
        >
          {({handleChange, handleBlur, handleSubmit, values}) =>(
            <View>
              <TextInput 
              style={styles.textInput}
              placeholder='Título'
              value={values?.title}
              onChangeText={handleChange('tite')}
              />
              <TouchableOpacity onPress={handleSubmit}  style={styles.addButton} >
                <Text style={styles.buttonText} > Enviar </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  textInput:{
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 17,
    fontSize: 17
  },
  addButton:{
      backgroundColor: COLORS.primary,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 24,
      flexDirection: "row",
      justifyContent: "center", // centraliza o conteúdo horizontalmente
      alignItems: "center",     // centraliza verticalmente
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      width: '100%',            // ocupa toda a largura disponível
      marginTop: 20,
  },
  buttonText:{
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center", // garante que o texto fique centralizado  
  }
});

