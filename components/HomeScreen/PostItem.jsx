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
import { useEffect, useState } from "react";



export default function PostItem({item, isComprado}){
      const navigation=useNavigation()
      const bd = getFirestore(app)
      const [produtoRecebido, setProdutoRecebido] = useState(false);
      const [controlChange, setControlChange] = useState(false)
      const [compras, setCompras] = useState([]);

  
      
      
      

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
      

      const marcarComoRecebido = async (produtoId) => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        const db = getFirestore(app);
      
        const produtoRef = doc(db, 'historicoCompras', currentUser.uid, 'produtos', produtoId);
      
        await setDoc(produtoRef, { produtoRecebido: true }, { merge: true });
      
        // Atualiza localmente
        setCompras(prev =>
          prev.map(item =>
            item.id === produtoId ? { ...item, produtoRecebido: true } : item
          )
        );
      };
      


      useEffect(() => {
        const fetchCompras = async () => {
          const auth = getAuth();
          const currentUser = auth.currentUser;
          const db = getFirestore(app);
      
          if (!currentUser) return;
      
          const produtosRef = collection(db, 'historicoCompras', currentUser.uid, 'produtos');
          const snapshot = await getDocs(produtosRef);
      
          const lista = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
      
          setCompras(lista);
        };
      
        fetchCompras();
      }, []);


    return(
      <>
        {isComprado 
        ? 
        (
          <> 

            <View className="flex-1 m-2 p-4 rounded-lg border-[1px] border-slate-300 bg-white">
              <Text className="text-[16px] font-bold mb-2">{item.title}</Text>
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
           
              <View key={item.id} className=" rounded-lg border-gray-300 bg-white">
              {compras
                .filter((compra) => compra.id === item.id)
                .map((compra) => (
                  <View key={compra.id} className="rounded-lg bg-white">
                    <Text className="text-[16px] font-bold mb-2">{compra.titulo}</Text>

                    {compra.produtoRecebido ? (
                      <Text className="text-green-600 font-semibold p-2">Produto recebido ✅</Text>
                    ) : (
                      <TouchableOpacity
                        onPress={() => marcarComoRecebido(compra.id)}
                        className="mt-2 bg-green-500 px-4 py-2 rounded-full"
                      >
                        <Text className="text-white text-center font-semibold">
                          Marcar como recebido
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
              ))}


              </View>
            
            </View>

          </>

        ) 
        : 
        (
          <>
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
          </>
        )}   
      </>
    )
}

const styles = StyleSheet.create({
  price: {
    color: COLORS.income
  },
})