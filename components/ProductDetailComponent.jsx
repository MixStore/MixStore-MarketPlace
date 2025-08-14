
import { Modal, Clipboard, ToastAndroid, Dimensions } from 'react-native';
import { query, where, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { View, Text, Image, ScrollView,StyleSheet, TouchableOpacity, Linking, Share, Alert } from "react-native";
import { Platform } from "react-native";
import { COLORS } from "../app/util/COLORS";
import { Ionicons } from "@expo/vector-icons";
import "../global.css"
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { getAuth } from "firebase/auth";
import {useGoogleLogin} from '@react-oauth/google'
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from "axios"
import FlashMessage, { showMessage } from 'react-native-flash-message'



export default function ProductDetailComponent({params, navigation, productLink=null}){
    const [token, setToken] = useState(null)

    const[product, setProduct]=useState([])
    const user = getAuth().currentUser
    const db = getFirestore(app);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showPixModal, setShowPixModal] = useState(false);
    const [copied, setCopied] = useState(false);
    
    const screenWidth = Dimensions.get("window").width;
    const imageWidth = screenWidth * 0.9; // imagem menor que a tela
    const imageHeight = imageWidth * 9 / 16

    const pagarComPix = () => {
        setShowPixModal(true);
    };

    const copyToClipboard = () => {
        Clipboard.setString(product.codigoCobrancaPix);
        setCopied(true);
        setShowConfirmation(true);
        showToast("Código copiado!", "success");
    };
    
 function showToast(message, type = 'success') {
    showMessage({
      message,
      type, // 'success', 'danger', 'info'
      duration: 3000,
      position: 'bottom',
    })
  }


    useEffect(()=>{

        console.log("teste parametros",params)
        console.log("teste imagem URL", params.product.imageUrl)
        
        if(productLink !== null){
            setProduct(productLink)
        }
        else{
            params&&setProduct(params.product)
        }
        
        shareButton()
        
    }, [params, navigation, productLink])

    const shareButton=()=>{
        navigation.setOptions({
            headerRight: () => (<>
              <Ionicons  onPress={()=>sendEmailMessage()} name="document-text-sharp" size={24} color="white" style={{ marginRight: 15 }} />
              <Ionicons  onPress={()=>shareProduct()} name="share-social-sharp" size={24} color="white" style={{ marginRight: 15 }} />
              </>
            )
          });          
    }

    const shareProduct = async () => {
        if (Platform.OS === "web"){
            const content ={
                message: product.title+"\n"+product?.desc+"\n"+"Confira este produto!",
            }
            Share.share(content).then(resp=>{
                console.log(resp)
            }, (error) => {
                console.log(error)
            } )
              

        }
        else{
            try {
                const productId = product.createdAt?.seconds?.toString(); // ou use `product.createdAt.toMillis()` se quiser mais precisão
                const productUrl = `mixstore://product/${productId}`;
            
                const content = {
                  title: product.title,
                  message: `${product.title}\n${product.desc || "Confira esse produto!"}\n\nVeja mais: ${productUrl}`,
                  url: productUrl,
                };
            
                await Share.share(content);
              } catch (error) {
                console.error("Erro ao compartilhar:", error);
              }
        }
    };
      
    const sendEmailMessage=()=>{
        const title = product.title
        // const subject='Compra ' + product.title
        // const body="HI " + product.userName+"\n" + "Estou interessado neste produto"
        // Linking.openURL('mailto:' + product.useremail +"?subject=" + subject+"&body=" + body )
        if(title == null){
            Linking.openURL(`https://api.whatsapp.com/send?phone=5592984744917&text=Oi%2C%20Estou%20interessado%20em%20um%20produto%20de%20MixStore!`)

        }else{
        Linking.openURL(`https://api.whatsapp.com/send?phone=5592984744917&text=Oi%2C%20Estou%20interessado%20em%20${title}%20de%20MixStore!`)
            
        }
    }

    const deleteUserPost = async () => {
    if (Platform.OS === 'web') {
    const confirmDelete = window.confirm("Você tem certeza que deseja excluir este produto?");
    if (confirmDelete) {
        handleDelete();
    }
    } else {
    Alert.alert(
        "Confirmar?",
        "Você tem certeza que deseja excluir este produto?",
        [
        { text: "Cancelar", style: "cancel" },
        { text: "Deletar", onPress: () => handleDelete(), style: "destructive" }
        ]
    );
    }

    };

    const handleDelete = async () => {

        try {
            const db = getFirestore(app);
            const userPostRef = collection(db, 'UserPost');
            const q = query(userPostRef, where('useremail', '==', user?.email), where('title', '==', product.title));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                const docRef = snapshot.docs[0].ref;

                await deleteDoc(docRef);
                Alert.alert("Success", "Product deleted successfully.");
                navigation.goBack()
            } else {
                Alert.alert("Error", "Product not found.");
            }
        } catch (error) {
            console.error("Error deleting product: ", error);
            Alert.alert("Error", "Failed to delete product."); 
        }
    }; 

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
    
            // userInfo = userInfoResponse.data
            // console.log('User Info:', userInfo);
    
    
          } catch (error) {
            console.error('Erro ao buscar informações do usuário:', error);
          }
        },
        onError: (errorResponse) => console.log('Erro no login:', errorResponse),
    });

    const deleteImageFromDrive = async (fileId) => {
            try {
                await axios.delete(
                    `https://www.googleapis.com/drive/v3/files/${fileId}`,
                    {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    }
                );
                console.log("Imagem deletada do Drive com sucesso.");
                } catch (error) {
                console.error("Erro ao deletar imagem do Drive:", error);
                }
    };
  

    return(
        <GoogleOAuthProvider clientId="557231134276-0hqhotgpndav0cqv5jiltnd9g1pgs6qj.apps.googleusercontent.com">
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        

                      <Modal
            visible={showPixModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowPixModal(false)}
          >
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)'
            }}>
              <View style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 10,
                width: '90%',
                maxHeight: '80%',
              }}>
                <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                  {showConfirmation ? (
                    <>
                        <Image
                                      source={require("../assets/images/confirm.png")}
                                      style={{ width: 200, height: 200, marginBottom: 20 }}
                                      resizeMode="contain"
                              />
                      <Text style={{
                        fontSize: 16,
                        textAlign: 'center',
                        marginBottom: 10,
                        paddingHorizontal: 10
                      }}>
                        Ótimo, agora só falta enviar o comprovante de pagamento para o WhatsApp da MixStore!
                      </Text>
                      <TouchableOpacity
                        onPress={() => Linking.openURL(`https://api.whatsapp.com/send?phone=5592984744917&text=Olá!%20Estou%20enviando%20o%20comprovante%20de%20pagamento.`)}
                        style={{ backgroundColor: '#25D366', padding: 10, borderRadius: 5 }}
                      >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Enviar para WhatsApp</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Pagamento via Pix</Text>
                      <Image
                        source={{ uri: `data:image/png;base64,${product.imageBase64QrCodePix}` }}
                        style={{ width: 200, height: 200, marginBottom: 20 }}
                        resizeMode="contain"
                      />
                      <Text style={{
                        marginBottom: 10,
                        textAlign: 'center',
                        paddingHorizontal: 10
                      }}>
                        {product.codigoCobrancaPix}
                      </Text>
                      <TouchableOpacity onPress={copyToClipboard} style={{
                        backgroundColor: '#4CAF50',
                        padding: 10,
                        borderRadius: 5
                      }}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Copiar código Pix</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  <TouchableOpacity onPress={() => setShowPixModal(false)} style={{ marginTop: 15 }}>
                    <Text style={{ color: 'gray' }}>Fechar</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
                      </Modal>




        <Image
            source={{ uri: `data:image/jpeg;base64,${product?.imageBase64}` }}
            className="w-full aspect-[3/2]" 
            resizeMode="cover"
        />


            
            <View className="p-3">
            <Text className="text-[20px] font-bold">{product.title}</Text>

           

            <Text className="mt-3 font-bold text-[20px]">Preço</Text>
            <Text className="text-[20px] font-bold" style={styles.price}  >R$: {product.price} </Text>


            <Text className="mt-3 font-bold text-[20px]">Descrição</Text>
            <Text className="text-[17px] text-gray-500">{product.desc}</Text>


            <Text className="mt-3 font-bold text-[20px]">Endereços de entrega</Text>
            <Text className="text-[17px] text-gray-500">{product.address}</Text>
            </View>

            <View className="m-3 items-baseline">
                <Text className="bg-orange-100 text-gray-400 p-1 px-2 text-center rounded-full text-[10px] w-[70px]">
                {product.category}
                </Text>
            </View>


            <View style={styles.userContainer} className="p-3  flex flex-row items-center gap-3 border-[1px] border-gray-400">
                <Image source={{uri:product?.userImage}} 
                className="w-12 h=12 rounded-full"
                />
                <View>
                    <Text className="font-bold text-[18px]"> {product.userName} </Text>
                    <Text className="text-gray-500">{product.useremail}</Text>
                </View>
            </View>

                {user?.email===product.useremail 
                ? 
            <TouchableOpacity
            onPress={()=>deleteUserPost()}
            className="z-40 p-4 m-2 rounded-full" style={styles.buttonDelete} >
                <Text className="text-center text-white font-bold" >Deletar produto</Text>
            </TouchableOpacity>
                : 
                
                <TouchableOpacity
            onPress={()=>pagarComPix()}
            className="z-40 p-4 m-2 rounded-full" style={styles.button} >
                <Text className="text-center text-white font-bold" > Pagar Com Pix </Text>
            </TouchableOpacity>
                }

             <FlashMessage position="bottom" />

        </ScrollView>
        </GoogleOAuthProvider>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  userContainer:{
    backgroundColor: COLORS.darkBackground
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonDelete: {
    backgroundColor: COLORS.red,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
    price: {
      color: COLORS.income
    },
});
