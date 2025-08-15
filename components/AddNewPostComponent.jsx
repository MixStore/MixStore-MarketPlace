import { ScrollView, Text, View, StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator, KeyboardAvoidingView, Button, Alert } from 'react-native'
import { COLORS } from '../app/util/COLORS';
import { app } from '../firebaseConfig';
import { Formik } from 'formik';
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore"
import { collection, getDocs} from "firebase/firestore";
import { useState, useEffect, useRef, useLayoutEffect  } from 'react';
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import "../global.css"
import { Platform } from 'react-native';
import { addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { GoogleOAuthProvider } from '@react-oauth/google';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

export default function AddNewPostComponent ({params, navigation}) {
  const [image, setImage] = useState(null)
  const [imageQrCode, setImageQrCode] = useState(null)
  const [loading, setLoading] = useState(false);
  const db = getFirestore(app);
  const [categoryList, setCategoryList] = useState([]);
  const formikRef = useRef();
  const user=getAuth().currentUser
  const bd = getFirestore(app)
  const [userInfo, setUserInfo] = useState({ createdAt: null, email: "", fullName: "", phone: "", photoURL: "", uid: "", defaultPix: "", defaultQrCode: "", updatedAt: new Date()})

  
 
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
                  setImageQrCode (result.assets[0]?.uri);
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
          await salvarNoFirestore(value, base64Comprimida, base64ComprimidaQrCode);
          return
        }

        if (base64Comprimida) {
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



  
  const salvarNoFirestore = async (value, base64Comprimida, base64QrCodeComprimida) => {

    const base64QrCodePadrao = userInfo.defaultQrCode;

    const codigoPixPadrao = userInfo.defaultPix;


    const postData = {
      title: value.title,
      desc: value.desc,
      category: value.category,
      address: value.address,
      price: value.price,
      imageBase64: base64Comprimida,
      codigoCobrancaPix: value.codigoCobrancaPix || codigoPixPadrao,
      imageBase64QrCodePix: base64QrCodeComprimida || base64QrCodePadrao ,
      userEmail: user.email,
      userName: user.displayName,
      userImage: userInfo.photoURL,
      createdAt: new Date(),
    };
    console.log("Dados do post:", postData);


  
    try{
      
    const docRef = await addDoc(collection(db, "UserPost"), postData);
      await setDoc(doc(db, "UserPost", docRef.id), {
        ...postData,
        id: docRef.id,
      });
  

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

  const getUserInfo = async () => {
    if (!user?.uid) return;
  
      try {
    
        const userDocRef = doc(bd, 'users', user?.uid);
        const snapshot = await getDoc(userDocRef);
    
        if (snapshot.exists()) {
          const data = snapshot.data();
          setUserInfo(prev => ({
            ...prev,
            ...data,
          }));
          console.log("sefasdfasdfasdasdf ", data.defaultPix)

        } else {
          console.warn('Documento do usuário não encontrado.');
        }
      } catch (error) {
        console.error("Erro ao buscar user:", error);
      } finally {
      }
    };

    useLayoutEffect(()=>{
    }, [])

  // const [value, setValue] = useState(null)
    useEffect(() => {
      getCategoryList();
      getUserInfo();

    }, [])

    return (
      <GoogleOAuthProvider clientId="557231134276-0hqhotgpndav0cqv5jiltnd9g1pgs6qj.apps.googleusercontent.com">
      <ScrollView showsVerticalScrollIndicator={false} className='p-10' style={styles.container}>
      <KeyboardAvoidingView>
      <ScrollView >
         <Text className='text-[27px] font-bold'> Adicionar novo Post </Text>
        <Text className='text-[16px] text-gray-500 mb-7'> Criar novo post e começar a vender</Text>
        <Formik
        initialValues={{title: '', desc:'', category:'', address:'', price:'', image:'', userName:'', userEmail:'', userImage:'', createAt:Date.now(), 
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
                  <Image source={require("../assets/images/placeholder.jpg")} style={styles.image} />
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={pickQrCodeImageAsync}>
                {imageQrCode ? (
                  <Image source={{ uri: imageQrCode }} style={styles.image} />
                ) : (
                  <Image source={require("../assets/images/pixQrCodePadrao.png")} style={styles.imageopaccity} />
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
                placeholder={userInfo.defaultPix}
                placeholderTextColor='rgba(0, 0, 0, 0.4)'
                defaultValue={userInfo.defaultPix}
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

