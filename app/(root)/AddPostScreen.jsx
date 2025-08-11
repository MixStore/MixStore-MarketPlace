import { ScrollView, Text, View, StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator, KeyboardAvoidingView, Button, Alert } from 'react-native'
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
import { addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import axios from "axios"
import {useGoogleLogin} from '@react-oauth/google'
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function AddPostScreen () {
  const [token, setToken] = useState(null)
  const [nomeImagem, setNomeImagem] = useState(null)
  const [loading, setLoading] = useState(false);
  const db = getFirestore(app);
  const [categoryList, setCategoryList] = useState([]);
  const [image, setImage] = useState(null)
  // const [value, setValue] = useState(null)
  const user=getAuth().currentUser
    useEffect(() => {
      getCategoryList();
    }, [])


  
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoResponse = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        setToken(tokenResponse.access_token);

        userInfo = userInfoResponse.data
        console.log('User Info:', userInfo);


      } catch (error) {
        console.error('Erro ao buscar informações do usuário:', error);
      }
    },
    onError: (errorResponse) => console.log('Erro no login:', errorResponse),
  });

  const uploadImageToDrive = async (accessToken, value) => {
  
    const imagem = await fetch(image);
    const binario = await imagem.blob();
  
    const metadata = {
      name: nomeImagem ,
      parents: ["11MVzH8BVFezzZs-GlozGp0xyWX6jRQs9"]
    };
  
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', binario);
  
      console.log("teste axes token: " + accessToken)
    const uploadResponse = await axios.post(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      form, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const result = uploadResponse.data;


    await axios.post(
      `https://www.googleapis.com/drive/v3/files/${result.id}/permissions`,
      {
        role: 'reader',
        type: 'anyone',
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
     
      const publicUrl = `https://drive.google.com/uc?id=${result.id}`;


      console.log('Upload feito:', result);


      await salvarNoFirestore(value, result.id, publicUrl);

    
  };
  
  const pickImageAsync = async () => {
    if (Platform.OS === 'web') {
      // Web: apenas galeria
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setImage(result.assets[0]?.uri);
        setNomeImagem(result.assets[0]?.fileName)
      } else {
        Alert.alert('Nenhuma imagem', 'Você não selecionou nenhuma imagem.');
      }
    } else {
      // Mobile: oferece opções
      Alert.alert(
        'Selecionar imagem',
        'Escolha a origem da imagem',
        [
          {
            text: 'Câmera',
            onPress: async () => {
              const permission = await ImagePicker.requestCameraPermissionsAsync();
              if (permission.granted) {
                const result = await ImagePicker.launchCameraAsync({
                  allowsEditing: true,
                  quality: 1,
                });

                if (!result.canceled && result.assets?.length > 0) {
                  setImage(result.assets[0]?.uri);
                  setNomeImagem(result.assets[0]?.fileName)
                } else {
                  Alert.alert('Nenhuma foto', 'Você não tirou nenhuma foto.');
                }
              } else {
                Alert.alert('Permissão negada', 'Permissão da câmera foi negada.');
              }
            },
          },
          {
            text: 'Galeria',
            onPress: async () => {
              const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (permission.granted) {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  quality: 1,
                });

                if (!result.canceled && result.assets?.length > 0) {
                  setImage(result.assets[0]?.uri);
                  setNomeImagem(result.assets[0]?.fileName)
                } else {
                  Alert.alert('Nenhuma imagem', 'Você não selecionou nenhuma imagem.');
                }
              } else {
                Alert.alert('Permissão negada', 'Permissão da galeria foi negada.');
              }
            },
          },
          {
            text: 'Cancelar',
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    }
  };

const onSubmitMethod = async (value) => {
  try {

    // let base64Image;

    if (Platform.OS === 'web') {
      const imagem = await fetch(image);
      const binario = await imagem.blob();
    
      const reader = new FileReader();
      reader.readAsDataURL(binario);
    
      reader.onloadend = async () => {
        // const base64Original = reader.result.split(',')[1]; // remove o prefixo
        // const base64Comprimida = await comprimirImagem(`data:image/jpeg;base64,${base64Original}`);
    
        // if (base64Comprimida) {      
        
          
      if (!token) {
        googleLogin(); // Isso vai disparar o login e depois você pode continuar
        return; // Aguarde o login antes de continuar
      }

      setLoading(true)

          await uploadImageToDrive(token, value)
        // } else {
          // console.warn('Não foi possível comprimir a imagem para o tamanho desejado.');
        // }
      };
    }
     else {
      // Mobile: usa FileSystem
      const imagem = await FileSystem.readAsStringAsync(image
      //    {
      //   encoding: FileSystem.EncodingType.Base64,
      // }
          );
          
    
      // const base64Comprimida = await comprimirImagem(`data:image/jpeg;base64,${base64Original}`);
      // if (base64Comprimida) {


      if (!token) {
        googleLogin(); // Isso vai disparar o login e depois você pode continuar
        return; // Aguarde o login antes de continuar
      }
        await uploadImageToDrive(token, value)
      // } else {
        // console.warn('Não foi possível comprimir a imagem para o tamanho desejado.');
      // }
    }
    
  } catch (error) {
    console.error("Erro ao enviar post:", error);
    alert("Erro ao enviar post.");
  }


};
  
  const salvarNoFirestore = async (value, imageId, imageUrl) => {
    const postData = {
      title: value.title,
      desc: value.desc,
      category: value.category,
      address: value.address,
      price: value.price,
      imageUrl: imageUrl,
      imageId: imageId,
      // ? imageUrl : base64Comprimida,
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
   
  // async function comprimirImagem (uri) {
  //   let qualidade = 1.0;
  //   let imagemComprimida = null;
  
  //   while (qualidade > 0) {
  //     const resultado = await ImageManipulator.manipulateAsync(
  //       uri,
  //       [],
  //       { compress: qualidade, format: ImageManipulator.SaveFormat.JPEG, base64: true }
  //     );
  
  //     const tamanhoEmBytes = (resultado.base64.length * 3) / 4;
  
  //     if (tamanhoEmBytes <= 1024 * 1024) {
  //       imagemComprimida = resultado.base64;
  //       break;
  //     }
  
  //     qualidade -= 0.1; // Reduz a qualidade gradualmente
  //   }
  
  //   return imagemComprimida;
  // };

  const getCategoryList=async ()=>{
    setCategoryList([])
    const querySnapshot = await getDocs(collection(db, "Category"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots

      console.log(doc.id, " => ", doc.data());
      setCategoryList(categoryList => [...categoryList, doc.data()])
      

    });
  }

    return (
      <GoogleOAuthProvider clientId="557231134276-0hqhotgpndav0cqv5jiltnd9g1pgs6qj.apps.googleusercontent.com">
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
                {loading ? <ActivityIndicator className='mt-24' size={'large'} color={COLORS.primary} /> : <></> }


                <Text style={styles.buttonText} > Enviar </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
      </KeyboardAvoidingView>
      </ScrollView>
      </GoogleOAuthProvider>
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

