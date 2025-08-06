import { ScrollView, Text, View, StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
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
import * as ImageManipulator from 'expo-image-manipulator';
import { getAuth } from 'firebase/auth';


export default function AddPostScreen () {
  const [loading, setLoading] = useState(false);
  const db = getFirestore(app);
  const [categoryList, setCategoryList] = useState([]);
  const [image, setImage] = useState(null)
  const user=getAuth().currentUser

  
  console.log("meu nome e jlia")
  console.log(user)

    

  useEffect(() => {
    getCategoryList();
  }, [])
  
  async function comprimirImagem (uri) {
    let qualidade = 1.0;
    let imagemComprimida = null;
  
    while (qualidade > 0) {
      const resultado = await ImageManipulator.manipulateAsync(
        uri,
        [],
        { compress: qualidade, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
  
      const tamanhoEmBytes = (resultado.base64.length * 3) / 4;
  
      if (tamanhoEmBytes <= 1024 * 1024) {
        imagemComprimida = resultado.base64;
        break;
      }
  
      qualidade -= 0.1; // Reduz a qualidade gradualmente
    }
  
    return imagemComprimida;
  };

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
    setLoading(true)

    

    try {
      let base64Image;
  
      if (Platform.OS === 'web') {
        const response = await fetch(image);
        const blob = await response.blob();
      
        const reader = new FileReader();
        reader.readAsDataURL(blob);
      
        reader.onloadend = async () => {
          const base64Original = reader.result.split(',')[1]; // remove o prefixo
          const base64Comprimida = await comprimirImagem(`data:image/jpeg;base64,${base64Original}`);
      
          if (base64Comprimida) {
            await salvarNoFirestore(base64Comprimida, value);
          } else {
            console.warn('Não foi possível comprimir a imagem para o tamanho desejado.');
          }
        };
      }
       else {
        // Mobile: usa FileSystem
        const base64Original = await FileSystem.readAsStringAsync(image, {
          encoding: FileSystem.EncodingType.Base64,
        });
      
        const base64Comprimida = await comprimirImagem(`data:image/jpeg;base64,${base64Original}`);
      
        if (base64Comprimida) {
          await salvarNoFirestore(base64Comprimida, value);
        } else {
          console.warn('Não foi possível comprimir a imagem para o tamanho desejado.');
        }
      }
      
    } catch (error) {
      console.error("Erro ao enviar post:", error);
      alert("Erro ao enviar post.");
    }
  };
  
  const salvarNoFirestore = async (base64Image, value) => {
    const postData = {
      title: value.title,
      desc: value.desc,
      category: value.category,
      address: value.address,
      price: value.price,
      imageBase64: base64Image,
      userName: user.displayName,
      useremail: user.email,
      userImage: user.photoURL,
      createdAt: new Date(),
    };
  
    try{
      await addDoc(collection(db, "UserPost"), postData);
      setLoading(false)  
      alert("Post enviado com sucesso!");
        
      }
      catch(error){
        console.log("erro: "  + error)
      }

    value.title = ''
    value.desc = ''
    value.category = ''
    value.address = ''
    value.price = ''
    setImage(null);

  };
  
  

    return (
      <ScrollView showsVerticalScrollIndicator={false} className='p-10' style={styles.container}>
      <KeyboardAvoidingView>
      <ScrollView >
        <Text className='text-[27px] font-bold'> Adicionar novo Post </Text>
        <Text className='text-[16px] text-gray-500 mb-7'> Criar novo post e começar a vender</Text>
        <Formik
        initialValues={{title: '', desc:'', category:'', address:'', price:'', image:'', userName:'', useremail:'', userImage:'', createAt:Date.now() }}
        onSubmit={value => onSubmitMethod(value)}
        validate={(values) =>{
          const errors={}
          if(!values.title){
            console.log("Campo título vazio")
            errors.titulo="Titulo necessário"
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


              <TouchableOpacity onPress={handleSubmit} 
style={[
    styles.addButton,
    { backgroundColor: loading ? COLORS.shadow : COLORS.primary }
  ]}
 disabled={loading} >
                {loading ? <ActivityIndicator color={'#fff'} /> : <></> }


                <Text style={styles.buttonText} > Enviar </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
      </KeyboardAvoidingView>
      </ScrollView>
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

