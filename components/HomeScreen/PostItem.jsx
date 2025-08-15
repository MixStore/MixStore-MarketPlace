import { Image, Text, TouchableOpacity, View,StyleSheet,AspectRatio } from "react-native";
import { COLORS } from "../../app/util/COLORS";
import { useNavigation } from "expo-router";
import { getAuth } from 'firebase/auth';
import { app } from "../../firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  getFirestore,
} from 'firebase/firestore';

export default function PostItem({item}){
      const navigation=useNavigation()
      const bd = getFirestore(app)
      

      const handlePress = async () => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
      
        if (!currentUser) return;
      
        const historicoRef = collection(bd, 'historico', currentUser.uid, 'produtos');
      
        (async () => {
          try {
            const q = query(historicoRef, where('produtoId', '==', item.id));
            const existing = await getDocs(q);
      
            if (existing.empty) {
              const allDocsQuery = query(historicoRef, orderBy('visualizadoEm', 'asc'));
              const allDocsSnapshot = await getDocs(allDocsQuery);
      
              if (allDocsSnapshot.size >= 8) {
                const oldestDoc = allDocsSnapshot.docs[0];
                await deleteDoc(oldestDoc.ref);
              }
      
              const newDocRef = doc(historicoRef, item.id);
              await setDoc(newDocRef, {
                produtoId: item.id,
                titulo: item.title,
                categoria: item.category,
                visualizadoEm: new Date(),
              });
            }
          } catch (error) {
            console.error('Erro ao salvar histórico:', error);
          }
        })();
      
        navigation.navigate('ProductDetailScreen', { product: item });
      };
      
      

    return(
        <TouchableOpacity onPress={handlePress} className="flex-1 m-2 p-2 rounded-lg border-[1px] border-slate-300 bg-white ">
          

          <Image
            source={{ uri: `data:image/jpeg;base64,${item?.imageBase64}` }}
            style={{
              width: '100%',
              height: 140,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#CBD5E1',
            }}
            resizeMode="contain"
          />
                    <View>
                        <Text className="text-gray-400 p-[2px] mt-1 rounded-full px-1 text-[10px] w-[70px]" >{item.category} </Text>
                        <Text className="text-[15px] font-bold mt-2"> {item.title} </Text>
                        <Text className="text-[20px] font-bold" style={styles.price}  >R$: {item.price} </Text>
                    </View>
                  </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  price: {
    color: COLORS.income
  },
})