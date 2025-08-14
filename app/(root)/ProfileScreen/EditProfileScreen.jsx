import { StyleSheet, Alert, ActivityIndicator, View, Text, TouchableOpacity, TextInput, Platform, Image, TurboModuleRegistry  } from 'react-native'
import { COLORS } from '../../util/COLORS';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useFocusEffect, useNavigation } from 'expo-router'
import "../../../global.css"
import { app } from '../../../firebaseConfig';
import { use, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc, getFirestore, query, where, getDoc, collection } from 'firebase/firestore';

import FlashMessage, { showMessage } from 'react-native-flash-message';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';



export default function EditProfileScreen () {
  const auth = getAuth();
  const user  = auth.currentUser
  const bd = getFirestore(app)
  const [loading, setLoading] = useState(false)
  const [loadingButton, setLoadingButton] = useState(false)

  const [photoURL, setPhotoUrl] = useState('')
  const [emailAddress, setEmailAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [defaultPix, setDefaulPix] = useState('')

  const [image, setImage] = useState(null)
  const [imageQrCode, setImageQrCode] = useState(null)
  
  const [editable, setEditable] = useState(false)
  const [userInfo, setUserInfo] = useState({ createdAt: null, email: "", fullName: "", phone: "", photoURL: "", uid: "", defaultPix: "", defaultQrCode: "", updatedAt: new Date()})
  const [saved, setSaved] = useState(false)


  const pickQrCodeImageAsync = async () => {
    if (Platform.OS === 'web') {
      // Web: apenas galeria
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const base64 = await base64QrCode(result.assets[0].uri);
        setImageQrCode(base64);
        console.log("Imagem QR Code base64:", base64?.slice(0, 100));

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

                  setImageQrCode (await base64QrCode(result.assets[0].uri));
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
 
  async function comprimirImagem(uri) {
    let qualidade = 1.0;
    let imagemComprimida = null;
  
    while (qualidade > 0) {
      try {
        const resultado = await ImageManipulator.manipulateAsync(
          uri,
          [],
          {
            compress: qualidade,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }
        );
  
        const tamanhoEmBytes = (resultado.base64.length * 3) / 4;
  
        if (tamanhoEmBytes <= 1024 * 1024) {
          imagemComprimida = resultado.base64;
          break;
        }
  
        qualidade -= 0.1;
      } catch (error) {
        console.error("Erro ao comprimir imagem:", error);
        break;
      }
    }
  
    return imagemComprimida;
  }
  

  const base64QrCode = async (imageUri) => {
    if (Platform.OS === 'web') {
      const response = await fetch(imageUri);
      const blob = await response.blob();
  
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result.split(',')[1]);
        };
        reader.readAsDataURL(blob);
      });
  
      return base64;
    } else {
      return await comprimirImagem(imageUri); // aqui passa o URI da imagem
    }
  };

  function showToast(message, type = 'success') {
    showMessage({
      message,
      type, // 'success', 'danger', 'info'
      duration: 3000,
      position: 'bottom',
    })
  }
  
  const uploadToCloudinary = async (uri) => {
    
    const cloudName = 'ddoinvb8m';
    const uploadPreset = 'MixStore'

    try {
      const data = new FormData();
    data.append("upload_preset", uploadPreset); // substitua pelo seu
    data.append("file", uri); // substitua pelo seu
  
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: data,
      },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }

    );
  
      const result = await res.json();
      console.log("Upload result:", result);

      if (result.secure_url) {
        return result.secure_url;
      } else {
        console.error("Erro ao obter URL da imagem:", result);
        return null;
      }
    } catch (error) {
      console.error("Erro no upload para Cloudinary:", error);
      return null;
    }
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

  const onSavePress = async () => {
    if (!fullName || !phone) {
      showToast('Campos obrigatórios', 'danger');
      return;
    }

 
  
    try {
      setLoadingButton(true);
      
        let uploadedPhotoUrl = photoURL;

        if (image) {
          uploadedPhotoUrl = await uploadToCloudinary(image);
          setPhotoUrl(uploadedPhotoUrl); // atualiza o estado para renderização futura
          

        }
        

      const userDocRef = doc(bd, 'users', user.uid);
  
      const updatedInfo = {
        fullName: fullName || '',
        phone: phone || '',
        defaultPix: defaultPix || '',
        defaultQrCode: imageQrCode || '',
        photoURL: uploadedPhotoUrl || '',
        updatedAt: new Date(),
      };
  
      await setDoc(userDocRef, updatedInfo, { merge: true });
  
      showToast('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      showToast('Não foi possível salvar as alterações.', 'danger');
    } finally {
      setLoadingButton(false);
      setEditable(false)
      setSaved(!saved)
      await getUserInfo(); // recarrega os dados atualizados
    }
  };

  useLayoutEffect(()=>{
    setPhone("")
    setFullName("")
    setDefaulPix("")
    setPhotoUrl("")

    setImage(null)
    setImageQrCode(null)

  }, [saved])

  
useFocusEffect(
    useCallback(() => {
      getUserInfo()
    }, [])
  );

useEffect(()=>{
  setLoading(true);
  getUserInfo()
 
},[user])

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
        if(data.defaultQrCode){
          setImageQrCode(data.defaultQrCode)
        }
        if(data.photoURL){
          setPhotoUrl(data.photoURL)
        }
        
      } else {
        console.warn('Documento do usuário não encontrado.');
      }
    } catch (error) {
      console.error("Erro ao buscar user:", error);
    } finally {
      
      setLoading(false);
    }
  };
  

 


const changepassword = (email) =>  {
   sendPasswordResetEmail(auth, email)
  .then(() => {
    showToast("E-mail de redefinição enviado!")
    console.log("E-mail de redefinição enviado!");
  })
  .catch((error) => {
    showToast("Erro ao enviar e-mail", "danger")
    console.error("Erro ao enviar e-mail:", error);
  });
}



  return (
      <KeyboardAwareScrollView  style={styles.container} className='p-5 flex-1' showsVerticalScrollIndicator={false} >     
          
          {
          loading

            ? 

            <ActivityIndicator className='mt-24' size={'large'} color={COLORS.primary} /> 
            
            :

            <View style={styles.container}>        
                <View>
                    {/* Seção: Informações Pessoais */}
                    <Text style={modern.sectionTitle}>Informações Pessoais</Text>
                    <TouchableOpacity
                      onPress={pickImageAsync}
                      style={modern.avatarContainer}
                      disabled={!editable}
                    >
                      {photoURL ? ( image ? 
                      
                      <Image source={{ uri: image }} style={modern.avatar} /> :
                      
                      <View>
                          <Image source={{ uri: photoURL }} style={modern.avatar} />
                          {editable && (
                            <View style={modern.editIconContainer}>
                              <Ionicons name="pencil" size={20} color="#fff" />
                            </View>
                          )}
                        </View>
                      ) : (
                        <View style={modern.avatarPlaceholder}>
                          <Ionicons name="camera" size={32} color={COLORS.primary} />
                          <Text style={modern.avatarText}>Adicionar foto</Text>
                        </View>
                      )}
                    </TouchableOpacity>


                    <View style={modern.form}>
                        {/* E-mail */}
                        <View style={modern.inputGroup}>
                        <Ionicons name="mail" size={20} color={COLORS.primary} style={modern.icon} />
                        <TextInput style={modern.input} placeholder={userInfo.email} value={emailAddress} onChangeText={setEmailAddress} autoCapitalize="none" editable={false} />
                        </View>

                        {/* Nome */}
                        <View style={modern.inputGroup}>
                        <Ionicons name="person" size={20} color={COLORS.primary} style={modern.icon} />
                        <TextInput style={modern.input} placeholder={!editable ? userInfo.fullName : ""} placeholderTextColor={'rgba(0, 0, 0, 0.4)'} value={fullName} onChangeText={setFullName} editable={editable} />
                        </View>

                        {/* Telefone */}
                        <View style={modern.inputGroup}>
                        <Ionicons name="call" size={20} color={COLORS.primary} style={modern.icon} />
                        <TextInput style={modern.input} placeholder={!editable ? userInfo.phone : ""} placeholderTextColor={'rgba(0, 0, 0, 0.4)'} value={phone} onChangeText={setPhone} keyboardType="phone-pad" editable={editable} />
                        </View>
                        
                    </View>

                    {/* Seção: Informações de Pagamento */}
                    <Text style={modern.sectionTitle}>Informações de Pagamento</Text>

                    {/* QR Code */}
                    <View style={modern.paymentGroup}>
                        <Text style={modern.paymentLabel}>QR Code para pagamento</Text>
                        <TouchableOpacity onPress={pickQrCodeImageAsync} style={modern.qrContainer} disabled={!editable} >
                        {imageQrCode ? (
                          <View>
                            <Image source={{ uri: `data:image/jpeg;base64,${imageQrCode}` }} style={modern.qrImage} />
                            {editable && (
                              <View style={modern.editIconContainer}>
                                <Ionicons name="pencil" size={20} color="#fff" />
                              </View>
                            )}
                            </View>
                        ) : (
                            <View style={modern.qrPlaceholder}>
                            <Ionicons name="qr-code" size={32} color={COLORS.primary} />
                            <Text style={modern.avatarText}>Adicionar QR Code</Text>
                            </View>
                        )}
                        </TouchableOpacity>
                    </View>

                    {/* Pix Copia e Cola */}
                        <View style={modern.inputGroup}>
                        <Ionicons name="cash" size={20} color={COLORS.primary} style={modern.icon} />
                        <TextInput style={modern.input} placeholder={!editable ? (userInfo.defaultPix || "Chave Pix copia e cola padrão" ) : ""} placeholderTextColor={'rgba(0, 0, 0, 0.4)'} value={defaultPix} onChangeText={setDefaulPix} editable={editable}/>
                        </View>

                   
                {/* Botão de salvar */}
                <TouchableOpacity
                onPress={onSavePress}
                style={[modern.submitButton, { backgroundColor: loadingButton ? COLORS.shadow : COLORS.primary }]}
                disabled={loadingButton}
                >
                {loadingButton ? <ActivityIndicator size={'large'} color={COLORS.primary} /> : null}
                <Text style={modern.submitText}>Salvar alterações</Text>
                </TouchableOpacity>



                                </View>
                                {/* Botões de ação: editar e alterar senha */}
                {/* Botões de ação: editar e alterar senha */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                <TouchableOpacity onPress={() => {
                  setEditable(!editable)
                  setEmailAddress(userInfo.email)
                  setFullName(userInfo.fullName)
                  setPhone(userInfo.phone)
                  setDefaulPix(userInfo.defaultPix)

                }} style={modern.iconButton}>
                    <Ionicons name={editable ? 'lock-open' : 'lock-closed'} size={24} color={COLORS.primary} />
                    <Text style={modern.iconButtonText}>{editable ? 'Desabilitar edição' : 'Habilitar edição'}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => changepassword(userInfo.email)} style={modern.iconButton}>
                    <Ionicons name="key" size={24} color={COLORS.primary} />
                    <Text style={modern.iconButtonText}>Alterar senha</Text>
                </TouchableOpacity>
                </View>

                <FlashMessage position="bottom" />
            </View>
          }
      </KeyboardAwareScrollView >
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  }
});
  const modern = StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textDark,
        alignSelf: 'flex-start',
        marginBottom: 12,
        marginTop: 8, // mais espaço entre seções
      },
      
      paymentGroup: {
        width: '100%',
        marginBottom: 24,
      },
      
      paymentLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
      },
      
      qrContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      },
      avatarContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
      },
      
      avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
      },
      
      editIconContainer: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        padding: 4,
      },
      
      
      qrImage: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
      },
      
      qrPlaceholder: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
      },
      
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
      alignItems: 'center',
    },
    avatarContainer: {
      marginBottom: 24,
      alignItems: 'center',
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    avatarPlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: '#e0e0e0',
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      fontSize: 12,
      color: COLORS.primary,
      marginTop: 4,
    },
    form: {
      width: '100%',
    },
    inputGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    icon: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: '#333',
      borderWidth: 0,
      outlineStyle: 'none',
    },
    submitButton: {
      backgroundColor: COLORS.primary,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 4,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    submitText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    footer: {
      alignItems: 'center',
    },
    footerText: {
      fontSize: 14,
      color: '#666',
    },
    footerLink: {
      fontSize: 14,
      color: COLORS.primary,
      fontWeight: 'bold',
      marginTop: 4,
    },
    iconButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 10,
        marginHorizontal: 8,
        backgroundColor: '#fff',
        width: 140,
      },
      iconButtonText: {
        fontSize: 12,
        color: COLORS.primary,
        marginTop: 4,
        textAlign: 'center',
      },
      
  });
  
