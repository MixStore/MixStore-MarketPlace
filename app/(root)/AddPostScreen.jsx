import { ScrollView, Text, View, StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator, KeyboardAvoidingView, Button, Alert } from 'react-native'
import { COLORS } from '../util/COLORS';
import { app } from '../../firebaseConfig';
import { Formik } from 'formik';
import { getFirestore } from "firebase/firestore"
import { collection, getDocs} from "firebase/firestore";
import { useState, useEffect, useRef  } from 'react';
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import "../../global.css"
import { Platform } from 'react-native';
import { addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import axios from "axios"
import {useGoogleLogin} from '@react-oauth/google'
import { GoogleOAuthProvider } from '@react-oauth/google';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as Asset from 'expo-asset';

export default function AddPostScreen () {
  const [token, setToken] = useState(null)
  const [nomeImagem, setNomeImagem] = useState(null)
  const [image, setImage] = useState(null)
  const [imageQrCode, setImageQrCode] = useState(null)
  const [nomeQrCodeImage, setNomeQrCodeImage] = useState(null)
  const [loading, setLoading] = useState(false);
  const db = getFirestore(app);
  const [categoryList, setCategoryList] = useState([]);
  const formikRef = useRef();


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


  const pickQrCodeImageAsync = async () => {
    if (Platform.OS === 'web') {
      // Web: apenas galeria
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setImageQrCode(result.assets[0]?.uri);
        setNomeQrCodeImage(result.assets[0]?.fileName)
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
      setLoading(true)

      let base64Image;

        if (Platform.OS === 'web') {
          const imagem = await fetch(image);
          const binario = await imagem.blob();

          const base64Original = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result.split(',')[1]); // remove o prefixo
            };
            reader.readAsDataURL(binario);
          });

          console.log("Base64 original:", base64Original?.slice(0, 100));

          const base64Comprimida = await comprimirImagem(`data:image/jpeg;base64,${base64Original}`);

          if(imageQrCode){
            const imagemQrCode = await fetch(imageQrCode);
            const binarioQrCode = await imagemQrCode.blob();
  
            const base64QrCodeOriginal = await new Promise((resolve) => {
              const readerQrCode = new FileReader();
              readerQrCode.onloadend = () => {
                resolve(readerQrCode.result.split(',')[1]); // remove o prefixo
              };
              readerQrCode.readAsDataURL(binarioQrCode);
            });
            console.log("Base64QrCode Original :", base64QrCodeOriginal?.slice(0, 100));

            const base64QrCodeComprimida = await comprimirImagem(`data:image/jpeg;base64,${base64QrCodeOriginal}`);

            await salvarNoFirestore(value, base64Comprimida, base64QrCodeComprimida);

            return

          }
          
        
          

         

        
          if (base64Comprimida) {
            await salvarNoFirestore(value, base64Comprimida, null);
          } else {
            console.warn('Não foi possível comprimir a imagem para o tamanho desejado.');
          }
        }
        
      
      else {
        const imagem = await FileSystem.readAsStringAsync(image, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const base64Comprimida = await comprimirImagem(`data:image/jpeg;base64,${imagem}`);


        if(imageQrCode){
          const imagemQrCode = await FileSystem.readAsStringAsync(imageQrCode, {
            encoding: FileSystem.EncodingType.Base64,
          });
          const base64ComprimidaQrCode = await comprimirImagem(`data:image/jpeg;base64,${imagemQrCode}`);
          await salvarNoFirestore(value, base64Comprimida);


          return
        }
      

        
        
        if (base64Comprimida) {
        // if (!token) {
          // googleLogin(); // Isso vai disparar o login e depois você pode continuar
          // return; // Aguarde o login antes de continuar
        // }
          // await uploadImageToDrive(token, value)
          await salvarNoFirestore(value, base64Comprimida);
        } else {
          console.warn('Não foi possível comprimir a imagem para o tamanho desejado.');
        }
      }
      
    } catch (error) {
      
      console.error("Erro ao enviar post:", error?.message || error);
      alert(`Erro ao enviar post: ${error?.message || error}`);

      setLoading(false)
    }
  };

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

  const carregarImagem = async () => {
    const response = await fetch('/pixQrCodePadrao.png');
    const blob = await response.blob();
    const mimeType = blob.type; // Ex: "image/png"
  
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        resolve({ base64, mimeType });
      };
      reader.readAsDataURL(blob);
    });
  };
  
  const salvarNoFirestore = async (value, base64Comprimida, base64QrCodeComprimida) => {

    const { base64: base64QrCodePadrao, mimeType } = await carregarImagem();

    const codigoPixPadrao = '00020126580014br.gov.bcb.pix01367db9522c-f113-44bc-9451-d3472a6f98ff5204000053039865802BR5923ABA BEATRIZ F DOS ANJOS6002SP62070503***6304090E';


    const postData = {
      title: value.title,
      desc: value.desc,
      category: value.category,
      address: value.address,
      price: value.price,
      imageBase64: base64Comprimida,
      codigoCobrancaPix: value.codigoCobrancaPix || codigoPixPadrao,
      imageBase64QrCodePix: base64QrCodeComprimida || base64QrCodePadrao ,
      useremail: user.email,
      userImage: user.photoURL,
      createdAt: new Date(),
    };
    console.log("Dados do post:", postData);


  
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
    value.codigoCobrancaPix = ''
    setImageQrCode(null)
    setImage(null);

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

    return (
      <GoogleOAuthProvider clientId="557231134276-0hqhotgpndav0cqv5jiltnd9g1pgs6qj.apps.googleusercontent.com">
      <ScrollView showsVerticalScrollIndicator={false} className='p-10' style={styles.container}>
      <KeyboardAvoidingView>
      <ScrollView >
         <Text className='text-[27px] font-bold'> Adicionar novo Post </Text>
        <Text className='text-[16px] text-gray-500 mb-7'> Criar novo post e começar a vender</Text>
        <Formik
        initialValues={{title: '', desc:'', category:'', address:'', price:'', image:'', userName:'', useremail:'', userImage:'', createAt:Date.now(), 
          codigoCobrancaPix: '',
          imageBase64QrCode: ''
           }}
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

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
              <TouchableOpacity onPress={pickImageAsync}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.image} />
                ) : (
                  <Image source={require("../../assets/images/placeholder.jpg")} style={styles.image} />
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={pickQrCodeImageAsync}>
                {imageQrCode ? (
                  <Image source={{ uri: imageQrCode }} style={styles.image} />
                ) : (
                  <Image source={require("../../assets/images/pixQrCodePadrao.png")} style={styles.imageopaccity} />
                )}
              </TouchableOpacity>
            </View>

              
            
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
              placeholder='Endereços de entrega'
              value={values?.address}
              onChangeText={handleChange('address')}
              />
              
              <TextInput
                style={styles.textInput}
                placeholder='00020126580014br.gov.bcb.pix01367db9522c-f113-44bc-9451-d3472a6f98ff5204000053039865802BR5923ABA BEATRIZ F DOS ANJOS6002SP62070503***6304090E'
                placeholderTextColor='rgba(0, 0, 0, 0.4)'
                defaultValue='00020126580014br.gov.bcb.pix01367db9522c-f113-44bc-9451-d3472a6f98ff5204000053039865802BR5923ABA BEATRIZ F DOS ANJOS6002SP62070503***6304090E'
                value={values?.codigoCobrancaPix}
                onChangeText={handleChange('codigoCobrancaPix')}
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
                {loading ? <ActivityIndicator size={'large'} color={COLORS.primary} /> : <></> }


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
   },
   imageopaccity:{
    width: 135,
    height: 100,
    borderRadius: 10,
    borderColor:"black",
    opacity:0.5
   }
});

