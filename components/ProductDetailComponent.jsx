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

export default function ProductDetailComponent({params, navigation, productLink=null}){
    const[product, setProduct]=useState([])
    const user = getAuth().currentUser
    const db = getFirestore(app);

    useEffect(()=>{

        console.log("teste parametros",params)
        
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
            headerRight: () => (
              <Ionicons  onPress={()=>shareProduct()} name="share-social-sharp" size={24} color="white" style={{ marginRight: 15 }} />
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

    return(
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Image
                source={{ uri: `data:image/jpeg;base64,${product?.imageBase64}` }}
                className="w-full h-[320px]"
            />

            <View className="p-3">
            <Text className="text-[20px] font-bold">{product.title}</Text>
                <View className="items-baseline">
                    <Text className="bg-orange-100 text-gray-400 p-1 px-2 text-center  mt-2 rounded-full text-[10px] w-[70px]" >
                        {product.category}
                    </Text>
                </View>
            <Text className="mt-3 font-bold text-[20px]">Decription</Text>
            <Text className="text-[17px] text-gray-500">{product.desc}</Text>
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
            onPress={()=>sendEmailMessage()}
            className="z-40 p-4 m-2 rounded-full" style={styles.button} >
                <Text className="text-center text-white font-bold" >Enviar Mensagem</Text>
            </TouchableOpacity>
                }

        </ScrollView>
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
});
