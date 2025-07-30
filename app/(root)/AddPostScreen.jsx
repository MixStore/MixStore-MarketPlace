import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native'
import { COLORS } from '../util/COLORS';
import { app } from '../../firebaseConfig';
import { Formik } from 'formik';
import { getFirestore } from "firebase/firestore"
import { collection, getDocs} from "firebase/firestore";
import { useState, useEffect  } from 'react';
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import "../../global.css"

import { Platform } from 'react-native';

import * as FileSystem from 'expo-file-system';
import { addDoc } from 'firebase/firestore';




export default function AddPostScreen () {
  const db = getFirestore(app);
  const [categoryList, setCategoryList] = useState([]);
  const [image, setImage] = useState(null)

  useEffect(() => {
    getCategoryList();
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

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    } else {
      alert('Você não selecionou nenhuma imagem.');
    }
  };
  

  

  const onSubmitMethod = async (value) => {
    try {
      let base64Image;
  
      if (Platform.OS === 'web') {
        // Web: usa fetch + FileReader
        const response = await fetch(image);
        const blob = await response.blob();
  
        const reader = new FileReader();
        reader.readAsDataURL(blob);
  
        reader.onloadend = async () => {
          base64Image = reader.result.split(',')[1]; // remove o prefixo "data:image/jpeg;base64,"
          await salvarNoFirestore(base64Image, value);
        };
      } else {
        // Mobile: usa FileSystem
        base64Image = await FileSystem.readAsStringAsync(image, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await salvarNoFirestore(base64Image, value);
      }
    } catch (error) {
      console.error("Erro ao enviar post:", error);
      alert("Erro ao enviar post.");
    }
  };
  
  const salvarNoFirestore = async (base64Image, value) => {
    console.log("xgvbzxcblçm,zxcvbmclçbmxcgbkm   " + value.category)
    const postData = {
      title: value.title,
      desc: value.desc,
      category: value.category,
      address: value.address,
      price: value.price,
      imageBase64: base64Image,
      createdAt: new Date(),
    };
  
    await addDoc(collection(db, "Posts"), postData);
    alert("Post enviado com sucesso!");
    value.title = ''
    value.desc = ''
    value.category = ''
    value.address = ''
    value.price = ''
    setImage(null);
  };
  
  

    return (
      <View className='p-10' style={styles.container}>
        <Text className='text-[27px] font-bold'> Adicionar novo Post </Text>
        <Text className='text-[16px] text-gray-500 mb-7'> Criar novo post e começar a vender</Text>

        <Formik
        initialValues={{title: '', desc:'', category:'', address:'', price:'', image:''}}
        onSubmit={value => onSubmitMethod(value)}
        validate={(values) =>{
          const errors={}
          if(!values.title){
            console.log("Campo título vazio")
            errors.name="Titulo necessário"
          }
          return errors
        }}
        >
          {({handleChange, handleBlur, handleSubmit, values, setFieldValue, errors}) =>(
            <View>

              <TouchableOpacity onPress={pickImageAsync}>
              {
                image
               
                ?
                
                <Image source={{uri:image}} style={styles.image} /> 
                
                :
                
                <Image source={require("../../assets/images/placeholder.jpg")} style={styles.image} />
              }
              

              </TouchableOpacity>
              
              <TextInput 
              style={styles.textInput}
              placeholder='Título'
              value={values?.title}
              onChangeText={handleChange('title')}
              />
              <TextInput 
              style={styles.textInput}
              placeholder='Descrição'
              value={values?.desc}
              numberOfLines={5}
              onChangeText={handleChange('desc')}
              />
              <TextInput 
              style={styles.textInput}
              placeholder='Preço'
              value={values?.price}
              keyboardType='number-pad'
              onChangeText={handleChange('price')}
              />
              <TextInput 
              style={styles.textInput}
              placeholder='Address'
              value={values?.address}
              onChangeText={handleChange('address')}
              />


<Picker
  selectedValue={values?.category}
  onValueChange={(itemValue) => setFieldValue('category', itemValue)}
  style={styles.textInput}
>
  <Picker.Item label="Selecione uma categoria" value="" />
  {categoryList.map((item, index) => (
    <Picker.Item key={index} label={item?.name} value={item?.name} />
  ))}
</Picker>


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
    marginTop: 10,
    marginBottom: 5,
    padding: 10,
    textAlignVertical:'top',
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
  },
   image:{
    width: 135,
    height: 100,
    borderRadius: 10
   }
});

